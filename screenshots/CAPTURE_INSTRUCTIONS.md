# Screenshot Capture Instructions

## Quick Start

Since automated screenshot capture isn't available, here's how to manually capture screenshots:

### Option 1: Using Windows Snipping Tool (Recommended)

1. **Start the application**:
   ```powershell
   npm start
   ```

2. **Open Snipping Tool**:
   - Press `Windows + Shift + S`
   - Or search for "Snipping Tool" in Start menu

3. **Capture each page**:

   **Home Page** (`home-page.png`):
   - Navigate to: `http://localhost:3000`
   - Capture the full page (you may need to scroll and take multiple screenshots, then stitch them)
   - Save as: `screenshots/home-page.png`

   **Main Interface** (`main-interface.png`):
   - Navigate to: `http://localhost:3000/app`
   - Capture the interface before analyzing code
   - Save as: `screenshots/main-interface.png`

   **Code Analysis Result** (`code-analysis-result.png`):
   - On the app page, paste this sample code:
     ```javascript
     function fibonacci(n) {
       if (n <= 1) return n;
       return fibonacci(n - 1) + fibonacci(n - 2);
     }
     ```
   - Select "Improve" mode
   - Click "Analyze Code"
   - Wait for results
   - Capture the full results page
   - Save as: `screenshots/code-analysis-result.png`

   **Dashboard** (`dashboard.png`):
   - Navigate to: `http://localhost:3000/dashboard`
   - Capture the dashboard
   - Save as: `screenshots/dashboard.png`

   **Features Section** (`features-section.png`):
   - Navigate to: `http://localhost:3000`
   - Scroll to the "Powerful Features" section
   - Capture just the features grid
   - Save as: `screenshots/features-section.png`

   **Pricing Section** (`pricing-section.png`):
   - Navigate to: `http://localhost:3000`
   - Scroll to the "Simple, Transparent Pricing" section
   - Capture the pricing cards
   - Save as: `screenshots/pricing-section.png`

### Option 2: Using Browser Developer Tools

1. Open Chrome/Edge
2. Press `F12` to open DevTools
3. Press `Ctrl + Shift + P` to open command palette
4. Type "screenshot" and select:
   - "Capture full size screenshot" for full page
   - "Capture screenshot" for visible area

### Option 3: Using Browser Extensions

Install a screenshot extension like:
- **Awesome Screenshot** (Chrome/Edge)
- **Nimbus Screenshot** (Chrome/Edge/Firefox)
- **FireShot** (Chrome/Firefox)

These allow you to:
- Capture full page scrolling screenshots
- Annotate screenshots
- Save directly to your computer

## Screenshot Specifications

- **Format**: PNG (preferred)
- **Resolution**: At least 1920x1080 for desktop
- **Quality**: High quality, no compression
- **File Size**: Keep under 2MB per image

## After Capturing Screenshots

1. Verify all 6 screenshots are in the `screenshots/` folder
2. Check that filenames match exactly:
   - `home-page.png`
   - `main-interface.png`
   - `code-analysis-result.png`
   - `dashboard.png`
   - `features-section.png`
   - `pricing-section.png`

3. Commit and push:
   ```powershell
   git add screenshots/*.png
   git commit -m "Add application screenshots"
   git push origin main
   ```

4. View your README on GitHub to verify screenshots display correctly!

## Troubleshooting

**Screenshots not showing in README?**
- Check file names match exactly (case-sensitive)
- Ensure files are in the `screenshots/` directory
- Verify files are committed and pushed to GitHub
- Clear browser cache and refresh GitHub page

**Need better quality?**
- Use PNG format instead of JPG
- Capture at 100% browser zoom
- Use full HD resolution (1920x1080 or higher)
- Avoid browser extensions that modify page appearance
