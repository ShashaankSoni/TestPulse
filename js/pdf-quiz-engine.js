// TestPulse - PDF & Question Paper to CBT Quiz Generator Engine
// Uses PDF.js to extract text client-side and parses questions into interactive CBT mocks

class PDFQuizEngine {
  constructor() {
    this.extractedText = '';
    this.parsedQuestions = [];
    this.initElements();
    this.bindEvents();
    this.loadCustomTests();
  }

  initElements() {
    this.dropzone = document.getElementById('pdf-upload-dropzone');
    this.fileInput = document.getElementById('pdf-file-input');
    this.modal = document.getElementById('pdf-upload-modal');
    this.previewSection = document.getElementById('pdf-quiz-preview-section');
    this.statusEl = document.getElementById('pdf-parse-status');
    this.quizTitleInput = document.getElementById('custom-quiz-title');
    this.quizDurationInput = document.getElementById('custom-quiz-duration');
    this.startCustomQuizBtn = document.getElementById('start-custom-quiz-btn');
    this.parsedCountEl = document.getElementById('parsed-questions-count');
    this.parsedQuestionsList = document.getElementById('parsed-questions-preview');
  }

  bindEvents() {
    if (this.dropzone && this.fileInput) {
      this.dropzone.addEventListener('click', () => this.fileInput.click());
      
      this.dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropzone.classList.add('border-indigo-500', 'bg-indigo-500/10');
      });

      this.dropzone.addEventListener('dragleave', () => {
        this.dropzone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
      });

