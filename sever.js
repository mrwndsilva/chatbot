// server.js - Backend API for JARVIS AI Assistant
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// System prompt for JARVIS personality
const JARVIS_SYSTEM_PROMPT = `You are JARVIS, an advanced AI personal assistant inspired by the fictional AI from Iron Man. You are:

- Intelligent, helpful, and sophisticated
- Professional yet personable
- Capable of handling a wide variety of tasks
- Concise but thorough in your responses
- Able to maintain context across conversations
- Proactive in offering assistance

Keep responses conversational and helpful. When appropriate, offer to help with follow-up questions or related tasks.`;

// OpenAI Chat Endpoint
app.post('/api/openai/chat', async (req, res) => {
    try {
        const { message, history = [], temperature = 0.7, max_tokens = 500 } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required and must be a string' });
        }

        // Prepare messages for OpenAI API
        const messages = [
            { role: 'system', content: JARVIS_SYSTEM_PROMPT },
            ...history.slice(-10), // Include last 10 messages for context
            { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // or 'gpt-4' if you have access
            messages: messages,
            temperature: temperature,
            max_tokens: max_tokens,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        });

        const response = completion.choices[0].message.content;

        res.json({
            response: response,
            usage: completion.usage,
            model: completion.model
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        if (error.code === 'insufficient_quota') {
            res.status(402).json({ error: 'OpenAI API quota exceeded' });
        } else if (error.code === 'invalid_api_key') {
            res.status(401).json({ error: 'Invalid OpenAI API key' });
        } else {
            res.status(500).json({ error: 'Failed to process AI request' });
        }
    }
});

// Alternative: Anthropic Claude API endpoint
app.post('/api/anthropic/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        // This would require the Anthropic SDK
        // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        
        // For now, return a placeholder response
        res.json({
            response: "Anthropic Claude integration would go here. Please configure your Claude API key.",
            model: "claude-3-sonnet"
        });

    } catch (error) {
        console.error('Anthropic API Error:', error);
        res.status(500).json({ error: 'Failed to process Claude request' });
    }
});

// Local AI processing endpoint (for offline capabilities)
app.post('/api/local/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Simple local processing - in production, you might use:
        // - Hugging Face Transformers
        // - Local LLM like Ollama
        // - TensorFlow.js models
        
        const responses = getLocalResponses(message);
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        res.json({
            response: response,
            model: "local-processing"
        });

    } catch (error) {
        console.error('Local processing error:', error);
        res.status(500).json({ error: 'Local processing failed' });
    }
});

// Utility functions
function getLocalResponses(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return [
            "Hello! I'm JARVIS, running in local mode. How can I assist you?",
            "Hi there! Local processing is active. What can I help you with?"
        ];
    }
    
    if (lowerMessage.includes('weather')) {
        return [
            "I'd need weather API access to provide current conditions. Would you like me to help you set up weather integration?",
            "Weather data requires external API integration. I can help you configure weather services."
        ];
    }
    
    if (lowerMessage.includes('time')) {
        return [`The current time is ${new Date().toLocaleTimeString()}.`];
    }
    
    if (lowerMessage.includes('date')) {
        return [`Today is ${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}.`];
    }
    
    return [
        `I understand you're asking about "${message}". In local mode, I provide basic responses. For advanced AI capabilities, please configure OpenAI or Claude API integration.`,
        `That's an interesting question. I'm currently running in local mode with limited capabilities. Would you like help setting up full AI integration?`
    ];
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            openai: !!process.env.OPENAI_API_KEY,
            anthropic: !!process.env.ANTHROPIC_API_KEY
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 JARVIS API Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    
    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    }
    
    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  ANTHROPIC_API_KEY not found in environment variables');
    }
});

module.exports = app;