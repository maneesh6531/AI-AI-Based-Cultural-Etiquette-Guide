🌍 AI Cultural Etiquette Guide
Interactive Web App for Country-Based Cultural, Food & Travel Advice

This project is a responsive AI-powered cultural etiquette guide that allows users to ask about any country and instantly receive details such as traditions, food habits, travel tips, dress codes, and more.
Built using HTML, CSS, JavaScript, and powered by the OpenRouter AI API (Claude 3 Haiku).

📁 Project Structure

File	Description

index.html	Main UI layout for the chat interface
styles.css	Complete styling for the chat app with modern UI design
script.js	Handles AI requests, message rendering, and interaction logic

🚀 Features

🤖 AI Chat Integration

Uses Claude 3 Haiku model through OpenRouter API

Generates detailed responses about:

Cultural etiquette

Food habits

Tourist attractions

Dress codes

Weather suggestions

Travel tips

🎨 Modern & Responsive UI

Clean, minimal, mobile-friendly chat layout

Animated typing indicator

Smooth message flow

Stylish gradients and chat bubbles

🧠 Smart Travel Assistant Logic

AI responds only to travel-related queries

Detects:

Countries/regions

Travel keywords

Cultural and food terms

Redirects irrelevant questions politely

📦 Built-in Conversation Memory

Maintains chat history

Adds system-style prompts for consistent AI behavior

🛠️ Tech Stack

Frontend:

HTML5

CSS3

JavaScript (Vanilla JS)

AI Integration:

OpenRouter API

Claude 3 Haiku Model

Styling:

Custom CSS

FontAwesome Icons



🔑 API Key Usage

The project uses the OpenRouter API:

const OPENROUTER_API_KEY = "your-api-key";
const MODEL = "anthropic/claude-3-haiku";




🧩 How It Works

User enters a country or cultural question

Script sends a POST request to the OpenRouter endpoint

AI returns structured etiquette/travel guidance

Response is formatted into clean HTML and displayed in the chat interface

Conversation history is maintained for continuity

📚 Key Learning Outcomes

Integrating AI with frontend applications

Building chat UI systems

Using fetch() for API calls

Working with prompts & system messages

Designing responsive and aesthetic UIs

📌 Future Enhancements

Add country flag images automatically

Provide voice input & text-to-speech responses

Add multi-language support

Deploy using GitHub Pages / Netlify

Include map integration using Leaflet.js or Google Maps API

🙌 Acknowledgements

OpenRouter AI – API & model access

Claude 3 Haiku – Primary AI model

FontAwesome – Icons used in the UI
