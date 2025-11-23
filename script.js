document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // API Configuration
    const OPENROUTER_API_KEY = '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';
    const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const MODEL = "anthropic/claude-3-haiku";
    
    // Travel Concierge Configuration
    const CONCIERGE_NAME = "SAMR";
    const CONCIERGE_GREETING = {
        role: "assistant",
        content: `Hello! I'm ${CONCIERGE_NAME}, your personal travel and culture assistant. 🌍✈️\n\nI can help you with:\n• Cultural etiquette do's and don'ts\n• Must-try local foods\n• Travel planning tips\n• Dress code advice\n\nWhere shall we explore today?`
    };

    // Conversation History
    let conversationHistory = [
        {
            role: "system",
            content: `You are ${CONCIERGE_NAME}, a friendly but professional travel concierge. Follow these rules:
1. SPECIALIZE in travel destinations, cultural norms, dining etiquette, and trip planning
2. RESPOND in warm, helpful tone with bullet points/headings
3. USE relevant emojis (🌍🍜👔)
4. For off-topic requests, respond:
"${CONCIERGE_NAME} here! ✨ I specialize in travel and cultural advice. Try asking:
• 'What should I pack for Bali in December?'
• 'How to greet someone in Japan?'
• 'Best food markets in Bangkok?'"
5. NEVER answer non-travel questions, even if pressed`
        },
        CONCIERGE_GREETING
    ];

    // Enhanced Topic Validation
    function isTravelRelated(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Match any country/region/city name
        const locationMatch = /\b(india|japan|thailand|france|italy|spain|usa|u\.?s\.?|uk|china|dubai|bali|vietnam|korea|brazil|mexico|canada|australia)\b/i.test(lowerPrompt);
        
        // Match travel/etiquette keywords
        const keywordMatch = [
            // Travel terms
            'travel', 'trip', 'visit', 'destination', 'vacation', 'itinerary', 
            'sightseeing', 'tour', 'holiday', 'backpack', 'suitcase', 'pack',
            // Food terms
            'food', 'cuisine', 'dish', 'eat', 'dining', 'restaurant', 'meal',
            'breakfast', 'lunch', 'dinner', 'snack', 'street food', 'market',
            // Culture terms
            'etiquette', 'custom', 'culture', 'manner', 'norm', 'tradition',
            'polite', 'rude', 'behavior', 'greet', 'handshake', 'bow',
            // Practical terms
            'weather', 'season', 'month', 'wear', 'dress', 'attire', 'clothes',
            'hotel', 'hostel', 'flight', 'airport', 'train', 'bus', 'transport',
            // Recommendation terms
            'best', 'top', 'famous', 'popular', 'must', 'should', 'recommend',
            'advice', 'tip', 'suggestion'
        ].some(keyword => lowerPrompt.includes(keyword));
        
        return locationMatch || keywordMatch;
    }

    // Send Message Function
    async function sendMessage() {
        const query = userInput.value.trim();
        if (!query) return;
        
        // Add user message to UI immediately
        addMessage(query, 'user');
        userInput.value = '';
        
        // Show typing indicator
        const loadingId = showLoading();
        
        try {
            // Add to conversation history
            conversationHistory.push({ role: "user", content: query });
            
            // Get AI response
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'AI Cultural Guide'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: conversationHistory,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            
            const data = await response.json();
            
            // Process response
            if (data.choices?.[0]?.message) {
                const aiResponse = data.choices[0].message.content;
                
                // Add to conversation history
                conversationHistory.push({ role: "assistant", content: aiResponse });
                
                // Display response
                removeLoading(loadingId);
                addMessage(aiResponse, 'bot');
            } else {
                throw new Error("Unexpected API response format");
            }
        } catch (error) {
            console.error('Error:', error);
            removeLoading(loadingId);
            addMessage(`${CONCIERGE_NAME} is having connection issues 🛠️. Please try again shortly!`, 'bot');
        }
    }

    // Helper Functions
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = formatResponseText(text);
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatResponseText(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>') // Headings
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
            .replace(/^\s*-\s*(.*)$/gm, '<li>$1</li>') // List items
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/<li>.*?<\/li>/g, match => `<ul>${match}</ul>`); // Wrap lists
    }

    function showLoading() {
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message');
        loadingDiv.id = loadingId;
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content', 'loading-message');
        contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        
        loadingDiv.appendChild(contentDiv);
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return loadingId;
    }

    function removeLoading(id) {
        const loadingElement = document.getElementById(id);
        if (loadingElement) loadingElement.remove();
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
});
