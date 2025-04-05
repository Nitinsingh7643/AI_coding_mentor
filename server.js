require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Load API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file!");
    process.exit(1);
}

// API URL (Corrected Format)
const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home route
app.get('/', (req, res) => {
    res.render('index', { code: '', suggestions: null });
});

app.post('/', async (req, res) => {
    const userCode = req.body.code.trim();
    const suggestions = await getCodeSuggestions(userCode);
    res.render('index', { code: userCode, suggestions });
});

// Fetch code suggestions from Gemini API
async function getCodeSuggestions(code) {
    if (!code) return "⚠️ Please provide valid code input.";

    const prompt = `Analyze this code and suggest improvements:\n\n${code}`;
    
    try {
        const response = await axios.post(API_URL_GEMINI, {
            contents: [{ parts: [{ text: prompt }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data?.candidates?.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            return "⚠️ No suggestions received from Gemini API.";
        }
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return `❌ Error fetching suggestions: ${error.response?.data?.error?.message || error.message}`;
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔑 GEMINI API KEY: ${GEMINI_API_KEY ? "Loaded ✅" : "Not Loaded ❌"}`);
});
