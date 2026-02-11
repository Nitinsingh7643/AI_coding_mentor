require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const LanguageDetect = require('languagedetect');
const fs = require('fs');
const Diff = require('diff'); // Import diff library

const https = require('https');

const app = express();
const PORT = 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.use(express.json()); // ✅ Fix: Enable JSON parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const lngDetector = new LanguageDetect();

// 🏠 Home Page
app.get('/', (req, res) => {
  res.render('home');
});

// 🚀 Launch App Page — this is the fix
app.get('/app', (req, res) => {
  res.render('index', {
    code: '',
    suggestions: null,
    language: null,
    mode: 'improve',
    error: null
  });
});

// 📊 Dashboard Page
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// 🔁 Form Submission
app.post('/', async (req, res) => {
  const userCode = req.body.code.trim();
  const mode = req.body.mode || 'improve';

  if (!userCode) {
    return res.render('index', {
      code: '',
      suggestions: null,
      language: null,
      mode,
      error: '⚠️ Please enter some code to analyze.'
    });
  }

  const detectedLang = detectLanguage(userCode);

  try {
    const aiResponse = await getAIResponse(userCode, mode);

    let diff = null;
    if (aiResponse.improvedCode) {
      diff = Diff.diffLines(userCode, aiResponse.improvedCode);
    }

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({
        success: true,
        suggestions: aiResponse.analysis,
        improvedCode: aiResponse.improvedCode,
        timeComplexity: aiResponse.timeComplexity,
        spaceComplexity: aiResponse.spaceComplexity,
        diff: diff,
        language: detectedLang
      });
    }

    res.render('index', {
      code: aiResponse.improvedCode || userCode, // Update code editor with improved version if available
      suggestions: aiResponse.analysis,
      language: detectedLang,
      mode,
      error: null
    });
  } catch (error) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.render('index', {
      code: userCode,
      suggestions: null,
      language: detectedLang,
      mode,
      error: `❌ Error: ${error.message}`
    });
  }
});

function detectLanguage(code) {
  const detection = lngDetector.detect(code, 1);
  return detection.length > 0 ? detection[0][0] : 'Unknown';
}

async function getAIResponse(code, mode) {
  let prompt = '';
  switch (mode) {
    case 'explain':
      prompt = `Explain the following code and provide complexity analysis. Return a JSON object with keys: "analysis" (markdown explanation), "improvedCode" (null or code block if relevant), "timeComplexity" (e.g., "O(n)"), "spaceComplexity" (e.g., "O(1)"). Code:\n\n${code}`;
      break;
    case 'comment':
      prompt = `Add inline comments to the code. Return JSON with keys: "analysis" (brief summary), "improvedCode" (the commented code), "timeComplexity", "spaceComplexity". Code:\n\n${code}`;
      break;
    case 'debug':
      prompt = `Debug the following code. Return JSON with keys: "analysis" (explanation of bugs), "improvedCode" (fixed code), "timeComplexity", "spaceComplexity". Code:\n\n${code}`;
      break;
    default:
      prompt = `Optimize the following code. Return JSON with keys: "analysis" (explanation of changes), "improvedCode" (optimized code), "timeComplexity", "spaceComplexity". Code:\n\n${code}`;
  }

  const response = await axios.post(API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  }, {
    headers: { 'Content-Type': 'application/json' },
    httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
  });

  if (response.data?.candidates?.length > 0) {
    const rawText = response.data.candidates[0].content.parts[0].text.trim();
    // cleans up markdown code blocks if present (common with LLMs)
    const jsonString = rawText.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse AI JSON:", e);
      // Fallback: return raw text as analysis
      return {
        analysis: rawText,
        improvedCode: null,
        timeComplexity: "Unknown",
        spaceComplexity: "Unknown"
      };
    }
  } else {
    throw new Error('No suggestions received from Gemini API.');
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
