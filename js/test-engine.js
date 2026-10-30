// ExamOrbit - Computer Based Test (CBT) Simulator Engine

class CBTTestEngine {
  constructor() {
    this.activeTest = null;
    this.currentQuestionIdx = 0;
    this.userAnswers = {}; // { qId: optionIndex }
    this.questionStatus = {}; // { qId: 'answered' | 'unanswered' | 'marked' | 'marked_answered' }
    this.timeRemaining = 0; // seconds
    this.totalTestSeconds = 0;
    this.timerInterval = null;
    this.isTestActive = false;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.container = document.getElementById('test-interface-container');
    this.lobbyContainer = document.getElementById('test-lobby-container');
    this.testTitleEl = document.getElementById('cbt-test-title');
    this.testSubjectEl = document.getElementById('cbt-test-subject');
    this.timerEl = document.getElementById('cbt-timer-display');
    this.qNumBadge = document.getElementById('cbt-q-number-badge');
    this.qSubjectBadge = document.getElementById('cbt-q-subject-badge');
    this.qTextEl = document.getElementById('cbt-question-text');
    this.qOptionsContainer = document.getElementById('cbt-options-container');
    this.paletteContainer = document.getElementById('cbt-palette-grid');

    // Controls
    this.prevBtn = document.getElementById('cbt-prev-btn');
    this.nextBtn = document.getElementById('cbt-next-btn');
    this.clearBtn = document.getElementById('cbt-clear-btn');
    this.markBtn = document.getElementById('cbt-mark-review-btn');
    this.submitBtn = document.getElementById('cbt-submit-test-btn');

    // Counters
    this.countAnsweredEl = document.getElementById('cbt-count-answered');
    this.countUnansweredEl = document.getElementById('cbt-count-unanswered');
    this.countMarkedEl = document.getElementById('cbt-count-marked');
  }

