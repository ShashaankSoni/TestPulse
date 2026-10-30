// TestPulse - AI Doubt Solver & Exam Mentor powered by Google Gemini API

class AIMentorChat {
  constructor() {
    this.apiKey = localStorage.getItem('exam_orbit_gemini_api_key') || '';
    this.messages = [];
    this.isGenerating = false;

    this.initElements();
    this.bindEvents();
    this.updateKeyStatusUI();
    this.loadHistory();
  }

  initElements() {
    this.chatContainer = document.getElementById('ai-chat-messages');
    this.chatInput = document.getElementById('ai-chat-input');
    this.sendBtn = document.getElementById('ai-send-btn');
    this.apiKeyModal = document.getElementById('gemini-api-modal');
    this.apiKeyInput = document.getElementById('gemini-api-input');
    this.saveKeyBtn = document.getElementById('save-gemini-key-btn');
    this.openKeyModalBtn = document.getElementById('open-api-modal-btn');
    this.keyStatusBadge = document.getElementById('gemini-key-status-badge');
    this.clearChatBtn = document.getElementById('clear-chat-btn');
  }

  bindEvents() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    if (this.openKeyModalBtn) {
      this.openKeyModalBtn.addEventListener('click', () => this.openKeyModal());
    }

    if (this.saveKeyBtn) {
      this.saveKeyBtn.addEventListener('click', () => this.saveApiKey());
    }

    if (this.clearChatBtn) {
      this.clearChatBtn.addEventListener('click', () => this.clearChat());
    }

