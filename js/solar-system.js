// ExamOrbit - Solar System Celestial Engine & Aesthetic Study Timer
// Realistic relative orbital mechanics (Keplerian physics approximation)

class SolarSystemEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Orbital period in Earth days/years relative to Earth (1.0)
    // Angular velocity is inversely proportional to orbital period: ω = 2π / T
    this.planets = [
      {
        id: 'mercury',
        name: 'Mercury',
        subtitle: 'The Swift Messenger',
        focusVibe: 'Rapid Problem Solving & High-Speed Calculation',
        color: '#a1a1aa',
        glowColor: 'rgba(161, 161, 170, 0.4)',
        radius: 3.5,
        orbitDistance: 48,
        period: 0.24, // 88 Earth days (~4.17x Earth speed)
        angle: Math.random() * Math.PI * 2,
        moons: 0,
        temp: '167°C',
        realSpeed: '47.4 km/s'
      },
      {
        id: 'venus',
        name: 'Venus',
        subtitle: 'The Morning Star',
        focusVibe: 'Endurance, Passion & Intense Stamina',
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        radius: 6,
        orbitDistance: 72,
        period: 0.62, // 225 Earth days (~1.61x Earth speed)
        angle: Math.random() * Math.PI * 2,
        moons: 0,
        temp: '464°C',
        realSpeed: '35.0 km/s'
      },
      {
        id: 'earth',
        name: 'Earth (Home Base)',
        subtitle: 'The Cradle of Life',
        focusVibe: 'Balanced Equilibrium & Grounded Clarity',
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.5)',
        radius: 6.5,
        orbitDistance: 104,
        period: 1.0, // 365.25 Earth days (Baseline 1.0)
        angle: Math.random() * Math.PI * 2,
        moons: 1,
        moonAngle: 0,
        temp: '15°C',
        realSpeed: '29.8 km/s'
      },
      {
        id: 'mars',
        name: 'Mars',
        subtitle: 'The Red Citadel',
        focusVibe: 'Iron Will, Courage & Unyielding Grit',
        color: '#f87171',
        glowColor: 'rgba(248, 113, 113, 0.45)',
        radius: 4.8,
        orbitDistance: 136,
        period: 1.88, // 687 Earth days (~0.53x Earth speed)
        angle: Math.random() * Math.PI * 2,
        moons: 2,
        temp: '-63°C',
        realSpeed: '24.1 km/s'
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        subtitle: 'The King of Orbits',
        focusVibe: 'Grand Vision, Complex Synthesis & Wisdom',
        color: '#fb923c',
        glowColor: 'rgba(251, 146, 60, 0.4)',
        radius: 12,
        orbitDistance: 178,
        period: 11.86, // ~0.084x Earth speed
        angle: Math.random() * Math.PI * 2,
        moons: 4,
        hasStripes: true,
        temp: '-110°C',
        realSpeed: '13.1 km/s'
      },
      {
        id: 'saturn',
        name: 'Saturn',
        subtitle: 'The Lord of Rings',
        focusVibe: 'Structured Discipline, Mastery & Symmetry',
        color: '#fde047',
        glowColor: 'rgba(253, 224, 71, 0.45)',
        radius: 10,
        orbitDistance: 224,
        period: 29.46, // ~0.034x Earth speed
        angle: Math.random() * Math.PI * 2,
        hasRings: true,
        temp: '-140°C',
        realSpeed: '9.7 km/s'
      },
      {
        id: 'uranus',
        name: 'Uranus',
        subtitle: 'The Celestial Ice Giant',
        focusVibe: 'Lateral Thinking, Novel Concepts & Cool Temper',
        color: '#22d3ee',
        glowColor: 'rgba(34, 211, 238, 0.4)',
        radius: 8,
        orbitDistance: 268,
        period: 84.01,
        angle: Math.random() * Math.PI * 2,
        temp: '-195°C',
        realSpeed: '6.8 km/s'
      },
      {
        id: 'neptune',
        name: 'Neptune',
        subtitle: 'The Deep Abyss',
        focusVibe: 'Deep Flow State & Zero Distraction Focus',
        color: '#60a5fa',
        glowColor: 'rgba(96, 165, 250, 0.4)',
        radius: 7.8,
        orbitDistance: 310,
        period: 164.79,
        angle: Math.random() * Math.PI * 2,
        temp: '-200°C',
        realSpeed: '5.4 km/s'
      }
    ];

    this.selectedPlanet = this.planets[2]; // Default: Earth
    this.sunPulse = 0;
    this.speedMultiplier = 1.0;
    this.pausedMovement = false;
    this.stars = [];
    this.hoveredPlanet = null;

    this.initCanvas();
    this.generateStarfield();
    this.setupListeners();
    this.animate();
  }

  initCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = Math.max(rect.height, 460);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
    this.cx = this.width / 2;
    this.cy = this.height / 2;

    // Scale orbits dynamically so Neptune fits on smaller screens
    const minDim = Math.min(this.width, this.height);
    this.scaleFactor = Math.max(0.45, Math.min(1.05, minDim / 660));
  }

  generateStarfield() {
    this.stars = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.005
      });
    }
  }

  setupListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      for (const p of this.planets) {
        const px = this.cx + Math.cos(p.angle) * (p.orbitDistance * this.scaleFactor);
        const py = this.cy + Math.sin(p.angle) * (p.orbitDistance * this.scaleFactor);
        const dist = Math.hypot(mx - px, my - py);
        if (dist <= p.radius * 2 + 10) {
          found = p;
          break;
        }
      }
      this.hoveredPlanet = found;
      this.canvas.style.cursor = found ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredPlanet) {
        this.selectPlanet(this.hoveredPlanet.id);
      }
    });
  }

  selectPlanet(planetId) {
    const planet = this.planets.find(p => p.id === planetId);
    if (!planet) return;
    this.selectedPlanet = planet;
    
    // Dispatch UI update
    if (window.studyTimerApp) {
      window.studyTimerApp.onPlanetSelected(planet);
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw cosmic deep space starfield
    this.drawStars();

    // 2. Draw Sun at center with realistic radiation glow
    this.drawSun();

    // 3. Draw orbits & planets
    const baseEarthAngularDelta = 0.006 * this.speedMultiplier;

    this.planets.forEach(p => {
      // Angular velocity calculation based on Kepler's 3rd Law / relative period
      if (!this.pausedMovement) {
        p.angle += (baseEarthAngularDelta / p.period);
      }

      const orbitR = p.orbitDistance * this.scaleFactor;
      const px = this.cx + Math.cos(p.angle) * orbitR;
      const py = this.cy + Math.sin(p.angle) * orbitR;

      // Draw orbital ring
      this.ctx.beginPath();
      this.ctx.arc(this.cx, this.cy, orbitR, 0, Math.PI * 2);
      this.ctx.strokeStyle = (this.selectedPlanet.id === p.id) 
        ? 'rgba(99, 102, 241, 0.45)' 
        : 'rgba(255, 255, 255, 0.08)';
      this.ctx.lineWidth = (this.selectedPlanet.id === p.id) ? 1.5 : 0.8;
      if (this.selectedPlanet.id === p.id) {
        this.ctx.setLineDash([4, 4]);
      } else {
        this.ctx.setLineDash([]);
      }
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Draw Selected holographic targeting reticle
      if (this.selectedPlanet.id === p.id) {
        this.ctx.beginPath();
        this.ctx.arc(px, py, (p.radius + 12), 0, Math.PI * 2);
        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([3, 3]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Station pulse halo
        const haloGrad = this.ctx.createRadialGradient(px, py, p.radius, px, py, p.radius + 18);
        haloGrad.addColorStop(0, p.glowColor);
        haloGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
        this.ctx.fillStyle = haloGrad;
        this.ctx.beginPath();
        this.ctx.arc(px, py, p.radius + 18, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw Planet Sphere
      this.drawPlanetSphere(p, px, py);

      // Draw planet label on hover
      if (this.hoveredPlanet && this.hoveredPlanet.id === p.id) {
        this.drawTooltip(p, px, py);
      }
    });

    this.sunPulse += 0.03;
    requestAnimationFrame(() => this.animate());
  }

  drawStars() {
    this.stars.forEach(star => {
      star.alpha += Math.sin(this.sunPulse * star.twinkleSpeed * 10) * 0.005;
      const clampedAlpha = Math.max(0.1, Math.min(0.9, star.alpha));
      this.ctx.beginPath();
      this.ctx.arc(star.x % this.width, star.y % this.height, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${clampedAlpha})`;
      this.ctx.fill();
    });
  }

  drawSun() {
    const pulseOffset = Math.sin(this.sunPulse) * 1.5;
    const sunR = 15 + pulseOffset;

    // Solar Corona Glow
    const coronaGrad = this.ctx.createRadialGradient(this.cx, this.cy, sunR * 0.5, this.cx, this.cy, sunR * 3.5);
    coronaGrad.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
    coronaGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.35)');
    coronaGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.1)');
    coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = coronaGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, sunR * 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Sun Core
    const sunGrad = this.ctx.createRadialGradient(this.cx - 2, this.cy - 2, 2, this.cx, this.cy, sunR);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#fef08a');
    sunGrad.addColorStop(0.7, '#f59e0b');
    sunGrad.addColorStop(1, '#ea580c');
    this.ctx.fillStyle = sunGrad;
    this.ctx.beginPath();
    this.ctx.arc(this.cx, this.cy, sunR, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawPlanetSphere(p, px, py) {
    this.ctx.save();

    // Atmosphere Glow
    const atmGrad = this.ctx.createRadialGradient(px, py, p.radius * 0.5, px, py, p.radius * 2);
    atmGrad.addColorStop(0, p.glowColor);
    atmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = atmGrad;
    this.ctx.beginPath();
    this.ctx.arc(px, py, p.radius * 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Saturn Rings
    if (p.hasRings) {
      this.ctx.save();
      this.ctx.translate(px, py);
      this.ctx.rotate(Math.PI / 6);
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.radius * 2.5, p.radius * 0.8, 0, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(234, 179, 8, 0.65)';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.radius * 2.9, p.radius * 0.95, 0, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Planetary Body
    const lightAngle = Math.atan2(py - this.cy, px - this.cx);
    const lightX = px - Math.cos(lightAngle) * (p.radius * 0.4);
    const lightY = py - Math.sin(lightAngle) * (p.radius * 0.4);

    const bodyGrad = this.ctx.createRadialGradient(lightX, lightY, p.radius * 0.1, px, py, p.radius);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.35, p.color);
    bodyGrad.addColorStop(1, '#09090b');

    this.ctx.fillStyle = bodyGrad;
    this.ctx.beginPath();
    this.ctx.arc(px, py, p.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Earth's Moon
    if (p.moons === 1) {
      p.moonAngle = (p.moonAngle || 0) + 0.05;
      const mDist = p.radius + 8;
      const mx = px + Math.cos(p.moonAngle) * mDist;
      const my = py + Math.sin(p.moonAngle) * mDist;
      this.ctx.beginPath();
      this.ctx.arc(mx, my, 1.6, 0, Math.PI * 2);
      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawTooltip(p, px, py) {
    const text = `${p.name} (Orbit: ${p.realSpeed})`;
    this.ctx.font = '11px Plus Jakarta Sans, sans-serif';
    const metrics = this.ctx.measureText(text);
    const w = metrics.width + 16;
    const h = 24;
    const tx = px - w / 2;
    const ty = py - p.radius - 30;

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(tx, ty, w, h, 6);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#f8fafc';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, px, ty + h / 2);
  }
}

// Synthesizer for focus ambience & bell chimes using Web Audio API
class CosmicSoundscape {
  constructor() {
    this.audioCtx = null;
    this.droneGain = null;
    this.isMuted = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  toggleSound() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.isMuted) {
      this.stopDrone();
      this.isMuted = true;
      return false;
    } else {
      this.startDrone();
      this.isMuted = false;
      return true;
    }
  }

  startDrone() {
    if (!this.audioCtx) return;
    try {
      // Binaural alpha focus drone (108 Hz carrier with subtle harmonic spread)
      this.osc1 = this.audioCtx.createOscillator();
      this.osc2 = this.audioCtx.createOscillator();
      this.filter = this.audioCtx.createBiquadFilter();
      this.droneGain = this.audioCtx.createGain();

      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(108, this.audioCtx.currentTime);

      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(116, this.audioCtx.currentTime); // 8 Hz difference = Alpha brainwave

      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(260, this.audioCtx.currentTime);

      this.droneGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 3);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.droneGain);
      this.droneGain.connect(this.audioCtx.destination);

      this.osc1.start();
      this.osc2.start();
    } catch (e) {
      console.warn("Audio Context init blocked or unsupported", e);
    }
  }

  stopDrone() {
    if (this.droneGain && this.audioCtx) {
      try {
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.audioCtx.currentTime);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1);
        setTimeout(() => {
          if (this.osc1) this.osc1.stop();
          if (this.osc2) this.osc2.stop();
        }, 1000);
      } catch (e) {}
    }
  }

  playChime() {
    this.init();
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528 Hz Solfeggio frequency
      osc.frequency.exponentialRampToValueAtTime(264, now + 2.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 3);
    } catch (e) {}
  }
}

// Timer Controller Class
class StudyTimer {
  constructor() {
    this.solarEngine = null;
    this.soundscape = new CosmicSoundscape();
    this.totalSeconds = 60 * 60; // 1 hour default
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = false;
    this.timerInterval = null;
    this.sessionsCompleted = 0;
    this.sessionMinutes = 0;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.displayEl = document.getElementById('timer-time-display');
    this.startBtn = document.getElementById('timer-start-btn');
    this.pauseBtn = document.getElementById('timer-pause-btn');
    this.resetBtn = document.getElementById('timer-reset-btn');
    this.progressRing = document.getElementById('timer-progress-ring');
    this.stationBadge = document.getElementById('active-station-badge');
    this.stationQuote = document.getElementById('active-station-quote');
    this.soundToggleBtn = document.getElementById('timer-sound-btn');
  }

  bindEvents() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.pause());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const isPlaying = this.soundscape.toggleSound();
        const icon = this.soundToggleBtn.querySelector('i');
        const text = this.soundToggleBtn.querySelector('.sound-btn-text');
        if (isPlaying) {
          if (icon) icon.className = 'fas fa-volume-up text-amber-400';
          if (text) text.textContent = 'Ambient Drone ON';
          this.soundToggleBtn.classList.add('border-amber-500/50', 'bg-amber-500/10');
        } else {
          if (icon) icon.className = 'fas fa-volume-mute';
          if (text) text.textContent = 'Cosmic Sound: Muted';
          this.soundToggleBtn.classList.remove('border-amber-500/50', 'bg-amber-500/10');
        }
      });
    }

    // Preset buttons (25m, 45m, 1h, 2h)
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const minutes = parseInt(e.currentTarget.dataset.minutes, 10);
        this.setDuration(minutes);
        document.querySelectorAll('.timer-preset-btn').forEach(b => b.classList.remove('active-preset'));
        e.currentTarget.classList.add('active-preset');
      });
    });
  }

  setDuration(minutes) {
    this.pause();
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    if (this.startBtn) this.startBtn.classList.add('hidden');
    if (this.pauseBtn) this.pauseBtn.classList.remove('hidden');

    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateDisplay();
      } else {
        this.onFinish();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    if (this.startBtn) this.startBtn.classList.remove('hidden');
    if (this.pauseBtn) this.pauseBtn.classList.add('hidden');
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  onFinish() {
    this.pause();
    this.soundscape.playChime();
    const minutesStudied = Math.round(this.totalSeconds / 60);
    
    // Log study time in app
    if (window.studyTimerApp) {
      window.studyTimerApp.recordStudySession(minutesStudied, this.solarEngine?.selectedPlanet?.name || 'Earth');
    }

    if (window.showToast) {
      window.showToast(`🎉 Celestial Focus Session Complete! ${minutesStudied} minutes logged to your streak.`, 'success');
    }
  }

  updateDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (this.displayEl) {
      this.displayEl.textContent = formatted;
    }

    // Update document title for easy tab monitoring
    document.title = this.isRunning ? `(${formatted}) Study Session | TestPulse` : 'TestPulse - Competitive Exam Prep';

    // SVG Progress ring update
    if (this.progressRing) {
      const circumference = 2 * Math.PI * 135;
      const progress = (this.totalSeconds - this.remainingSeconds) / this.totalSeconds;
      const strokeDashoffset = circumference - progress * circumference;
      this.progressRing.style.strokeDashoffset = strokeDashoffset;
    }
  }

  onPlanetSelected(planet) {
    if (this.stationBadge) {
      this.stationBadge.innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full mr-2" style="background:${planet.color}"></span> ${planet.name} Orbit Station`;
    }
    if (this.stationQuote) {
      this.stationQuote.textContent = `"${planet.focusVibe}"`;
    }

    // Update planet selector buttons in UI
    document.querySelectorAll('.planet-select-pill').forEach(pill => {
      if (pill.dataset.planetId === planet.id) {
        pill.classList.add('active-planet-pill');
      } else {
        pill.classList.remove('active-planet-pill');
      }
    });

    if (window.showToast) {
      window.showToast(`🛰️ Station switched to ${planet.name} orbit (${planet.focusVibe})`, 'info');
    }
  }
}
