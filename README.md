# 🤖 AI Coding Mentor

An intelligent web application that helps developers improve, debug, and optimize their code using Google's Gemini AI. This tool provides real-time code analysis, suggestions, complexity calculations, and side-by-side code comparisons.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![Express](https://img.shields.io/badge/express-4.21.2-lightgrey.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Application Workflow](#-application-workflow)
- [API Integration](#-api-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **Code Improvement**: Optimize your code for better performance and readability
- **Code Explanation**: Get detailed explanations of how your code works
- **Inline Comments**: Automatically add meaningful comments to your code
- **Debug Assistance**: Identify and fix bugs in your code
- **Language Detection**: Automatic programming language detection
- **Complexity Analysis**: Time and space complexity calculations
- **Diff Viewer**: Side-by-side comparison of original vs improved code

### 🎨 User Experience
- **Modern UI**: Sleek, responsive design with glassmorphism effects
- **Syntax Highlighting**: Code editor with syntax highlighting using Highlight.js
- **Real-time Analysis**: Instant AI-powered code analysis
- **Multiple Modes**: Switch between improve, explain, comment, and debug modes
- **Dashboard**: Track your code analysis history and statistics

---

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **EJS**: Templating engine for dynamic HTML
- **Axios**: HTTP client for API requests
- **dotenv**: Environment variable management

### Frontend
- **HTML5/CSS3**: Modern web standards
- **JavaScript (ES6+)**: Client-side scripting
- **Highlight.js**: Syntax highlighting library
- **Diff Library**: Code comparison visualization

### AI Integration
- **Google Gemini AI**: Advanced language model (gemini-2.5-flash)
- **Language Detection**: Automatic programming language identification

### Additional Libraries
- **languagedetect**: Programming language detection
- **diff**: Text difference calculation
- **body-parser**: Request body parsing middleware

---

## 📁 Project Structure

```
Ai_project/
├── public/                    # Static assets
│   ├── script.js             # Client-side JavaScript
│   └── styles.css            # Application styles
├── views/                     # EJS templates
│   ├── home.ejs              # Landing page
│   ├── index.ejs             # Main application interface
│   └── dashboard.ejs         # Analytics dashboard
├── server.js                  # Express server & API logic
├── package.json               # Project dependencies
├── .env                       # Environment variables (not in repo)
├── .gitignore                # Git ignore rules
└── README.md                  # Project documentation
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **npm** (comes with Node.js)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nitinsingh7643/AI_coding_mentor.git
   cd AI_coding_mentor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create a .env file in the root directory
   touch .env
   ```

4. **Add your API key to `.env`**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   Navigate to: http://localhost:3000
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3000  # Optional, defaults to 3000
```

### API Configuration

The application uses Google's Gemini 2.5 Flash model. You can modify the model in `server.js`:

```javascript
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
```

---

## 💻 Usage

### 1. **Home Page**
- Visit `http://localhost:3000`
- Click "Launch App" to start analyzing code

### 2. **Code Analysis**
- Paste or type your code in the editor
- Select a mode:
  - **Improve**: Optimize code for better performance
  - **Explain**: Get detailed code explanations
  - **Comment**: Add inline comments
  - **Debug**: Find and fix bugs
- Click "Analyze Code"
- View results with complexity analysis and improved code

### 3. **Dashboard**
- Access via navigation menu
- View your code analysis history
- Track improvements and statistics

---

## 🔄 Application Workflow

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │
       │ HTTP Request (POST /analyze)
       ▼
┌─────────────────────────────────┐
│      Express.js Server          │
│  ┌──────────────────────────┐  │
│  │  1. Receive Code Input   │  │
│  └────────┬─────────────────┘  │
│           │                     │
│  ┌────────▼─────────────────┐  │
│  │  2. Detect Language      │  │
│  │     (languagedetect)     │  │
│  └────────┬─────────────────┘  │
│           │                     │
│  ┌────────▼─────────────────┐  │
│  │  3. Build AI Prompt      │  │
│  │     (based on mode)      │  │
│  └────────┬─────────────────┘  │
│           │                     │
│           │ API Request
│           ▼
│  ┌─────────────────────────┐   │
│  │   Google Gemini API     │   │
│  │  (gemini-2.5-flash)     │   │
│  └────────┬────────────────┘   │
│           │ JSON Response       │
│           │                     │
│  ┌────────▼─────────────────┐  │
│  │  4. Parse AI Response    │  │
│  │     - Analysis           │  │
│  │     - Improved Code      │  │
│  │     - Complexity         │  │
│  └────────┬─────────────────┘  │
│           │                     │
│  ┌────────▼─────────────────┐  │
│  │  5. Generate Diff        │  │
│  │     (original vs new)    │  │
│  └────────┬─────────────────┘  │
│           │                     │
│  ┌────────▼─────────────────┐  │
│  │  6. Render Response      │  │
│  │     (EJS Template)       │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
       │
       │ HTML Response
       ▼
┌─────────────┐
│   Browser   │
│  (Display)  │
└─────────────┘
```

### Detailed Request Flow

#### 1. **User Submits Code**
```javascript
// Client-side (script.js)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = codeInput.value;
  const mode = modeSelect.value;
  
  // Send to server
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, mode })
  });
});
```

#### 2. **Server Processes Request**
```javascript
// Server-side (server.js)
app.post('/', async (req, res) => {
  const userCode = req.body.code.trim();
  const mode = req.body.mode || 'improve';
  
  // Detect language
  const detectedLang = detectLanguage(userCode);
  
  // Get AI response
  const aiResponse = await getAIResponse(userCode, mode);
  
  // Generate diff
  const diff = Diff.diffLines(userCode, aiResponse.improvedCode);
  
  // Return JSON response
  res.json({
    suggestions: aiResponse.analysis,
    improvedCode: aiResponse.improvedCode,
    timeComplexity: aiResponse.timeComplexity,
    spaceComplexity: aiResponse.spaceComplexity,
    diff: diff
  });
});
```

#### 3. **AI Prompt Construction**
```javascript
// Different prompts for different modes
switch (mode) {
  case 'explain':
    prompt = `Explain the following code and provide complexity analysis...`;
    break;
  case 'comment':
    prompt = `Add inline comments to the code...`;
    break;
  case 'debug':
    prompt = `Debug the following code...`;
    break;
  default:
    prompt = `Optimize the following code...`;
}
```

#### 4. **Gemini API Response Format**
```json
{
  "analysis": "Detailed markdown explanation of the code...",
  "improvedCode": "// Optimized version of the code\nfunction example() {...}",
  "timeComplexity": "O(n log n)",
  "spaceComplexity": "O(n)"
}
```

#### 5. **Client Displays Results**
```javascript
// Update UI with results
suggestionsDiv.innerHTML = marked.parse(data.suggestions);
improvedCodePre.textContent = data.improvedCode;
complexityDiv.innerHTML = `
  <p>Time: ${data.timeComplexity}</p>
  <p>Space: ${data.spaceComplexity}</p>
`;
```

---

## 🔌 API Integration

### Gemini API Endpoint

```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

