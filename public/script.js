document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('form');
  const codeInput = document.getElementById('code');
  const aiOutput = document.getElementById('ai-output');
  const modeInput = document.getElementById('mode-input');

  // 1. Theme Persistence
  const theme = localStorage.getItem('theme');
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  updateThemeIcon();

  // 2. Form Submission (AJAX for Smoothness)
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const code = codeInput.value.trim();
      const mode = modeInput.value;

      if (!code) {
        alert("Please enter some code first!");
        return;
      }

      // Show Skeleton Loader
      showSkeleton();

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ code, mode })
        });

        const data = await response.json();
        if (data.success) {
          // Update Improved Code in Editor if available
          if (data.improvedCode) {
            codeInput.value = data.improvedCode;
          }

          const diffBtn = document.getElementById('diff-btn');
          if (data.diff && data.diff.length > 0) {
            diffBtn.style.display = 'block';
            window.currentDiff = data.diff;
          } else {
            if (diffBtn) diffBtn.style.display = 'none';
          }

          // On Success: Typewriter Effect
          renderSuccess(data.suggestions, data.language, data.timeComplexity, data.spaceComplexity);
        } else {
          renderError(data.error || "Unknown error occurred");
        }
      } catch (err) {
        renderError("Network Error: " + err.message);
      }
    });
  }

  // Helper: Show Skeleton
  function showSkeleton() {
    aiOutput.innerHTML = `
      <div class="skeleton-loader">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line long"></div>
      </div>
    `;
    const badgeContainer = document.getElementById('complexity-badges');
    if (badgeContainer) badgeContainer.innerHTML = '';
  }

  // Helper: Render Success with Typewriter
  function renderSuccess(suggestions, language, timeComplexity, spaceComplexity) {
    aiOutput.innerHTML = ''; // Clear previous content

    // Render Badges (only if data exists and is meaningful)
    const badgeContainer = document.getElementById('complexity-badges');
    if (badgeContainer) {
      let badgeHTML = '';
      if (timeComplexity && timeComplexity !== "Unknown") {
        badgeHTML += `<span class="badge" style="background:rgba(16, 185, 129, 0.2); color:#10b981; border:1px solid #10b981; margin-right:8px;">⏱️ ${timeComplexity}</span>`;
      }
      if (spaceComplexity && spaceComplexity !== "Unknown") {
        badgeHTML += `<span class="badge" style="background:rgba(59, 130, 246, 0.2); color:#3b82f6; border:1px solid #3b82f6;">💾 ${spaceComplexity}</span>`;
      }
      badgeContainer.innerHTML = badgeHTML;
    }

    // Create Markdown container
    const container = document.createElement('div');
    container.className = 'markdown-content';
    const pre = document.createElement('pre');
    const codeBlock = document.createElement('code');
    codeBlock.className = `language-${language ? language.toLowerCase() : 'plaintext'}`;
    pre.appendChild(codeBlock);
    container.appendChild(pre);
    aiOutput.appendChild(container);

    // Typewriter Logic
    let i = 0;
    const speed = 10; // ms per char

    function typeWriter() {
      if (typeof suggestions !== 'string') {
        // If suggestions is mistakenly an object, try to render safely
        console.warn("Suggestions is not a string:", suggestions);
        codeBlock.textContent = JSON.stringify(suggestions, null, 2);
        if (window.hljs) hljs.highlightElement(codeBlock);
        return;
      }

      if (i < suggestions.length) {
        codeBlock.textContent += suggestions.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        // Highlight syntax after typing is done
        if (window.hljs) hljs.highlightElement(codeBlock);
      }
    }

    typeWriter();
  }

  // Helper: Render Error
  function renderError(msg) {
    aiOutput.innerHTML = `
      <div class="error-msg" style="background:rgba(239, 68, 68, 0.1); border:1px solid var(--error); color:var(--error); padding:20px; border-radius:8px; text-align:center;">
        ❌ ${msg}
      </div>
    `;
  }

});

