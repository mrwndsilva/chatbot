# chatbot
ChatBot AI Assistant is an intelligent conversational agent built to simulate human-like conversations and provide responses to user inputs in real-time. It can be integrated into websites, apps, or messaging platforms. The bot uses natural language processing (NLP) techniques and can be powered by rule-based logic

🔥 Features

 AI-powered chat via OpenAI GPT-4o or local fallback
 Voice recognition using browser APIs
 Text-to-Speech responses (TTS)
 Wake word activation (e.g., "Hey Jarvis")
 Stylish and responsive frontend UI (jarvis.html)
 Express backend with rate limiting, security (Helmet), and API endpoints
 Easily extensible for Claude, local LLMs, or other APIs
 Project Structure

JARVIS/
├── jarvis.html            # Frontend UI with JS class and visual effects
├── server.js              # Node.js Express server for OpenAI/Claude/local API
├── package_json.json      # Node package dependencies
├── launch.json            # VS Code Chrome debugger config
└── .env                   # Environment variables (not included by default)

x Setup Instructions

1. Install Dependencies

npm install

2.  Configure Environment Variables

Create a .env file in the root directory:

OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=http://localhost:8080
PORT=3001

You can also add ANTHROPIC_API_KEY for Claude support (optional).

3.  Run the Server

node server.js

Server will start on: http://localhost:3001

4. 🌐 Launch the Frontend

Open jarvis.html in Chrome directly, or use VS Code with launch.json to auto-open:

"configurations": [
  {
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome against localhost",
    "url": "http://localhost:8080",
    "webRoot": "${workspaceFolder}"
  }
]

You may serve the HTML via a static file server if needed (e.g. Live Server in VS Code).

 Available API Endpoints

POST /api/openai/chat – Send messages to OpenAI with context.

POST /api/anthropic/chat – Placeholder for Claude API.

POST /api/local/chat – Basic offline fallback responses.

GET  /api/health – Health check endpoint.

💡 Example Usage

POST /api/openai/chat
{
  "message": "What's the weather like?",
  "history": [],
  "temperature": 0.7,
  "max_tokens": 500
}

Response:

{
  "response": "I would need access to a weather API to answer that. Would you like help setting it up?",
  "model": "gpt-4o-mini"
}

! Security & Rate Limiting

Helmet for HTTP headers

CORS for frontend-backend access

Rate limiting: 100 requests per 15 min window per IP

👨‍💻 Developer Notes

Uses SpeechRecognition (browser) and speechSynthesis

All AI logic is in-browser, but offloaded to /api endpoints for processing

Frontend UI is fully contained in jarvis.html (HTML/CSS/JS bundled)

📜 License

MIT License. Use freely and modify for your own assistant.

👋 Credits

Built by [Merwin Dsilva]. Inspired by J.A.R.V.I.S. from Iron Man.

