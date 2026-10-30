// ExamOrbit - Clean & Aesthetic Task Manager & Study Notes Engine

class TaskAndNotesManager {
  constructor() {
    this.tasks = [];
    this.notes = [];
    this.currentTaskFilter = 'all';
    this.activeNoteId = null;

    this.loadData();
    this.initElements();
    this.bindEvents();
    this.renderTasks();
    this.renderNotes();
  }

  loadData() {
    try {
      this.tasks = JSON.parse(localStorage.getItem('exam_orbit_tasks') || '[]');
      if (this.tasks.length === 0) {
        // Starter sample tasks tailored for competitive exam aspirants
        this.tasks = [
          {
            id: 'task-1',
            text: 'Solve 25 Previous Year Questions (PYQs) with timer',
            priority: 'high',
            tag: 'Problem Practice',
            estimatedTime: '45 mins',
            completed: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 'task-2',
            text: 'Analyze errors from yesterday\'s Full Mock Test',
            priority: 'high',
            tag: 'Mock Analysis',
            estimatedTime: '1 hr',
            completed: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 'task-3',
            text: 'Revise high-weightage formula & theorem cheat sheet',
            priority: 'medium',
            tag: 'Quick Revision',
            estimatedTime: '30 mins',
            completed: false,
            createdAt: new Date().toISOString()
          }
        ];
        this.saveTasks();
      }

      this.notes = JSON.parse(localStorage.getItem('exam_orbit_notes') || '[]');
      if (this.notes.length === 0) {
        this.notes = [
          {
            id: 'note-1',
            title: 'Top Mistakes to Avoid in Examination CBT Hall',
            tag: 'Strategy',
            color: 'indigo',
            content: `1. Never get stuck on any single question for more than 2.5 minutes.\n2. In the first 45 minutes, sweep through and solve all 100% sure questions first (Round 1).\n3. Keep strict control over negative marking — wild guesses ruin top percentiles.\n4. Stay hydrated and practice breathing reset during the exam.`,
            updatedAt: new Date().toISOString()
          },
          {
            id: 'note-2',
            title: 'Quick Revision Mnemonics & Formula Sheet',
            tag: 'Formulas',
            color: 'emerald',
            content: `• Standard reduction potential: E°_cell = E°_cathode - E°_anode\n• Doppler Effect in Sound: f' = f * [(v ± v_o) / (v ∓ v_s)]\n• Principle of Inclusion-Exclusion: n(A ∪ B) = n(A) + n(B) - n(A ∩ B)\n• Fundamental Rights: Articles 14 to 32 (Part III of Indian Constitution)`,
            updatedAt: new Date().toISOString()
          }
        ];
        this.saveNotes();
      }
    } catch (e) {
      this.tasks = [];
      this.notes = [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('exam_orbit_tasks', JSON.stringify(this.tasks));
      if (window.examApp) {
        window.examApp.updateDashboardStats();
      }
    } catch (e) {}
  }

  saveNotes() {
    try {
      localStorage.setItem('exam_orbit_notes', JSON.stringify(this.notes));
    } catch (e) {}
  }

  initElements() {
    // Task elements
    this.taskInput = document.getElementById('new-task-text');
    this.taskPriority = document.getElementById('new-task-priority');
    this.taskTag = document.getElementById('new-task-tag');
    this.addTaskBtn = document.getElementById('add-task-btn');
    this.taskListEl = document.getElementById('task-list-container');
    this.taskProgressBar = document.getElementById('task-progress-bar');
    this.taskProgressText = document.getElementById('task-progress-text');

    // Note elements
    this.noteTitleInput = document.getElementById('note-title-input');
    this.noteContentInput = document.getElementById('note-content-input');
    this.noteTagInput = document.getElementById('note-tag-input');
    this.noteColorSelect = document.getElementById('note-color-select');
    this.saveNoteBtn = document.getElementById('save-note-btn');
    this.newNoteBtn = document.getElementById('new-note-btn');
    this.notesGridEl = document.getElementById('notes-grid-container');
    this.searchNotesInput = document.getElementById('search-notes-input');

    // Filter tabs
    document.querySelectorAll('.task-filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.task-filter-tab').forEach(t => t.classList.remove('active-task-tab'));
        e.currentTarget.classList.add('active-task-tab');
        this.currentTaskFilter = e.currentTarget.dataset.filter;
        this.renderTasks();
      });
    });
  }

  bindEvents() {
    if (this.addTaskBtn) {
      this.addTaskBtn.addEventListener('click', () => this.addTask());
    }
    if (this.taskInput) {
      this.taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.addTask();
      });
    }

    if (this.saveNoteBtn) {
      this.saveNoteBtn.addEventListener('click', () => this.saveCurrentNote());
    }
    if (this.newNoteBtn) {
      this.newNoteBtn.addEventListener('click', () => this.resetNoteEditor());
    }
    if (this.searchNotesInput) {
      this.searchNotesInput.addEventListener('input', (e) => this.renderNotes(e.target.value));
    }
  }

  addTask() {
    const text = this.taskInput ? this.taskInput.value.trim() : '';
    if (!text) return;

    const newTask = {
      id: 'task-' + Date.now(),
      text: text,
      priority: this.taskPriority ? this.taskPriority.value : 'medium',
      tag: this.taskTag ? this.taskTag.value : 'General',
      estimatedTime: '30 mins',
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(newTask);
    this.saveTasks();
    if (this.taskInput) this.taskInput.value = '';
    this.renderTasks();

    if (window.showToast) {
      window.showToast('🎯 New daily task added!', 'success');
    }
  }

  toggleTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.completed = !task.completed;
    this.saveTasks();
    this.renderTasks();

    if (task.completed && window.showToast) {
      window.showToast('✅ Awesome! Task completed.', 'success');
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveTasks();
    this.renderTasks();
  }

  renderTasks() {
    if (!this.taskListEl) return;

    const filtered = this.tasks.filter(t => {
      if (this.currentTaskFilter === 'pending') return !t.completed;
      if (this.currentTaskFilter === 'completed') return t.completed;
      return true;
    });

    // Update Progress
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (this.taskProgressBar) {
      this.taskProgressBar.style.width = `${pct}%`;
    }
    if (this.taskProgressText) {
      this.taskProgressText.textContent = `${completed} of ${total} tasks completed (${pct}%)`;
    }

    if (filtered.length === 0) {
      this.taskListEl.innerHTML = `
        <div class="py-12 text-center text-slate-500 text-sm">
          <i class="fas fa-clipboard-check text-3xl mb-3 block text-slate-600"></i>
          No tasks found in this view. Add a new task above!
        </div>
      `;
      return;
    }

    this.taskListEl.innerHTML = filtered.map(t => {
      const priorityColors = {
        high: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        low: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
      };

      return `
        <div class="flex items-center gap-3 p-3.5 rounded-xl border transition ${
          t.completed 
            ? 'bg-slate-900/40 border-slate-800/60 opacity-60' 
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
        }">
          <button onclick="window.taskManager.toggleTask('${t.id}')" class="w-6 h-6 rounded-lg border flex items-center justify-center transition ${
            t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 hover:border-indigo-400'
          }">
            ${t.completed ? '<i class="fas fa-check text-xs"></i>' : ''}
          </button>

          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'} truncate">
              ${t.text}
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] px-2 py-0.5 rounded-md border font-semibold uppercase ${priorityColors[t.priority] || priorityColors.medium}">
                ${t.priority}
              </span>
              <span class="text-[11px] text-slate-500">• ${t.tag}</span>
            </div>
          </div>

          <button onclick="window.taskManager.deleteTask('${t.id}')" class="text-slate-500 hover:text-red-400 p-2 transition text-xs">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  // --- Note Manager Methods ---
  resetNoteEditor() {
    this.activeNoteId = null;
    if (this.noteTitleInput) this.noteTitleInput.value = '';
    if (this.noteContentInput) this.noteContentInput.value = '';
    if (this.noteTagInput) this.noteTagInput.value = 'General';
  }

  saveCurrentNote() {
    const title = this.noteTitleInput ? this.noteTitleInput.value.trim() : '';
    const content = this.noteContentInput ? this.noteContentInput.value.trim() : '';
    const tag = this.noteTagInput ? this.noteTagInput.value.trim() || 'General' : 'General';
    const color = this.noteColorSelect ? this.noteColorSelect.value : 'indigo';

    if (!title && !content) return;

    if (this.activeNoteId) {
      const note = this.notes.find(n => n.id === this.activeNoteId);
      if (note) {
        note.title = title || 'Untitled Note';
        note.content = content;
        note.tag = tag;
        note.color = color;
        note.updatedAt = new Date().toISOString();
      }
    } else {
      const newNote = {
        id: 'note-' + Date.now(),
        title: title || 'Untitled Note',
        content: content,
        tag: tag,
        color: color,
        updatedAt: new Date().toISOString()
      };
      this.notes.unshift(newNote);
      this.activeNoteId = newNote.id;
    }

    this.saveNotes();
    this.renderNotes();

    if (window.showToast) {
      window.showToast('📝 Note saved to memory!', 'success');
    }
  }

  editNote(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) return;
    this.activeNoteId = note.id;

    if (this.noteTitleInput) this.noteTitleInput.value = note.title;
    if (this.noteContentInput) this.noteContentInput.value = note.content;
    if (this.noteTagInput) this.noteTagInput.value = note.tag;
    if (this.noteColorSelect) this.noteColorSelect.value = note.color || 'indigo';

    window.scrollTo({ top: document.getElementById('note-editor-section')?.offsetTop - 80, behavior: 'smooth' });
  }

  deleteNote(noteId) {
    if (confirm("Delete this study note?")) {
      this.notes = this.notes.filter(n => n.id !== noteId);
      if (this.activeNoteId === noteId) this.resetNoteEditor();
      this.saveNotes();
      this.renderNotes();
    }
  }

  renderNotes(searchTerm = '') {
    if (!this.notesGridEl) return;

    let filtered = this.notes;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = this.notes.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.content.toLowerCase().includes(q) || 
        n.tag.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      this.notesGridEl.innerHTML = `
        <div class="col-span-full py-8 text-center text-slate-500 text-sm">
          No matching notes found. Write one in the editor above!
        </div>
      `;
      return;
    }

    const colorBorderMap = {
      indigo: 'border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20',
      emerald: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20',
      amber: 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20',
      rose: 'border-rose-500/40 hover:border-rose-400 bg-rose-950/20',
      cyan: 'border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20'
    };

    this.notesGridEl.innerHTML = filtered.map(n => {
      const style = colorBorderMap[n.color] || colorBorderMap.indigo;
      const formattedDate = new Date(n.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      return `
        <div class="p-5 rounded-2xl border transition duration-200 flex flex-col justify-between ${style} backdrop-blur-md">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                ${n.tag}
              </span>
              <span class="text-[11px] text-slate-500">${formattedDate}</span>
            </div>
            <h4 class="font-bold text-white text-base mb-2">${n.title}</h4>
            <p class="text-slate-300 text-xs whitespace-pre-line line-clamp-4 leading-relaxed font-sans mb-4">
              ${n.content}
            </p>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button onclick="window.taskManager.editNote('${n.id}')" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition">
              <i class="fas fa-edit mr-1"></i> Edit
            </button>
            <button onclick="window.taskManager.deleteNote('${n.id}')" class="px-2 py-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs transition">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}
