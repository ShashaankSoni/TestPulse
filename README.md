# ⚡ TestPulse — India's Premier Competitive Exam & Celestial Study Station

A modern web application crafted for Indian students preparing for competitive exams like **JEE (Main & Advanced), NEET UG, UPSC Civil Services, CAT, GATE, SSC CGL, Banking (IBPS/SBI), and CLAT**.

Built with a cosmic aesthetic, featuring a **Computer-Based Test (CBT) simulator**, **comprehensive post-test analytics**, a **Keplerian Solar System study focus timer**, a **daily task and formula manager**, and a **personal Google Gemini AI Doubt Solver**.

---

## 🌟 Key Features

1. **Personalized Exam Onboarding & Selection**:
   - First-time visitors enter their name and choose their target competitive examination from a comprehensive list of Indian exams (JEE, NEET, UPSC, CAT, GATE, SSC, Banking, CLAT, etc.).
   - Switch active target exam at any time using the header exam badge.

2. **Full Computer-Based Test (CBT) Simulator**:
   - Mock tests reflecting official exam patterns and marking schemes (+4/-1 for JEE/NEET, +2/-0.66 for UPSC, +3/-1 for CAT).
   - Real-time countdown timer, dynamic question palette (Answered, Unanswered, Marked for Review), and instant submission.

3. **In-Depth Post-Test Diagnostic Analysis**:
   - Overall Score, Estimated All-India Percentile, Accuracy %, and Average Speed.
   - Sectional & Subject-wise breakdown (Correct, Incorrect, Skipped).
   - Interactive question-by-question review with step-by-step concept explanations.
   - "Ask AI Mentor to Explain This" button on every question for instant clarification.
   - Test history saved locally in `localStorage`.

4. **Aesthetic Solar System Study Timer**:
   - Realistic relative orbital speeds of all 8 planets (Mercury, Venus, Earth with Moon, Mars, Jupiter, Saturn with rings, Uranus, Neptune) governed by Kepler's laws.
   - Interactive celestial canvas: click or hover any planet to select your "Orbit Station".
   - Customizable study intervals (25m Pomodoro, 45m, 1 hr, 2 hrs, or custom).
   - Integrated Web Audio API cosmic binaural focus drone synthesizer (no external audio files required!).
   - Automatically records study hours to your dashboard streak.

5. **Aesthetic Task Manager & Study Notes**:
   - Daily task checklist with priority badges (High, Medium, Low), tags, and daily completion progress bar.
   - Color-coded formula pad and revision notebook with search and markdown formatting.

6. **AI Doubt Solver (Powered by Google Gemini API)**:
   - Connect your own free Google Gemini API key directly from Google AI Studio.
   - Saved securely in your browser's `localStorage` (never exposed to third-party backends).
   - Answers complex mathematical proofs, physics equations, chemistry reactions, and study strategies.

---

## 🚀 How to Run Locally in VS Code

### Option 1: Using VS Code "Live Server" Extension (Recommended)
1. Open **VS Code**.
2. Go to **File** > **Open Folder...** and select the `exam-orbit` directory.
3. Install the **Live Server** extension from the VS Code Extensions tab (`Ctrl+Shift+X` and search for "Live Server" by Ritwick Dey).
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. Your browser will automatically open `http://127.0.0.1:5500`.

### Option 2: Using Python (Already installed on your computer!)
Open your terminal or PowerShell inside the `exam-orbit` folder and run:
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 How to Create a GitHub Repository and Push

1. Open your terminal / PowerShell in the project directory:
   ```bash
   cd "C:\Users\Lenovo\.gemini\antigravity\scratch\exam-orbit"
   ```

2. Initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ExamOrbit competitive exam portal"
   ```

3. Create a new repository on [GitHub](https://github.com/new):
   - Name it `exam-orbit` (or any name you prefer).
   - Leave "Initialize with a README" unchecked.
   - Click **Create repository**.

4. Link and push to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/exam-orbit.git
   git push -u origin main
   ```

---

## ⚡ How to Deploy to Vercel (100% Free & Fast)

### Method A: Deploy via GitHub (Easiest)
1. Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Select your `exam-orbit` repository from the list and click **"Import"**.
4. In the Project Configuration:
   - Framework Preset: **Other** (Static Site)
   - Root Directory: `./`
5. Click **"Deploy"**.
6. Within 15 seconds, Vercel will provide your live URL (e.g., `https://exam-orbit.vercel.app`)!

---

## 🔑 How to Get and Connect Your Free Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with any Google account.
3. Click on the blue **"Get API key"** button on the left sidebar.
4. Click **"Create API key"** and copy your generated key (`AIzaSy...`).
5. In the TestPulse website, click the **"Gemini Key"** button in the top navigation bar, paste your key, and click **"Save & Connect Key"**.
6. That's it! Your AI Exam Mentor is now active.

---

## 📁 Project Structure

```
exam-orbit/
├── index.html              # Main single-page application entry point
├── vercel.json             # Vercel deployment configuration
├── package.json            # Package & build script definitions
├── .gitignore              # Git ignore rules
├── README.md               # Documentation and setup guide
├── css/
│   └── styles.css          # Custom cosmic & glassmorphism styling
└── js/
    ├── mock-tests-data.js  # Rich question bank for JEE, NEET, UPSC, CAT, etc.
    ├── solar-system.js     # Real relative orbital mechanics canvas & study timer
    ├── test-engine.js      # Computer-Based Test (CBT) simulator
    ├── analysis-engine.js  # Post-mock test diagnostic reports & solutions
    ├── tasks-notes.js      # Daily task checklist & formula notepad
    ├── ai-chat.js          # Google Gemini 1.5 Flash API integration
    └── app.js              # Application state & tab coordinator
```

---

## 📄 License
MIT License. Created for competitive exam aspirants across India.