### Request Structure

```javascript
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here with code and instructions"
        }
      ]
    }
  ]
}
```

### Response Handling

```javascript
async function getAIResponse(code, mode) {
  const response = await axios.post(API_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const rawText = response.data.candidates[0].content.parts[0].text;
  const jsonString = rawText.replace(/```json|```/g, '').trim();
  
  return JSON.parse(jsonString);
}
```

---

## 📸 Screenshots

### Landing Page
The home page features a modern, clean design with a hero section and call-to-action button to launch the application.

**Features:**
- Glassmorphism design elements
- Gradient backgrounds
- Responsive layout
- Modern typography

### Main Application Interface
The main interface includes:
- **Code Editor**: Syntax-highlighted input area
- **Mode Selector**: Choose between improve, explain, comment, debug
- **Results Panel**: AI analysis and suggestions
- **Diff Viewer**: Side-by-side code comparison
- **Complexity Metrics**: Time and space complexity display

### Dashboard
Analytics and history tracking:
- Recent code analyses
- Language distribution
- Improvement statistics
- Usage metrics

---

## 🎯 Key Features Explained

### 1. **Language Detection**
```javascript
function detectLanguage(code) {
  const lngDetector = new LanguageDetect();
  const detection = lngDetector.detect(code, 1);
  return detection.length > 0 ? detection[0][0] : 'Unknown';
}
```

### 2. **Code Diff Generation**
```javascript
const diff = Diff.diffLines(originalCode, improvedCode);
// Returns array of changes:
// { added: true, value: "new line" }
// { removed: true, value: "old line" }
// { value: "unchanged line" }
```

### 3. **Syntax Highlighting**
```javascript
// Using Highlight.js
hljs.highlightAll();
```

### 4. **Error Handling**
```javascript
try {
  const aiResponse = await getAIResponse(userCode, mode);
  // Process response
} catch (error) {
  res.render('index', {
    error: `❌ Error: ${error.message}`
  });
}
```

---

## 🔒 Security Considerations

1. **API Key Protection**: Never commit `.env` file to version control
2. **Input Validation**: Code input is validated before processing
3. **HTTPS**: API calls use HTTPS for secure communication
4. **Rate Limiting**: Consider implementing rate limiting for production
5. **CORS**: Configure CORS policies for production deployment

---

## 🚀 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_api_key

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Nitin Singh**
- GitHub: [@Nitinsingh7643](https://github.com/Nitinsingh7643)
- Repository: [AI_coding_mentor](https://github.com/Nitinsingh7643/AI_coding_mentor)

---

## 🙏 Acknowledgments

- Google Gemini AI for providing the AI capabilities
- Highlight.js for syntax highlighting
- Express.js community for excellent documentation
- All contributors and users of this project

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/Nitinsingh7643/AI_coding_mentor/issues)
- Check existing issues for solutions
- Contribute to discussions

---

## 🗺️ Roadmap

- [ ] Add user authentication
- [ ] Implement code history storage
- [ ] Support for more AI models
- [ ] Real-time collaboration features
- [ ] Mobile app version
- [ ] VS Code extension
- [ ] Advanced analytics dashboard
- [ ] Code snippet library
- [ ] Team collaboration features

---

**Made with ❤️ by Nitin Singh**