// Global Function: Toggle Theme
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.querySelector('.theme-toggle-btn');
  if (btn) {
    btn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
  }
}

function clearEditor() {
  const code = document.getElementById('code');
  if (code) code.value = '';
}

function copyToClipboard() {
  const code = document.querySelector('.markdown-content code');
  if (code) {
    navigator.clipboard.writeText(code.innerText).then(() => {
      alert('Copied!');
    });
  }
}

// Mode Selection Logic
function setMode(mode) {
  // Update hidden input
  const input = document.getElementById('mode-input');
  if (input) input.value = mode;

  // Update visual state of buttons
  const buttons = document.querySelectorAll('.mode-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    // Simple check: if button onclick matches mode
    if (btn.getAttribute('onclick').includes(mode)) {
      btn.classList.add('active');
    }
  });
}

// Voice Input
function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech recognition is not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  const voiceBtn = document.querySelector('.voice-btn');
  voiceBtn.classList.add('listening');

  recognition.onstart = () => {
    // Optionally: Play sound or visual cue
    console.log('Listening...');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('code').value += transcript;
    voiceBtn.classList.remove('listening');
  };

  recognition.onerror = (event) => {
    alert('Voice input error: ' + event.error);
    voiceBtn.classList.remove('listening');
  };

  recognition.onend = () => {
    voiceBtn.classList.remove('listening');
  };

  recognition.start();
}


// Diff View Logic
function toggleDiffView() {
  const container = document.querySelector('.markdown-content');
  if(!container) return;
  
  // Check if we already have a diff view rendered
  const existingDiff = document.querySelector('.diff-container');
  
  if (existingDiff) {
    // If visible, hide it. If implemented as toggle, maybe remove it or switch tabs.
    // Let's implement as: Diff replaces content, clicking again restores markdown.
    
    // Actually, let's make it a toggle between pure code/markdown and diff.
    const isShowingDiff = container.style.display === 'none';
    
    if (isShowingDiff) {
       // Restore Markdown
       container.style.display = 'block';
       existingDiff.style.display = 'none';
    } else {
       // Show Diff
       container.style.display = 'none';
       existingDiff.style.display = 'block';
    }
    return;
  }
  
  // First time rendering Diff
  if (!window.currentDiff) return;
  
  const diffDiv = document.createElement('div');
  diffDiv.className = 'diff-container';
  
  window.currentDiff.forEach(part => {
    const span = document.createElement('span');
    span.className = part.added ? 'diff-added' : part.removed ? 'diff-removed' : 'diff-unchanged';
    span.textContent = part.value;
    diffDiv.appendChild(span);
  });
  
  // Append to AI Output
  const aiOutput = document.getElementById('ai-output');
  aiOutput.appendChild(diffDiv);
  
  // Hide original markdown content
  container.style.display = 'none';
}


function toggleDiffView() {
  const container = document.querySelector('.markdown-content');
  const aiOutput = document.getElementById('ai-output');
  if(!container && !aiOutput) return;

  let diffContainer = document.querySelector('.diff-container');
  
  if (diffContainer) {
    // Toggle visibility
    if (diffContainer.style.display === 'none') {
       if(container) container.style.display = 'none';
       diffContainer.style.display = 'block';
    } else {
       if(container) container.style.display = 'block';
       diffContainer.style.display = 'none';
    }
    return;
  }

  // Create Diff View if it doesn't exist
  if (!window.currentDiff) return;

  diffContainer = document.createElement('div');
  diffContainer.className = 'diff-container';

  window.currentDiff.forEach(part => {
    const span = document.createElement('span');
    span.className = part.added ? 'diff-added' : part.removed ? 'diff-removed' : 'diff-unchanged';
    span.textContent = part.value;
    diffContainer.appendChild(span);
  });

  aiOutput.appendChild(diffContainer);
  if(container) container.style.display = 'none';
}