  bindEvents() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.navigate(-1));
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.navigate(1));
    if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearCurrentResponse());
    if (this.markBtn) this.markBtn.addEventListener('click', () => this.toggleMarkForReview());
    if (this.submitBtn) this.submitBtn.addEventListener('click', () => this.confirmSubmit());
  }

  startTest(examKey, testId) {
    const exam = EXAM_DATA[examKey] || EXAM_DATA.jee;
    const test = exam.tests.find(t => t.id === testId) || exam.tests[0];

    if (!test || !test.questions || test.questions.length === 0) {
      alert("No questions found for this test.");
      return;
    }

    this.activeExam = exam;
    this.activeExamKey = examKey;
    this.activeTest = test;
    this.currentQuestionIdx = 0;
    this.userAnswers = {};
    this.questionStatus = {};

    test.questions.forEach(q => {
      this.questionStatus[q.id] = 'unanswered';
    });

    this.totalTestSeconds = (test.questions.length * 2.5 * 60); // Dynamic or fixed
    this.timeRemaining = this.totalTestSeconds;
    this.isTestActive = true;

    // Switch views
    if (this.lobbyContainer) this.lobbyContainer.classList.add('hidden');
    if (this.container) this.container.classList.remove('hidden');

    if (this.testTitleEl) this.testTitleEl.textContent = test.title;
    if (this.testSubjectEl) this.testSubjectEl.textContent = `${exam.name} • ${test.subject}`;

    this.startTimer();
    this.renderQuestion(0);
    this.renderPalette();
    this.updateSummaryCounts();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.timerInterval);
        alert("⏳ Time is up! Submitting your test automatically...");
        this.submitTest();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.timerEl) return;
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = this.timeRemaining % 60;
    this.timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (this.timeRemaining < 300) {
      this.timerEl.classList.add('text-red-400', 'animate-pulse');
    } else {
      this.timerEl.classList.remove('text-red-400', 'animate-pulse');
    }
  }

  renderQuestion(idx) {
    if (!this.activeTest || idx < 0 || idx >= this.activeTest.questions.length) return;
    this.currentQuestionIdx = idx;
    const q = this.activeTest.questions[idx];

    if (this.qNumBadge) this.qNumBadge.textContent = `Question ${idx + 1} of ${this.activeTest.questions.length}`;
    if (this.qSubjectBadge) this.qSubjectBadge.textContent = q.subject || 'General';
    if (this.qTextEl) this.qTextEl.textContent = q.question;

    if (this.qOptionsContainer) {
      this.qOptionsContainer.innerHTML = '';
      q.options.forEach((optText, optIdx) => {
        const isSelected = this.userAnswers[q.id] === optIdx;
        const optCard = document.createElement('div');
        optCard.className = `flex items-center gap-3 p-4 rounded-xl border transition cursor-pointer select-none ${
          isSelected 
            ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500' 
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
        }`;

        const letter = String.fromCharCode(65 + optIdx);
        optCard.innerHTML = `
          <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }">${letter}</div>
          <div class="flex-1 font-medium text-sm leading-relaxed">${optText}</div>
          <div class="w-5 h-5 rounded-full border flex items-center justify-center ${
            isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'
          }">
            ${isSelected ? '<i class="fas fa-check text-xs text-white"></i>' : ''}
          </div>
        `;

        optCard.addEventListener('click', () => {
          this.selectOption(q.id, optIdx);
        });

        this.qOptionsContainer.appendChild(optCard);
      });
    }

    if (this.prevBtn) this.prevBtn.disabled = idx === 0;
    if (this.nextBtn) this.nextBtn.textContent = idx === this.activeTest.questions.length - 1 ? 'Review Last' : 'Save & Next';

    this.updatePaletteActiveItem();
  }

  selectOption(qId, optIdx) {
    this.userAnswers[qId] = optIdx;
    if (this.questionStatus[qId] === 'marked') {
      this.questionStatus[qId] = 'marked_answered';
    } else {
      this.questionStatus[qId] = 'answered';
    }
    this.renderQuestion(this.currentQuestionIdx);
    this.renderPalette();
    this.updateSummaryCounts();
  }

  clearCurrentResponse() {
    const q = this.activeTest.questions[this.currentQuestionIdx];
    delete this.userAnswers[q.id];
    this.questionStatus[q.id] = 'unanswered';
    this.renderQuestion(this.currentQuestionIdx);
    this.renderPalette();
    this.updateSummaryCounts();
  }

  toggleMarkForReview() {
    const q = this.activeTest.questions[this.currentQuestionIdx];
    const isAnswered = this.userAnswers[q.id] !== undefined;

    if (this.questionStatus[q.id] === 'marked' || this.questionStatus[q.id] === 'marked_answered') {
      this.questionStatus[q.id] = isAnswered ? 'answered' : 'unanswered';
    } else {
      this.questionStatus[q.id] = isAnswered ? 'marked_answered' : 'marked';
    }

    this.renderPalette();
    this.updateSummaryCounts();
    this.navigate(1);
  }

  navigate(dir) {
    const nextIdx = this.currentQuestionIdx + dir;
    if (nextIdx >= 0 && nextIdx < this.activeTest.questions.length) {
      this.renderQuestion(nextIdx);
    }
  }

  renderPalette() {
    if (!this.paletteContainer || !this.activeTest) return;
    this.paletteContainer.innerHTML = '';

    this.activeTest.questions.forEach((q, idx) => {
      const status = this.questionStatus[q.id];
      const isCurrent = idx === this.currentQuestionIdx;

      let colorClass = 'bg-slate-800 text-slate-400 border-slate-700'; // unanswered
      if (status === 'answered') {
        colorClass = 'bg-emerald-600 text-white border-emerald-500';
      } else if (status === 'marked') {
        colorClass = 'bg-purple-600 text-white border-purple-500';
      } else if (status === 'marked_answered') {
        colorClass = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-purple-400';
      }

      if (isCurrent) {
        colorClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-900 font-bold';
      }

      const btn = document.createElement('button');
      btn.className = `w-9 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition hover:scale-105 ${colorClass}`;
      btn.textContent = idx + 1;
      btn.addEventListener('click', () => {
        this.renderQuestion(idx);
      });

      this.paletteContainer.appendChild(btn);
    });
  }

  updatePaletteActiveItem() {
    this.renderPalette();
  }

  updateSummaryCounts() {
    let answered = 0;
    let unanswered = 0;
    let marked = 0;

    Object.values(this.questionStatus).forEach(s => {
      if (s === 'answered' || s === 'marked_answered') answered++;
      if (s === 'unanswered') unanswered++;
      if (s === 'marked' || s === 'marked_answered') marked++;
    });

    if (this.countAnsweredEl) this.countAnsweredEl.textContent = answered;
    if (this.countUnansweredEl) this.countUnansweredEl.textContent = unanswered;
    if (this.countMarkedEl) this.countMarkedEl.textContent = marked;
  }

  confirmSubmit() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const totalCount = this.activeTest.questions.length;
    const unansweredCount = totalCount - answeredCount;

    const message = `Are you sure you want to submit?\n\n• Answered: ${answeredCount}\n• Unanswered: ${unansweredCount}\n• Total: ${totalCount}`;
    if (confirm(message)) {
      this.submitTest();
    }
  }

  submitTest() {
    clearInterval(this.timerInterval);
    this.isTestActive = false;

    const timeSpentSeconds = this.totalTestSeconds - this.timeRemaining;
    const result = this.calculateResults(timeSpentSeconds);

    // Save to test history in localStorage
    this.saveTestHistory(result);

    // Hide test view, switch to Analysis View
    if (this.container) this.container.classList.add('hidden');
    if (window.examApp) {
      window.examApp.switchTab('analysis');
      if (window.analysisEngine) {
        window.analysisEngine.renderReport(result);
      }
    }
  }

  calculateResults(timeSpentSeconds) {
    const marking = this.activeExam.markingScheme || { correct: 4, incorrect: -1, unattempted: 0 };
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    const maxScore = this.activeTest.questions.length * marking.correct;

    const subjectBreakdown = {};
    const questionReview = [];

    this.activeTest.questions.forEach((q, idx) => {
      const userChoice = this.userAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      const isAttempted = userChoice !== undefined;

      const sub = q.subject || 'General';
      if (!subjectBreakdown[sub]) {
        subjectBreakdown[sub] = { total: 0, correct: 0, incorrect: 0, unattempted: 0, score: 0 };
      }
      subjectBreakdown[sub].total++;

      if (isAttempted) {
        if (isCorrect) {
          correctCount++;
          totalScore += marking.correct;
          subjectBreakdown[sub].correct++;
          subjectBreakdown[sub].score += marking.correct;
        } else {
          incorrectCount++;
          totalScore += marking.incorrect;
          subjectBreakdown[sub].incorrect++;
          subjectBreakdown[sub].score += marking.incorrect;
        }
      } else {
        unattemptedCount++;
        totalScore += marking.unattempted;
        subjectBreakdown[sub].unattempted++;
      }

      questionReview.push({
        num: idx + 1,
        question: q.question,
        options: q.options,
        subject: sub,
        userChoice: userChoice,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        isAttempted: isAttempted,
        explanation: q.explanation
      });
    });

    const accuracy = (correctCount + incorrectCount > 0)
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
      : 0;

    // Percentile estimation simulation
    const normalizedRatio = Math.max(0, totalScore / maxScore);
    const percentile = Math.min(99.9, Math.max(25, Math.round((normalizedRatio * 65 + 34) * 10) / 10));

    return {
      testId: this.activeTest.id,
      testTitle: this.activeTest.title,
      examName: this.activeExam.name,
      timestamp: new Date().toISOString(),
      timeSpentSeconds: timeSpentSeconds,
      totalQuestions: this.activeTest.questions.length,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      unattemptedCount: unattemptedCount,
      totalScore: totalScore,
      maxScore: maxScore,
      accuracy: accuracy,
      percentile: percentile,
      subjectBreakdown: subjectBreakdown,
      questionReview: questionReview
    };
  }

  saveTestHistory(result) {
    try {
      const history = JSON.parse(localStorage.getItem('exam_orbit_test_history') || '[]');
      history.unshift(result);
      localStorage.setItem('exam_orbit_test_history', JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.error("Failed to save test history to localStorage", e);
    }
  }
}