    // Quick suggestion prompt chips
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.textContent.trim().replace(/^💡\s*/, '');
        if (this.chatInput) {
          this.chatInput.value = text;
          this.sendMessage();
        }
      });
    });
  }

  openKeyModal() {
    if (this.apiKeyInput) this.apiKeyInput.value = this.apiKey;
    if (this.apiKeyModal) this.apiKeyModal.classList.remove('hidden');
  }

  closeKeyModal() {
    if (this.apiKeyModal) this.apiKeyModal.classList.add('hidden');
  }

  saveApiKey() {
    const key = this.apiKeyInput ? this.apiKeyInput.value.trim() : '';
    if (!key) {
      alert("Please enter a valid Gemini API key from Google AI Studio.");
      return;
    }

    this.apiKey = key;
    localStorage.setItem('exam_orbit_gemini_api_key', key);
    this.updateKeyStatusUI();
    this.closeKeyModal();

    if (window.showToast) {
      window.showToast("✨ Gemini API Key connected successfully!", "success");
    }
  }

  updateKeyStatusUI() {
    if (!this.keyStatusBadge) return;

    if (this.apiKey && this.apiKey.length > 10) {
      this.keyStatusBadge.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
        <span class="text-emerald-400 font-semibold text-xs">Gemini Connected</span>
      `;
    } else {
      this.keyStatusBadge.innerHTML = `
        <span class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>
        <span class="text-amber-400 font-semibold text-xs">Set API Key</span>
      `;
    }
  }

  loadHistory() {
    try {
      this.messages = JSON.parse(localStorage.getItem('exam_orbit_chat_history') || '[]');
      if (this.messages.length === 0) {
        const examName = window.examApp?.currentExam?.name || 'Competitive Exams';
        this.messages = [
          {
            role: 'assistant',
            content: `Namaste Aspirant! 🙏 I am your **TestPulse AI Mentor**, specialized in cracking Indian competitive exams like **JEE, NEET, UPSC, CAT, GATE, SSC & Banking**.\n\nAsk me any concept doubts, tough problem steps, formula derivations, or time management tips!\n\n*(Note: Make sure to click **"Set Gemini Key"** in the top right to link your free Google Gemini API key).*`
          }
        ];
      }
      this.renderMessages();
    } catch (e) {
      this.messages = [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('exam_orbit_chat_history', JSON.stringify(this.messages.slice(-25)));
    } catch (e) {}
  }

  clearChat() {
    if (confirm("Reset conversation history?")) {
      this.messages = [
        {
          role: 'assistant',
          content: `Chat history cleared. How can I assist your study session today?`
        }
      ];
      this.saveHistory();
      this.renderMessages();
    }
  }

  async sendMessage() {
    const text = this.chatInput ? this.chatInput.value.trim() : '';
    if (!text || this.isGenerating) return;

    if (!this.apiKey) {
      this.openKeyModal();
      if (window.showToast) {
        window.showToast("⚠️ Please enter your Gemini API key first to chat with AI.", "warning");
      }
      return;
    }

    // Add user message
    this.messages.push({ role: 'user', content: text });
    if (this.chatInput) this.chatInput.value = '';
    this.renderMessages();

    this.isGenerating = true;
    this.showTypingIndicator();

    try {
      const reply = await this.callGeminiAPI(text);
      this.removeTypingIndicator();
      this.messages.push({ role: 'assistant', content: reply });
      this.saveHistory();
      this.renderMessages();
    } catch (err) {
      this.removeTypingIndicator();
      const errMsg = `⚠️ Error connecting to Gemini API: ${err.message || 'Check your API key and connection'}. Please verify your key at Google AI Studio (aistudio.google.com).`;
      this.messages.push({ role: 'assistant', content: errMsg });
      this.renderMessages();
    } finally {
      this.isGenerating = false;
    }
  }

  async callGeminiAPI(promptText) {
    const examName = window.examApp?.currentExam?.name || 'Indian Competitive Exams (JEE/UPSC/CAT)';

    const systemInstruction = `You are "TestPulse AI", an elite academic mentor and coach for Indian competitive exams (${examName}).
You have master-level expertise in Mathematics, Physics, Chemistry, Biology, General Studies (Polity, History, Economy), Quantitative Aptitude, Logical Reasoning, and English.
Guidelines:
1. Provide accurate, crystal-clear, step-by-step solutions to numericals and conceptual doubts.
2. Use clear formatting, bullet points, and mnemonics where helpful.
3. Keep the tone inspiring, disciplined, and razor-sharp like a top coaching faculty.
4. Keep explanations concise and high-yield.`;

    // Construct conversation payload for Gemini v1beta
    // Models to try: gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const contents = [];

    // System prompt as first turn or context
    contents.push({
      role: 'user',
      parts: [{ text: `System Context: ${systemInstruction}\n\nStudent Doubt: ${promptText}` }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1200
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${response.status} (${response.statusText})`;
      throw new Error(msg);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textOutput = candidate?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error("No response generated by Gemini model.");
    }

    return textOutput;
  }

  renderMessages() {
    if (!this.chatContainer) return;

    this.chatContainer.innerHTML = this.messages.map(m => {
      const isUser = m.role === 'user';
      const formattedContent = this.formatMarkdown(m.content);

      return `
        <div class="flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4">
          <div class="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs ${
            isUser ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-500/20'
          }">
            ${isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'}
          </div>

          <div class="max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none backdrop-blur-md'
          }">
            <div class="prose prose-invert max-w-none">${formattedContent}</div>
          </div>
        </div>
      `;
    }).join('');

    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  showTypingIndicator() {
    if (!this.chatContainer) return;
    const indicator = document.createElement('div');
    indicator.id = 'ai-typing-indicator';
    indicator.className = 'flex gap-3 mb-4';
    indicator.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs">
        <i class="fas fa-brain animate-pulse"></i>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
        <div class="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]"></div>
        <span class="text-xs text-slate-400 ml-2">Exam Mentor is analyzing...</span>
      </div>
    `;
    this.chatContainer.appendChild(indicator);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.remove();
  }

  formatMarkdown(raw) {
    if (!raw) return '';
    let text = raw;

    // Code blocks
    text = text.replace(/```([\s\S]*?)```/g, (match, p1) => {
      return `<pre class="p-3 my-2 bg-slate-950 rounded-xl overflow-x-auto border border-slate-800 font-mono text-xs text-indigo-300"><code>${p1.trim()}</code></pre>`;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-pink-300 font-mono text-xs">$1</code>');

    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

    // Italics
    text = text.replace(/\*([^*]+)\*/g, '<em class="text-slate-300">$1</em>');

    // Line breaks
    text = text.replace(/\n/g, '<br/>');

    return text;
  }

  askAboutQuestion(questionText, explanationText) {
    if (window.examApp) {
      window.examApp.switchTab('ai-doubts');
    }

    const query = `Can you please explain this question in simpler terms and show alternative solving shortcuts?\n\nQuestion: "${questionText}"\n\nGiven Solution: "${explanationText}"`;
    if (this.chatInput) {
      this.chatInput.value = query;
      this.sendMessage();
    }
  }
}
