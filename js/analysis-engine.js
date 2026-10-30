// TestPulse - Post-Test Deep Performance Analysis & Analytics Engine
// Completely rock-solid rendering with zero blank screen risk

class AnalysisEngine {
  constructor() {
    this.currentReport = null;
    this.activeFilter = 'all';

    this.initElements();
  }

  initElements() {
    this.container = document.getElementById('analysis-view-container');
    this.scoreCardEl = document.getElementById('analysis-score-card');
    this.subjectBreakdownEl = document.getElementById('analysis-subject-breakdown');
    this.insightsEl = document.getElementById('analysis-insights-container');
    this.questionsListEl = document.getElementById('analysis-questions-list');
    this.historyListEl = document.getElementById('analysis-history-list');

    // Filter buttons
    const filterBtns = document.querySelectorAll('.analysis-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.analysis-filter-btn').forEach(b => b.classList.remove('active-filter'));
        e.currentTarget.classList.add('active-filter');
        this.activeFilter = e.currentTarget.dataset.filter;
        this.renderQuestionList();
      });
    });
  }

  loadLatestOrHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('exam_orbit_test_history') || '[]');
      if (history.length > 0) {
        this.renderReport(history[0]);
      } else {
        this.renderEmptyState();
      }
      this.renderHistoryList();
    } catch (e) {
      console.error("Analysis load history error", e);
      this.renderEmptyState();
    }
  }

  renderEmptyState() {
    const reportSection = document.getElementById('analysis-report-wrapper');
    const emptySection = document.getElementById('analysis-empty-wrapper');

    if (reportSection) reportSection.classList.add('hidden');
    if (emptySection) emptySection.classList.remove('hidden');
  }

  renderReport(report) {
    if (!report) return;
    this.currentReport = report;

    const reportSection = document.getElementById('analysis-report-wrapper');
    const emptySection = document.getElementById('analysis-empty-wrapper');

    if (emptySection) emptySection.classList.add('hidden');
    if (reportSection) reportSection.classList.remove('hidden');

    const mins = Math.floor((report.timeSpentSeconds || 0) / 60);
    const secs = (report.timeSpentSeconds || 0) % 60;
    const timeFormatted = `${mins}m ${secs}s`;

    // 1. Render Score Card
    const scoreCard = document.getElementById('analysis-score-card');
    if (scoreCard) {
      const totalScore = report.totalScore !== undefined ? report.totalScore : 0;
      const maxScore = report.maxScore || 1;
      const pctMarks = Math.round((totalScore / maxScore) * 100);

      scoreCard.innerHTML = `
        <div class="bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-purple-950/40 p-6 md:p-8 rounded-3xl border border-indigo-500/30 backdrop-blur-xl mb-8 relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
                <i class="fas fa-medal"></i> Verified CBT Performance Report
              </div>
              <h2 class="text-2xl md:text-3xl font-extrabold text-white">${report.testTitle}</h2>
              <p class="text-slate-400 text-sm mt-1">Exam: <span class="text-slate-200 font-medium">${report.examName}</span> • Submitted on ${new Date(report.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-2">
                <i class="fas fa-file-download"></i> Print / Save PDF
              </button>
              <button onclick="window.examApp.switchTab('tests')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5">
                <i class="fas fa-redo"></i> Retake / New Mock
              </button>
            </div>
          </div>

          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div class="text-slate-400 text-xs font-medium mb-1">Score Obtained</div>
              <div class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                ${totalScore} <span class="text-base font-normal text-slate-500">/ ${maxScore}</span>
              </div>
              <div class="text-xs text-indigo-400 mt-1 font-medium">${pctMarks}% Marks</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div class="text-slate-400 text-xs font-medium mb-1">Estimated Percentile</div>
              <div class="text-3xl font-black text-amber-400">${report.percentile || 85}%ile</div>
              <div class="text-xs text-slate-400 mt-1">All India Standing</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div class="text-slate-400 text-xs font-medium mb-1">Accuracy Rate</div>
              <div class="text-3xl font-black text-emerald-400">${report.accuracy || 0}%</div>
              <div class="text-xs text-emerald-500/80 mt-1">${report.correctCount || 0} Correct / ${(report.correctCount || 0) + (report.incorrectCount || 0)} Attempted</div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div class="text-slate-400 text-xs font-medium mb-1">Pace & Time</div>
              <div class="text-3xl font-black text-cyan-400">${timeFormatted}</div>
              <div class="text-xs text-slate-400 mt-1">${report.totalQuestions} Questions Total</div>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Render Subject Breakdown
    const subjectContainer = document.getElementById('analysis-subject-breakdown');
    if (subjectContainer && report.subjectBreakdown) {
      let subjectHtml = '';
      Object.entries(report.subjectBreakdown).forEach(([subj, data]) => {
        const totalAttempted = data.correct + data.incorrect;
        const subAcc = totalAttempted > 0 ? Math.round((data.correct / totalAttempted) * 100) : 0;

        subjectHtml += `
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 transition">
            <div class="flex items-center justify-between mb-2">
              <div class="font-bold text-white text-sm">${subj}</div>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${
                subAcc >= 70 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                subAcc >= 40 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                'bg-red-500/15 text-red-400 border border-red-500/30'
              }">${subAcc}% Accuracy</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 text-center text-xs mb-2">
              <div class="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <span class="text-emerald-400 font-bold block">${data.correct}</span>
                <span class="text-slate-400 text-[10px]">Correct</span>
              </div>
              <div class="p-1.5 rounded-lg bg-red-950/30 border border-red-900/40">
                <span class="text-red-400 font-bold block">${data.incorrect}</span>
                <span class="text-slate-400 text-[10px]">Incorrect</span>
              </div>
              <div class="p-1.5 rounded-lg bg-slate-800/40 border border-slate-800">
                <span class="text-slate-400 font-bold block">${data.unattempted}</span>
                <span class="text-slate-500 text-[10px]">Skipped</span>
              </div>
            </div>

            <!-- Visual Bar -->
            <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div class="bg-emerald-500 h-full" style="width: ${(data.correct / (data.total || 1)) * 100}%"></div>
              <div class="bg-red-500 h-full" style="width: ${(data.incorrect / (data.total || 1)) * 100}%"></div>
              <div class="bg-slate-700 h-full" style="width: ${(data.unattempted / (data.total || 1)) * 100}%"></div>
            </div>
          </div>
        `;
      });
      subjectContainer.innerHTML = subjectHtml || '<div class="text-xs text-slate-500">General Breakdown</div>';
    }

    // 3. Render Diagnostic Insights
    const insightsContainer = document.getElementById('analysis-insights-container');
    if (insightsContainer && report.subjectBreakdown) {
      let bestSub = null;
      let worstSub = null;
      let bestScore = -999;
      let worstScore = 999;

      Object.entries(report.subjectBreakdown).forEach(([subj, data]) => {
        if (data.score > bestScore) {
          bestScore = data.score;
          bestSub = subj;
        }
        if (data.score < worstScore) {
          worstScore = data.score;
          worstSub = subj;
        }
      });

      insightsContainer.innerHTML = `
        <div class="space-y-3">
          <div class="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div class="flex items-center gap-3 mb-1.5">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                <i class="fas fa-trophy"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Dominant Area</h4>
                <div class="text-xs text-emerald-400 font-semibold">${bestSub || 'Consistent Across Sections'}</div>
              </div>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              High accuracy in ${bestSub || 'core concepts'}. Preserve this strength through rapid timed problem sets.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
            <div class="flex items-center gap-3 mb-1.5">
              <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                <i class="fas fa-bolt"></i>
              </div>
              <div>
                <h4 class="text-xs font-bold text-white">Focus Area</h4>
                <div class="text-xs text-amber-400 font-semibold">${worstSub || 'Negative Marking Control'}</div>
              </div>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Target revision in ${worstSub || 'unattempted topics'}. Click below on any question to request our AI Mentor for detailed solving tricks.
            </p>
          </div>
        </div>
      `;
    }

    // 4. Render Questions Detailed Review
    this.renderQuestionList();
    this.renderHistoryList();
  }

  renderQuestionList() {
    const listEl = document.getElementById('analysis-questions-list');
    if (!listEl || !this.currentReport || !this.currentReport.questionReview) return;

    const filtered = this.currentReport.questionReview.filter(q => {
      if (this.activeFilter === 'correct') return q.isCorrect;
      if (this.activeFilter === 'incorrect') return q.isAttempted && !q.isCorrect;
      if (this.activeFilter === 'unattempted') return !q.isAttempted;
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `<div class="p-8 text-center text-slate-500 text-xs">No questions found in this filter category.</div>`;
      return;
    }

    listEl.innerHTML = '';

    filtered.forEach((q, idx) => {
      let statusBadge = '';
      if (!q.isAttempted) {
        statusBadge = `<span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-700">Skipped (0 pts)</span>`;
      } else if (q.isCorrect) {
        statusBadge = `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/40"><i class="fas fa-check mr-1"></i> Correct</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/40"><i class="fas fa-times mr-1"></i> Incorrect</span>`;
      }

      const qCard = document.createElement('div');
      qCard.className = 'p-6 rounded-2xl bg-slate-900/70 border border-slate-800 mb-4 transition hover:border-slate-700';

      const optionsHtml = (q.options || []).map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isCorrectAnswer = i === q.correctAnswer;
        const isUserChoice = i === q.userChoice;

        let style = 'bg-slate-800/40 border-slate-800 text-slate-400';
        let badge = '';

        if (isCorrectAnswer) {
          style = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-medium';
          badge = `<span class="ml-auto text-xs text-emerald-400 font-semibold flex items-center gap-1"><i class="fas fa-check-circle"></i> Correct Answer</span>`;
        } else if (isUserChoice && !isCorrectAnswer) {
          style = 'bg-red-950/40 border-red-500/60 text-red-200 font-medium';
          badge = `<span class="ml-auto text-xs text-red-400 font-semibold flex items-center gap-1"><i class="fas fa-times-circle"></i> Your Choice</span>`;
        }

        return `
          <div class="flex items-center gap-3 p-3 rounded-xl border text-xs ${style}">
            <span class="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-300">${letter}</span>
            <span>${opt}</span>
            ${badge}
          </div>
        `;
      }).join('');

      qCard.innerHTML = `
        <div class="flex items-center justify-between gap-4 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">Q${q.num}</span>
            <span class="text-xs text-slate-400 font-medium">${q.subject || 'General'}</span>
          </div>
          ${statusBadge}
        </div>

        <p class="text-slate-200 text-sm font-medium mb-4 leading-relaxed">${q.question}</p>

        <!-- Options Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          ${optionsHtml}
        </div>

        <!-- Explanation Accordion -->
        <div class="mt-4 p-4 rounded-xl bg-slate-950/70 border border-indigo-900/30 text-xs">
          <div class="font-bold text-indigo-400 mb-1 flex items-center gap-2">
            <i class="fas fa-lightbulb"></i> Step-by-Step Concept & Solution:
          </div>
          <div class="text-slate-300 leading-relaxed font-sans mb-3">${q.explanation || 'No explanation provided.'}</div>
          
          <div class="flex justify-end pt-2 border-t border-slate-900">
            <button class="ask-ai-mentor-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition" data-q-num="${q.num}">
              <i class="fas fa-robot"></i> Ask AI Mentor to Explain This
            </button>
          </div>
        </div>
      `;

      // Safe event listener attachment (Zero inline onclick syntax error risk)
      const aiBtn = qCard.querySelector('.ask-ai-mentor-btn');
      if (aiBtn) {
        aiBtn.addEventListener('click', () => {
          if (window.aiMentor) {
            window.aiMentor.askAboutQuestion(q.question, q.explanation);
          }
        });
      }

      listEl.appendChild(qCard);
    });
  }

  renderHistoryList() {
    const listEl = document.getElementById('analysis-history-list');
    if (!listEl) return;

    try {
      const history = JSON.parse(localStorage.getItem('exam_orbit_test_history') || '[]');
      if (history.length === 0) {
        listEl.innerHTML = `<div class="col-span-full p-4 text-center text-slate-500 text-xs">No previous mock records.</div>`;
        return;
      }

      listEl.innerHTML = '';
      history.slice(0, 10).forEach((item, idx) => {
        const isCurrent = this.currentReport && this.currentReport.timestamp === item.timestamp;
        const card = document.createElement('div');
        card.className = `p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
          isCurrent ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
        }`;

        card.innerHTML = `
          <div>
            <div class="text-xs font-bold text-white">${item.testTitle}</div>
            <div class="text-[11px] text-slate-400">${new Date(item.timestamp).toLocaleDateString()} • Score: ${item.totalScore}/${item.maxScore}</div>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold ${item.accuracy >= 70 ? 'text-emerald-400' : 'text-amber-400'}">${item.accuracy}% Acc</span>
          </div>
        `;

        card.addEventListener('click', () => {
          this.renderReport(item);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        listEl.appendChild(card);
      });
    } catch (e) {
      listEl.innerHTML = '';
    }
  }
}
