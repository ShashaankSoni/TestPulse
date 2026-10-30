// TestPulse - Main Application Controller & State Coordinator

class TestPulseApp {
  constructor() {
    this.currentStudent = null;
    this.currentExam = null;
    this.activeTab = 'dashboard';

    this.initUser();
    this.initNavigation();
    this.initModals();
    this.updateDashboardStats();
    this.renderExamLobby();
  }

  initUser() {
    try {
      const savedUser = JSON.parse(localStorage.getItem('exam_orbit_user'));
      if (savedUser && savedUser.name && savedUser.examId) {
        this.currentStudent = savedUser;
        this.currentExam = ALL_INDIAN_EXAMS.find(e => e.id === savedUser.examId) || ALL_INDIAN_EXAMS[0];
        this.updateUserUI();
      } else {
        // Trigger Onboarding Modal for first-time students
        this.showOnboardingModal();
      }
    } catch (e) {
      this.showOnboardingModal();
    }
  }

  showOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.renderOnboardingExamGrid();
    }
  }

  renderOnboardingExamGrid() {
    const grid = document.getElementById('onboarding-exam-grid');
    if (!grid) return;

    grid.innerHTML = ALL_INDIAN_EXAMS.map(exam => `
      <label class="relative flex flex-col p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-indigo-500/50 cursor-pointer transition select-none group">
        <input type="radio" name="onboarding-exam" value="${exam.id}" class="peer sr-only" ${exam.id === 'jee' ? 'checked' : ''}>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            ${exam.tag}
          </span>
          <div class="w-4 h-4 rounded-full border border-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
          </div>
        </div>
        <div class="font-bold text-white text-sm group-hover:text-indigo-300 transition">${exam.name}</div>
        <div class="text-xs text-slate-400 mt-1">${exam.desc}</div>
        <div class="absolute inset-0 rounded-2xl border-2 border-indigo-500 opacity-0 peer-checked:opacity-100 pointer-events-none transition"></div>
      </label>
    `).join('');
  }

  saveOnboarding() {
    const nameInput = document.getElementById('onboarding-student-name');
    const selectedRadio = document.querySelector('input[name="onboarding-exam"]:checked');

    const name = nameInput ? nameInput.value.trim() : '';
    const examId = selectedRadio ? selectedRadio.value : 'jee';

    if (!name) {
      alert("Please enter your name or aspirant alias.");
      return;
    }

    const userData = {
      name: name,
      examId: examId,
      joinedAt: new Date().toISOString(),
      streakDays: 1,
      totalStudyMinutes: 0
    };

    localStorage.setItem('exam_orbit_user', JSON.stringify(userData));
    this.currentStudent = userData;
    this.currentExam = ALL_INDIAN_EXAMS.find(e => e.id === examId) || ALL_INDIAN_EXAMS[0];

    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.classList.add('hidden');

    this.updateUserUI();
    this.updateDashboardStats();
    this.renderExamLobby();

    if (window.showToast) {
      window.showToast(`🚀 Welcome, ${name}! Your preparation portal on TestPulse for ${this.currentExam.name} is ready.`, 'success');
    }
  }

  updateUserUI() {
    if (!this.currentStudent || !this.currentExam) return;

    // Header & Dashboard student badges
    document.querySelectorAll('.student-name-display').forEach(el => {
      el.textContent = this.currentStudent.name;
    });

    document.querySelectorAll('.active-exam-name-display').forEach(el => {
      el.textContent = this.currentExam.name;
    });

    document.querySelectorAll('.active-exam-tag-display').forEach(el => {
      el.textContent = this.currentExam.tag;
    });
  }

  initNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Mobile nav toggles
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    if (mobileMenuBtn && mobileSidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileSidebar.classList.toggle('hidden');
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update active tab styles
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active-nav');
      } else {
        btn.classList.remove('active-nav');
      }
    });

    // Hide all view sections
    document.querySelectorAll('.tab-view-section').forEach(sec => {
      sec.classList.add('hidden');
    });

    // Show target section
    const target = document.getElementById(`view-${tabName}`);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Specific triggers
    if (tabName === 'timer' && window.solarEngine) {
      setTimeout(() => window.solarEngine.resize(), 100);
    }
    if (tabName === 'analysis' && window.analysisEngine) {
      window.analysisEngine.loadLatestOrHistory();
    }
    if (tabName === 'tests') {
      this.renderExamLobby();
    }
    if (tabName === 'dashboard') {
      this.updateDashboardStats();
    }

    // Close mobile menu if open
    const mobileSidebar = document.getElementById('mobile-sidebar');
    if (mobileSidebar) mobileSidebar.classList.add('hidden');
  }

  renderExamLobby() {
    const lobby = document.getElementById('test-lobby-grid');
    if (!lobby || !this.currentExam) return;

    const examKey = this.currentExam.id;
    const examData = EXAM_DATA[examKey] || EXAM_DATA.jee;

    lobby.innerHTML = examData.tests.map(test => `
      <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition duration-300 flex flex-col justify-between backdrop-blur-md group">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              ${examData.name}
            </span>
            <span class="text-xs text-slate-400 flex items-center gap-1">
              <i class="fas fa-clock"></i> ${test.questions.length * 3} mins
            </span>
          </div>

          <h3 class="text-lg font-bold text-white group-hover:text-indigo-300 transition mb-2">${test.title}</h3>
          <p class="text-xs text-slate-400 mb-6 leading-relaxed">${test.subject}</p>

          <div class="grid grid-cols-2 gap-2 text-center text-xs mb-6">
            <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <div class="text-white font-bold text-sm">${test.questions.length}</div>
              <div class="text-slate-400 text-[10px]">Questions</div>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
              <div class="text-emerald-400 font-bold text-sm">+${examData.markingScheme.correct} / ${examData.markingScheme.incorrect}</div>
              <div class="text-slate-400 text-[10px]">Marking Scheme</div>
            </div>
          </div>
        </div>

        <button onclick="window.cbtEngine.startTest('${examKey}', '${test.id}')" 
          class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs tracking-wide transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
          <i class="fas fa-play text-[10px]"></i> Launch Exam CBT
        </button>
      </div>
    `).join('');
  }

  updateDashboardStats() {
    try {
      const history = JSON.parse(localStorage.getItem('exam_orbit_test_history') || '[]');
      const tasks = JSON.parse(localStorage.getItem('exam_orbit_tasks') || '[]');
      const user = JSON.parse(localStorage.getItem('exam_orbit_user') || '{}');

      // Tests taken
      const testsCountEl = document.getElementById('stat-tests-taken');
      if (testsCountEl) testsCountEl.textContent = history.length;

      // Avg Score
      const avgScoreEl = document.getElementById('stat-avg-score');
      if (avgScoreEl) {
        if (history.length > 0) {
          const avg = Math.round(history.reduce((a, b) => a + (b.accuracy || 0), 0) / history.length);
          avgScoreEl.textContent = `${avg}%`;
        } else {
          avgScoreEl.textContent = '--';
        }
      }

      // Pending tasks
      const pendingTasksEl = document.getElementById('stat-pending-tasks');
      if (pendingTasksEl) {
        const pending = tasks.filter(t => !t.completed).length;
        pendingTasksEl.textContent = pending;
      }

      // Study time
      const studyMinutesEl = document.getElementById('stat-study-time');
      if (studyMinutesEl) {
        const mins = user.totalStudyMinutes || 0;
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        studyMinutesEl.textContent = hrs > 0 ? `${hrs}h ${remMins}m` : `${remMins}m`;
      }

      // Streak
      const streakEl = document.getElementById('stat-streak-days');
      if (streakEl) {
        streakEl.textContent = `${user.streakDays || 1} 🔥`;
      }
    } catch (e) {}
  }

  recordStudySession(minutes, stationName) {
    try {
      const user = JSON.parse(localStorage.getItem('exam_orbit_user') || '{}');
      user.totalStudyMinutes = (user.totalStudyMinutes || 0) + minutes;
      localStorage.setItem('exam_orbit_user', JSON.stringify(user));
      this.updateDashboardStats();
    } catch (e) {}
  }

  initModals() {
    // Exam Switcher Modal
    const switchExamBtn = document.getElementById('switch-exam-btn');
    const switchExamModal = document.getElementById('switch-exam-modal');
    const closeSwitchModalBtn = document.getElementById('close-switch-modal-btn');

    if (switchExamBtn && switchExamModal) {
      switchExamBtn.addEventListener('click', () => {
        this.renderSwitchExamList();
        switchExamModal.classList.remove('hidden');
      });
    }

    if (closeSwitchModalBtn && switchExamModal) {
      closeSwitchModalBtn.addEventListener('click', () => {
        switchExamModal.classList.add('hidden');
      });
    }

    // Onboarding complete button
    const completeOnboardingBtn = document.getElementById('complete-onboarding-btn');
    if (completeOnboardingBtn) {
      completeOnboardingBtn.addEventListener('click', () => this.saveOnboarding());
    }
  }

  renderSwitchExamList() {
    const list = document.getElementById('switch-exam-list');
    if (!list) return;

    list.innerHTML = ALL_INDIAN_EXAMS.map(exam => {
      const isSelected = this.currentExam && this.currentExam.id === exam.id;
      return `
        <div onclick="window.examApp.selectExam('${exam.id}')" class="p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
          isSelected 
            ? 'bg-indigo-600/20 border-indigo-500 text-white' 
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
        }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-white">${exam.name}</div>
              <div class="text-[11px] text-slate-400">${exam.tag} • ${exam.desc}</div>
            </div>
          </div>
          ${isSelected ? '<span class="text-xs text-indigo-400 font-bold px-2 py-1 rounded bg-indigo-500/20">Active</span>' : ''}
        </div>
      `;
    }).join('');
  }

  selectExam(examId) {
    const exam = ALL_INDIAN_EXAMS.find(e => e.id === examId);
    if (!exam) return;

    this.currentExam = exam;
    const user = JSON.parse(localStorage.getItem('exam_orbit_user') || '{}');
    user.examId = examId;
    localStorage.setItem('exam_orbit_user', JSON.stringify(user));

    const switchExamModal = document.getElementById('switch-exam-modal');
    if (switchExamModal) switchExamModal.classList.add('hidden');

    this.updateUserUI();
    this.renderExamLobby();

    if (window.showToast) {
      window.showToast(`🎯 Switched active target exam to ${exam.name}`, 'info');
    }
  }
}

// Global Toast System
window.showToast = function(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'border-emerald-500/40 bg-slate-950/95 text-emerald-300 shadow-emerald-500/10',
    info: 'border-indigo-500/40 bg-slate-950/95 text-indigo-200 shadow-indigo-500/10',
    warning: 'border-amber-500/40 bg-slate-950/95 text-amber-300 shadow-amber-500/10'
  };

  toast.className = `p-4 rounded-2xl border backdrop-blur-xl shadow-2xl text-xs font-medium transition-all duration-300 transform translate-y-3 opacity-0 pointer-events-auto flex items-center gap-3 ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Application Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.examApp = new TestPulseApp();
  window.studyTimerApp = new StudyTimer();
  window.solarEngine = new SolarSystemEngine('solar-system-canvas');
  window.studyTimerApp.solarEngine = window.solarEngine;
  window.cbtEngine = new CBTTestEngine();
  window.analysisEngine = new AnalysisEngine();
  window.taskManager = new TaskAndNotesManager();
  window.aiMentor = new AIMentorChat();
});
