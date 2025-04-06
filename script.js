document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Function to add a message to the chat
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (typeof content === 'string') {
            contentDiv.innerHTML = content;
        } else {
            contentDiv.appendChild(content);
        }
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollTop + messageDiv.offsetHeight + 20;
    }

    // Function to show loading indicator
    function showLoading(country) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="loading"></div> Researching ${country}...
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        return loadingDiv;
    }

    // Enhanced API fetch function with timeout
    async function fetchWithTimeout(resource, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    // Fetch country data with fallback
    async function fetchCountryData(countryName) {
        try {
            const response = await fetchWithTimeout(
                `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
            );
            
            if (!response.ok) throw new Error('Country not found');
            
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching country data:', error);
            return null;
        }
    }

    // Enhanced AI API call with better error handling
    async function fetchCulturalInfo(countryName) {
        const API_URL = 'https://api.deepseek.com/v1/chat/completions';
        const API_KEY = 'sk-3ac51f10f1f24192b962675b591540c3'; // Replace with your actual API key
        
        const prompt = `Provide a detailed cultural guide for ${countryName} including:
        1. Cultural etiquette (greetings, dining, general behavior)
        2. Food culture (popular dishes, dining customs)
        3. Transportation options and tips
        4. Top tourist attractions and travel advice
        5. Weather patterns and dress codes by season
        
        Format the response as JSON with these exact keys:
        {
            "etiquette": {
                "greeting": "",
                "dining": "",
                "general": ""
            },
            "food": {
                "popular": "",
                "diningTips": ""
            },
            "transportation": {
                "types": "",
                "tips": ""
            },
            "touristPlaces": {
                "top": "",
                "tips": ""
            },
            "culture": "",
            "weather": {
                "spring": "",
                "summer": "",
                "autumn": "",
                "winter": ""
            },
            "dress": {
                "spring": "",
                "summer": "",
                "autumn": "",
                "winter": ""
            }
        }`;
        
        try {
            const response = await fetchWithTimeout(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{role: "user", content: prompt}],
                    temperature: 0.7,
                    response_format: { type: "json_object" }
                })
            }, 8000); // 8 second timeout
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Parse the JSON content from the response
            try {
                return JSON.parse(data.choices[0].message.content);
            } catch (parseError) {
                console.error('Error parsing API response:', parseError);
                throw new Error('Invalid response format from API');
            }
            
        } catch (error) {
            console.error('Error fetching cultural info:', error);
            // Fallback to mock data if API fails
            return generateMockCulturalData(countryName);
        }
    }

    // Comprehensive mock data generator
    function generateMockCulturalData(countryName) {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        
        return {
            etiquette: {
                greeting: getRandomResponse([
                    `In ${countryName}, a firm handshake with direct eye contact is the standard greeting.`,
                    `People in ${countryName} typically greet with a slight bow and a smile.`,
                    `The traditional greeting in ${countryName} involves placing your hands together in a prayer position.`
                ]),
                dining: getRandomResponse([
                    `In ${countryName}, it's considered polite to try a bit of everything served to you.`,
                    `Dining etiquette in ${countryName} requires you to wait for the host to invite you to start eating.`,
                    `In ${countryName}, leaving a small amount of food on your plate shows you're satisfied.`
                ]),
                general: getRandomResponse([
                    `In ${countryName}, maintaining personal space is important in public settings.`,
                    `${countryName} culture values punctuality, so always arrive on time for appointments.`,
                    `In ${countryName}, it's customary to remove your shoes when entering someone's home.`
                ])
            },
            food: {
                popular: getRandomResponse([
                    `Traditional dishes include stews, grilled meats, and seasonal vegetables.`,
                    `The cuisine features a mix of spicy curries, flatbreads, and yogurt-based sauces.`,
                    `Local specialties often include seafood, rice dishes, and tropical fruits.`
                ]),
                diningTips: getRandomResponse([
                    `Always use your right hand for eating in ${countryName}.`,
                    `It's polite to compliment the chef on the meal in ${countryName}.`,
                    `In ${countryName}, sharing dishes family-style is common practice.`
                ])
            },
            transportation: {
                types: getRandomResponse([
                    `Extensive train network, buses, and affordable taxis.`,
                    `Modern metro system, ride-sharing apps, and bicycle rentals.`,
                    `Domestic flights, ferries, and well-maintained highways.`
                ]),
                tips: getRandomResponse([
                    `Purchase a transit pass for unlimited travel during your stay.`,
                    `Taxis are metered but negotiate the fare in advance for long trips.`,
                    `Trains are the most efficient way to travel between cities.`
                ])
            },
            touristPlaces: {
                top: getRandomResponse([
                    `The capital city, ancient ruins, and coastal resorts.`,
                    `Mountain ranges, national parks, and historic temples.`,
                    `Modern skyscrapers, traditional markets, and art museums.`
                ]),
                tips: getRandomResponse([
                    `Visit popular sites early in the morning to avoid crowds.`,
                    `Hire licensed guides at major historical attractions.`,
                    `Learn a few basic phrases in the local language before visiting.`
                ])
            },
            culture: getRandomResponse([
                `${countryName} has a rich cultural heritage blending ancient traditions with modern influences.`,
                `The culture emphasizes family values, respect for elders, and community ties.`,
                `${countryName}'s culture is known for its vibrant arts, music, and festival traditions.`
            ]),
            weather: Object.fromEntries(seasons.map(season => [
                season,
                getRandomResponse([
                    `Mild temperatures with occasional rainfall (15-25°C).`,
                    `Warm and sunny days perfect for outdoor activities (20-30°C).`,
                    `Cooler temperatures with crisp mornings and evenings (10-20°C).`,
                    `Cold weather with potential for snow in some regions (0-10°C).`
                ])
            ])),
            dress: Object.fromEntries(seasons.map(season => [
                season,
                getRandomResponse([
                    `Light layers with a jacket for cooler evenings.`,
                    `Breathable fabrics and sun protection are essential.`,
                    `Comfortable walking shoes and versatile clothing.`,
                    `Warm layers including a coat, hat, and gloves.`
                ])
            ]))
        };
    }

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Display country information
    async function displayCountryInfo(countryName) {
        const loadingElement = showLoading(countryName);
        
        try {
            const countryData = await fetchCountryData(countryName);
            if (!countryData) {
                chatMessages.removeChild(loadingElement);
                addMessage(`I couldn't find information about ${countryName}. Please try another country.`, false);
                return;
            }
            
            const culturalInfo = await fetchCulturalInfo(countryName);
            
            chatMessages.removeChild(loadingElement);
            
            const currency = countryData.currencies ? 
                Object.values(countryData.currencies)[0].name + " (" + 
                (Object.values(countryData.currencies)[0].symbol || "") + ")" : 
                "Information not available";
            
            const languages = countryData.languages ?
                Object.values(countryData.languages).join(", ") : 
                "Information not available";
            
            const capital = countryData.capital ? countryData.capital[0] : "Information not available";
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'country-info';
            
            infoDiv.innerHTML = `
                <h2>${countryData.name.common}</h2>
                <img class="flag" src="${countryData.flags.png}" alt="Flag of ${countryData.name.common}">
                
                <h3>Basic Information</h3>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Currency:</strong> ${currency}</p>
                <p><strong>Languages:</strong> ${languages}</p>
                <p><strong>Population:</strong> ${countryData.population?.toLocaleString() || 'N/A'}</p>
                
                <h3>Cultural Etiquette</h3>
                <p><strong>Greetings:</strong> ${culturalInfo.etiquette.greeting}</p>
                <p><strong>Dining:</strong> ${culturalInfo.etiquette.dining}</p>
                <p><strong>General Behavior:</strong> ${culturalInfo.etiquette.general}</p>
                
                <h3>Food Culture</h3>
                <p><strong>Popular Dishes:</strong> ${culturalInfo.food.popular}</p>
                <p><strong>Dining Tips:</strong> ${culturalInfo.food.diningTips}</p>
                
                <h3>Transportation</h3>
                <p><strong>Types:</strong> ${culturalInfo.transportation.types}</p>
                <p><strong>Tips:</strong> ${culturalInfo.transportation.tips}</p>
                
                <h3>Tourist Attractions</h3>
                <p><strong>Top Places:</strong> ${culturalInfo.touristPlaces.top}</p>
                <p><strong>Travel Tips:</strong> ${culturalInfo.touristPlaces.tips}</p>
                
                <h3>Culture</h3>
                <p>${culturalInfo.culture}</p>
                
                <h3>Weather and Dress Code</h3>
                <div class="weather-info">
                    ${Object.entries(culturalInfo.weather).map(([season, desc]) => `
                        <div class="weather-season">
                            <h4>${season.charAt(0).toUpperCase() + season.slice(1)}</h4>
                            <p>${desc}</p>
                            <p><strong>Dress:</strong> ${culturalInfo.dress[season]}</p>
                        </div>
                    `).join('')}
                </div>
                
                <p class="api-notice"><em>Some information may be simulated when API is unavailable.</em></p>
            `;
            
            addMessage(infoDiv, false);
            
        } catch (error) {
            console.error('Error:', error);
            chatMessages.removeChild(loadingElement);
            addMessage(`Sorry, I'm having trouble accessing cultural information for ${countryName}. Please try again later or ask about a different country.`, false);
        }
    }

    // Process user input
    function processInput() {
        const input = userInput.value.trim();
        if (!input) return;
        
        addMessage(input, true);
        userInput.value = '';
        displayCountryInfo(input);
    }

    // Event listeners
    sendButton.addEventListener('click', processInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') processInput();
    });
});