      this.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.processFile(e.dataTransfer.files[0]);
        }
      });

      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.processFile(e.target.files[0]);
        }
      });
    }

    if (this.startCustomQuizBtn) {
      this.startCustomQuizBtn.addEventListener('click', () => this.launchCustomQuiz());
    }
  }

  openUploadModal() {
    if (this.modal) this.modal.classList.remove('hidden');
  }

  closeUploadModal() {
    if (this.modal) this.modal.classList.add('hidden');
  }

  async processFile(file) {
    if (!file) return;

    if (this.statusEl) {
      this.statusEl.classList.remove('hidden');
      this.statusEl.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Reading & analyzing <strong>${file.name}</strong>...`;
    }

    try {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        await this.readPDF(file);
      } else {
        const text = await file.text();
        this.extractedText = text;
        this.parseQuestionsFromText(text, file.name);
      }
    } catch (err) {
      console.error("File processing error", err);
      if (this.statusEl) {
        this.statusEl.innerHTML = `<span class="text-rose-400"><i class="fas fa-exclamation-triangle mr-1"></i> Failed to read file: ${err.message}. Ensure it is a valid PDF or text document.</span>`;
      }
    }
  }

  async readPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    
    // Check if pdfjsLib is loaded
    if (typeof pdfjsLib === 'undefined') {
      throw new Error("PDF parser library is loading. Please retry in a few seconds.");
    }

    // Set worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `\n--- Page ${pageNum} ---\n` + pageText;
    }

    this.extractedText = fullText;
    await this.parseQuestionsFromText(fullText, file.name);
  }

  async parseQuestionsFromText(rawText, filename) {
    if (this.statusEl) {
      this.statusEl.innerHTML = `<i class="fas fa-cog fa-spin mr-2"></i> Parsing questions, options, and solutions...`;
    }

    // If student has Gemini API key connected, use Gemini to parse with extreme precision
    const apiKey = localStorage.getItem('exam_orbit_gemini_api_key');
    if (apiKey && apiKey.length > 10) {
      try {
        const aiQuestions = await this.parseWithGeminiAI(rawText, apiKey);
        if (aiQuestions && aiQuestions.length > 0) {
          this.onQuestionsParsed(aiQuestions, filename);
          return;
        }
      } catch (e) {
        console.warn("AI parsing fallback to heuristic regex parser", e);
      }
    }

    // Fallback: Smart Client-Side Heuristic Regex Parser
    const questions = this.heuristicRegexParser(rawText);
    if (questions.length > 0) {
      this.onQuestionsParsed(questions, filename);
    } else {
      if (this.statusEl) {
        this.statusEl.innerHTML = `
          <div class="text-amber-400">
            <i class="fas fa-info-circle mr-1"></i> No standard multiple-choice questions detected automatically.
            <div class="text-xs text-slate-400 mt-1">Tip: Connect your Gemini API key in the top right to enable intelligent AI parsing for non-standard PDF formats!</div>
          </div>
        `;
      }
    }
  }

  async parseWithGeminiAI(rawText, apiKey) {
    const prompt = `You are an expert exam paper converter.
Parse the following test paper text into a valid JSON array of multiple choice questions.
Format strictly as JSON:
[
  {
    "id": 1,
    "subject": "General",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation or solution here"
  }
]
Note: "correctAnswer" must be integer index (0 for A, 1 for B, 2 for C, 3 for D). If not indicated, deduce the correct answer.

Paper Text snippet:
${rawText.slice(0, 12000)}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
      })
    });

    if (!res.ok) throw new Error("Gemini AI API request failed");
    const data = await res.json();
    const rawReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON block
    const jsonMatch = rawReply.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  }

  heuristicRegexParser(text) {
    const questions = [];
    
    // Regex looking for: (Q1 or 1.) ... (A) ... (B) ... (C) ... (D) ...
    // Split into question blocks
    const lines = text.split(/\n+/);
    let currentQ = null;
    let qCounter = 1;

    // Pattern to identify question starter e.g. "1.", "Q1.", "Question 1"
    const qStartPattern = /^(?:Q(?:uestion)?\s*[\.:]?\s*|\b)(\d+)[\.\)]\s*(.*)/i;
    // Pattern to identify options
    const optPattern = /^[(\[]?([A-Da-d])[)\.]\s*(.*)/;
    const ansPattern = /(?:Ans(?:wer)?|Correct\s*Option)[\s\.:]+([A-D])/i;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const qMatch = trimmed.match(qStartPattern);
      const optMatch = trimmed.match(optPattern);
      const ansMatch = trimmed.match(ansPattern);

      if (qMatch && !optMatch) {
        if (currentQ && currentQ.options.length >= 2) {
          questions.push(currentQ);
        }
        currentQ = {
          id: qCounter++,
          subject: "Custom Quiz",
          question: qMatch[2] || trimmed,
          options: [],
          correctAnswer: 0,
          explanation: "Explanation generated from uploaded question paper."
        };
      } else if (optMatch && currentQ) {
        currentQ.options.push(optMatch[2] || trimmed);
      } else if (ansMatch && currentQ) {
        const letter = ansMatch[1].toUpperCase();
        currentQ.correctAnswer = letter.charCodeAt(0) - 65;
      } else if (currentQ) {
        if (currentQ.options.length === 0) {
          currentQ.question += ' ' + trimmed;
        } else {
          currentQ.options[currentQ.options.length - 1] += ' ' + trimmed;
        }
      }
    });

    if (currentQ && currentQ.options.length >= 2) {
      questions.push(currentQ);
    }

    // Default 4 options if some had 2 or 3
    questions.forEach(q => {
      while (q.options.length < 4) {
        q.options.push(`Option ${String.fromCharCode(65 + q.options.length)}`);
      }
    });

    return questions;
  }

  onQuestionsParsed(questions, filename) {
    this.parsedQuestions = questions;

    if (this.statusEl) {
      this.statusEl.innerHTML = `<span class="text-emerald-400 font-bold"><i class="fas fa-check-circle mr-1"></i> Successfully converted ${questions.length} questions from ${filename}!</span>`;
    }

    if (this.previewSection) this.previewSection.classList.remove('hidden');
    if (this.parsedCountEl) this.parsedCountEl.textContent = `${questions.length} Questions Ready`;
    if (this.quizTitleInput) this.quizTitleInput.value = filename.replace(/\.[^/.]+$/, "") + " (Custom Quiz)";
    if (this.quizDurationInput) this.quizDurationInput.value = Math.max(15, Math.round(questions.length * 2));

    // Render Preview
    if (this.parsedQuestionsList) {
      this.parsedQuestionsList.innerHTML = questions.slice(0, 5).map((q, idx) => `
        <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div class="font-bold text-white mb-1">Q${idx + 1}: ${q.question}</div>
          <div class="grid grid-cols-2 gap-1 text-slate-400 text-[11px] mt-2">
            ${q.options.map((opt, i) => `<div>${String.fromCharCode(65 + i)}) ${opt}</div>`).join('')}
          </div>
        </div>
      `).join('');

      if (questions.length > 5) {
        this.parsedQuestionsList.innerHTML += `<div class="text-center text-xs text-slate-500 py-1">+ ${questions.length - 5} more questions ready in this test paper</div>`;
      }
    }
  }

  launchCustomQuiz() {
    if (!this.parsedQuestions || this.parsedQuestions.length === 0) {
      alert("No questions available to start.");
      return;
    }

    const title = this.quizTitleInput ? this.quizTitleInput.value.trim() : "Custom Uploaded Quiz";
    const duration = parseInt(this.quizDurationInput ? this.quizDurationInput.value : "45", 10) || 45;

    const customTest = {
      id: "custom-" + Date.now(),
      title: title,
      subject: "Custom Uploaded Paper (" + this.parsedQuestions.length + " Qs)",
      examCategory: "Custom Upload",
      durationMinutes: duration,
      questions: this.parsedQuestions
    };

    // Save to persistent custom tests
    this.saveCustomTest(customTest);

    // Close modal
    this.closeUploadModal();

    // Inject into current exam tests and launch immediately in CBT engine!
    const activeExamKey = window.examApp?.currentExam?.id || 'jee';
    if (EXAM_DATA[activeExamKey]) {
      EXAM_DATA[activeExamKey].tests.unshift(customTest);
    }

    if (window.cbtEngine) {
      window.cbtEngine.startTest(activeExamKey, customTest.id);
      window.examApp.switchTab('tests');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (window.showToast) {
      window.showToast(`🚀 Custom CBT Quiz launched: "${title}"`, 'success');
    }
  }

  saveCustomTest(test) {
    try {
      const saved = JSON.parse(localStorage.getItem('testpulse_custom_tests') || '[]');
      saved.unshift(test);
      localStorage.setItem('testpulse_custom_tests', JSON.stringify(saved.slice(0, 15)));
    } catch (e) {}
  }

  loadCustomTests() {
    try {
      const saved = JSON.parse(localStorage.getItem('testpulse_custom_tests') || '[]');
      if (saved.length > 0) {
        // Prepend into current exams so they are always accessible
        const activeExamKey = window.examApp?.currentExam?.id || 'jee';
        if (EXAM_DATA[activeExamKey]) {
          saved.forEach(t => {
            if (!EXAM_DATA[activeExamKey].tests.some(x => x.id === t.id)) {
              EXAM_DATA[activeExamKey].tests.unshift(t);
            }
          });
        }
      }
    } catch (e) {}
  }
}
