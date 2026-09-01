import gsap from 'gsap';
import './style.css';

const chapters = [
  { id: 'origin', label: 'Origin', form: 'DORMANT', kanji: '無', color: '#e7e5e5', image: '/assets/arjun-normal-cutout.png' },
  { id: 'about', label: 'About', form: 'SHARINGAN', kanji: '写', color: '#ff2447', image: '/assets/arjun-sharingan-cutout.png' },
  { id: 'main-work', label: 'Main work', form: 'MANGEKYŌ', kanji: '万', color: '#ff183c', image: '/assets/arjun-mangekyou-cutout.png' },
  { id: 'side-work', label: 'Side quests', form: 'RINNEGAN', kanji: '輪', color: '#a95cff', image: '/assets/arjun-rinnegan-cutout.png' },
  { id: 'contact', label: 'Contact', form: 'SUSANOO', kanji: '須', color: '#b55cff', image: '/assets/arjun-susanoo-cutout.png' },
];

const mainProjects = [
  {
    num: '01',
    title: 'Viralyst',
    type: 'Creator Intelligence',
    status: 'IN ACTIVE DEV',
    copy: 'AI that studies why media spreads and transforms viral patterns into algorithmic blueprints. Analyzes multi-modal video pacing, engagement hooks, and virality decay curves.',
    specs: [{ label: 'ARCH', val: 'Vision Transformers' }, { label: 'STACK', val: 'PyTorch • FastAPI' }, { label: 'STATUS', val: 'Testing Engine' }],
    metrics: [{ label: 'MODEL LATENCY', val: '< 120ms' }, { label: 'FEATURE MATRIX', val: 'Multi-Modal' }],
    href: null,
    ctaText: 'EXPLORE BLUEPRINT ARCHITECTURE'
  },
  {
    num: '02',
    title: 'Cricklytics',
    type: 'Cricket Analytics',
    status: 'LIVE ENGINE',
    copy: 'Interactive match and player intelligence system that converts high-density cricket telemetry into actionable tactical strategies and predictive victory paths.',
    specs: [{ label: 'ARCH', val: 'Predictive Models' }, { label: 'STACK', val: 'Python • Next.js' }, { label: 'DATA', val: 'Ball-by-Ball Live' }],
    metrics: [{ label: 'DATA SPEED', val: 'Real-Time' }, { label: 'PRECISION', val: '96.2%' }],
    href: 'https://genia-diversifiable-millie.ngrok-free.dev/',
    ctaText: 'LAUNCH CRICKLYTICS ENGINE ↗'
  },
  {
    num: '03',
    title: 'Rakshak',
    type: 'AI Safety System',
    status: 'RESEARCH ARCHIVE',
    copy: 'Edge AI fall detection and distress acoustic neural network. Detects real-time physical impacts, evaluates audio danger frequencies, and triggers emergency dispatch.',
    specs: [{ label: 'EDGE', val: 'TinyML / Coral' }, { label: 'AUDIO', val: 'CNN Spectrogram' }, { label: 'LATENCY', val: 'Sub-50ms' }],
    metrics: [{ label: 'DETECTION', val: 'Real-Time' }, { label: 'FALSE POSITIVE', val: '< 1.2%' }],
    href: null,
    ctaText: 'VIEW ARCHIVAL CASE STUDY'
  },
  {
    num: '04',
    title: 'Byte Labs',
    type: 'Experimental Lab',
    status: 'LIVE LAB',
    copy: 'An interactive digital playground and creative engineering laboratory for useful, strange, and practical creative technology experiments.',
    specs: [{ label: 'STACK', val: 'TypeScript • WebGL' }, { label: 'EXPERIMENTS', val: 'Multi-Modal Sandbox' }, { label: 'DEPLOY', val: 'Edge Network' }],
    metrics: [{ label: 'EXPERIMENTS', val: 'Live Sandbox' }, { label: 'LATENCY', val: 'Instant' }],
    href: 'https://byte-eats-delta.vercel.app/',
    ctaText: 'LAUNCH BYTE LABS SANDBOX ↗'
  }
];

const sideProjects = [
  { num: 'A', title: 'Pen Fight', type: 'Physics Arena', copy: 'Competitive multiplayer physics browser game reimagining the classic school-desk sport.', href: 'https://pen-fight-lemon.vercel.app/' },
  { num: 'B', title: 'Café Sample', type: 'Sensory Web UI', copy: 'A high-atmosphere café concept with bespoke art direction, sound, and fluid interaction.', href: 'https://cafe-sample-websitte.netlify.app/' },
  { num: 'C', title: 'JARVIS', type: 'Private AI System', copy: 'Personal autonomous agent, computer control, neural voice pipeline, and local tools.', status: 'PRIVATE' },
  { num: 'D', title: 'GPT-2, Rebuilt', type: 'Transformer Research', copy: 'Reproducing GPT-2 from first principles in PyTorch to master modern attention architectures.', status: 'IN RESEARCH' },
];

const ROLES = [
  'STUDENT ENGINEER & BUILDER',
  'CREATIVE TECHNOLOGIST',
  'AI & ROBOTICS ARCHITECT',
  'TRANSFORMER LABS (GPT-2)',
  'PHYSICAL COMPUTING DEV',
  'EXPERIMENTAL UI CRAFTSMAN'
];

const projectCard = (project) => {
  const tag = project.href ? 'a' : 'article';
  const attrs = project.href ? `href="${project.href}" target="_blank" rel="noreferrer" aria-label="Open ${project.title}"` : '';
  return `<${tag} class="project-card" ${attrs}>
    <div>
      <div class="project-card__header">
        <span class="project-card__num">${project.num}</span>
        <small>${project.type}</small>
      </div>
      <h3>${project.title}</h3>
      <p>${project.copy}</p>
    </div>
    <div class="project-card__footer">
      <b>${project.href ? 'EXPLORE ↗' : (project.status || 'ARCHIVE')}</b>
      <i class="project-card__beam"></i>
    </div>
  </${tag}>`;
};

// Preload assets for instant decoding
chapters.forEach(c => {
  const img = new Image();
  img.src = c.image;
});

// Dojutsu Cursor Shapes per form
const getCursorSVG = (formIndex) => {
  if (formIndex === 0) {
    // Dormant: Tech reticle
    return `<svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="19" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" class="chakra-cursor__spin"/>
      <circle cx="22" cy="22" r="6" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="22" cy="22" r="2" fill="currentColor"/>
    </svg>`;
  } else if (formIndex === 1) {
    // Sharingan: 3 Tomoe
    return `<svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="18" stroke="currentColor" stroke-width="1.2"/>
      <g class="chakra-cursor__spin">
        <circle cx="22" cy="10" r="2.8" fill="currentColor"/>
        <circle cx="11.6" cy="28" r="2.8" fill="currentColor"/>
        <circle cx="32.4" cy="28" r="2.8" fill="currentColor"/>
      </g>
      <circle cx="22" cy="22" r="3.5" fill="currentColor"/>
    </svg>`;
  } else if (formIndex === 2) {
    // Mangekyo: Pinwheel
    return `<svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="19" stroke="currentColor" stroke-width="1"/>
      <g class="chakra-cursor__spin">
        <path d="M22 22 Q22 6 12 10 Q22 17 22 22" fill="currentColor"/>
        <path d="M22 22 Q38 22 34 32 Q27 22 22 22" fill="currentColor"/>
        <path d="M22 22 Q12 36 6 26 Q17 25 22 22" fill="currentColor"/>
      </g>
      <circle cx="22" cy="22" r="3" fill="#050507" stroke="currentColor" stroke-width="1"/>
    </svg>`;
  } else if (formIndex === 3) {
    // Rinnegan: Concentric Rings
    return `<svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="20" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <circle cx="22" cy="22" r="15" stroke="currentColor" stroke-width="1" opacity="0.7"/>
      <circle cx="22" cy="22" r="10" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="22" cy="22" r="4.5" fill="currentColor"/>
    </svg>`;
  } else {
    // Susanoo: Ethereal Flame Crest
    return `<svg viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="19" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 2" class="chakra-cursor__spin"/>
      <path d="M22 6 L26 18 L38 22 L26 26 L22 38 L18 26 L6 22 L18 18 Z" stroke="currentColor" stroke-width="1" fill="currentColor" fill-opacity="0.2"/>
      <circle cx="22" cy="22" r="3" fill="currentColor"/>
    </svg>`;
  }
};

document.querySelector('#app').innerHTML = `
  <div class="loader" aria-hidden="true">
    <div class="loader__glyph"><span>A</span><i></i><span>C</span></div>
    <p>AWAKENING THE VOID</p>
    <div class="loader__bar"><i></i></div>
  </div>

  <div class="chakra-cursor" aria-hidden="true">
    <div class="chakra-cursor__inner">
      ${getCursorSVG(0)}
    </div>
  </div>

  <div class="world" aria-hidden="true">
    <div class="void-texture"></div>
    <canvas id="aura"></canvas>
    <svg class="sigil" viewBox="0 0 800 800">
      <circle cx="400" cy="400" r="286"/>
      <circle cx="400" cy="400" r="224"/>
      <path d="M400 76 467 284 686 284 509 412 577 620 400 492 223 620 291 412 114 284 333 284Z"/>
      <path d="M400 140 442 333 650 400 442 467 400 660 358 467 150 400 358 333Z"/>
    </svg>
    <div class="orbit orbit--a"><i></i><b></b></div>
    <div class="orbit orbit--b"><i></i><b></b></div>
    <div class="speed-lines">${Array.from({ length: 16 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
    <div class="impact"></div>
    <div class="ink-wipe"></div>
    <div class="kanji-bloom"></div>
    <div class="vignette"></div>
    <div class="grain"></div>
  </div>

  <header class="site-header">
    <button class="brand" data-go="0" aria-label="Return to origin">
      <span class="brand__logo">AC</span>
      <span class="brand__name">ARJUN CHANDRA</span>
      <i class="brand__dot"></i>
      <span class="brand__status">SYS.2026</span>
    </button>

    <nav class="header-nav" aria-label="Portfolio chapters">
      ${chapters.map((chapter, i) => `
        <button class="nav-pill ${i === 0 ? 'is-active' : ''}" data-go="${i}" aria-label="Go to ${chapter.label}">
          <span class="nav-pill__num">0${i + 1}</span>
          <span class="nav-pill__label">${chapter.label}</span>
        </button>
      `).join('')}
    </nav>

    <div class="header-actions">
      <button class="audio-toggle is-playing" aria-label="Toggle Sound">
        <div class="audio-bars"><i></i><i></i><i></i></div>
        <span>AUDIO</span>
      </button>
      <a class="availability" href="mailto:aarjunchandra@gmail.com">
        <i></i>OPEN TO IDEAS
      </a>
    </div>
  </header>

  <div class="character-stage" aria-hidden="true">
    <div class="character-aura"></div>
    <img class="character-ghost character-ghost--red" src="${chapters[0].image}" alt=""/>
    <img class="character-ghost character-ghost--blue" src="${chapters[0].image}" alt=""/>
    ${chapters.map((chapter, i) => `
      <img class="character character--${i} ${i === 0 ? 'is-active' : ''}" data-character="${i}" src="${chapter.image}" alt="Arjun Chandra - ${chapter.form}"/>
    `).join('')}
    <div class="portrait-scan"></div>
  </div>

  <main class="t-page-slide" data-page="0">
    <!-- 01: ORIGIN / HERO -->
    <section class="scene scene--hero is-active" id="origin" data-page-id="0">
      <div class="hero-split-stage scene-content">
        <div class="hero-editorial scene-item">
          <div class="hero-kicker-bar">
            <span class="status-indicator"><i></i>SYS.ACTIVE</span>
            <span class="sep">•</span>
            <span>GURUGRAM, IN</span>
            <span class="sep">•</span>
            <span id="role-text" class="role-badge">CREATIVE TECHNOLOGIST & BUILDER</span>
          </div>

          <h1 class="hero-main-title">
            <span class="hero-title-sub">STUDENT ENGINEER</span>
            <span class="hero-title-main">BUILD. BREAK.</span>
            <em class="hero-title-accent">UNDERSTAND.</em>
          </h1>

          <p class="hero-statement">
            Turning first-principles curiosity into intelligent autonomous systems, custom transformer architectures, and ambitious digital realms that refuse to remain theoretical.
          </p>

          <div class="hero-actions">
            <button class="hero-btn-primary" data-go="1">
              <span>AWAKEN SHARINGAN</span><i>↗</i>
            </button>
            <button class="hero-btn-secondary" data-go="2">
              <span>VIEW SYSTEMS</span><i>↘</i>
            </button>
          </div>
        </div>

        <div class="hero-telemetry-panel scene-item">
          <div class="telemetry-box">
            <div class="telemetry-box__header">
              <span class="telemetry-tag">CORE DIRECTIVE</span>
              <span class="telemetry-code">0x01_VOID</span>
            </div>
            <p>Master the machine from first principles. Construct, stress-test to failure, and rebuild.</p>
          </div>

          <div class="telemetry-box">
            <div class="telemetry-box__header">
              <span class="telemetry-tag">RESEARCH DOMAINS</span>
              <span class="telemetry-code">2026_STK</span>
            </div>
            <div class="telemetry-chips">
              <span>PYTORCH</span>
              <span>GPT-2 ARCH</span>
              <span>ROBOTICS</span>
              <span>PHYSICAL AI</span>
              <span>WEBGL</span>
            </div>
          </div>

          <div class="telemetry-status-row">
            <div class="telemetry-metric">
              <small>BASE</small>
              <strong>GURUGRAM</strong>
            </div>
            <div class="telemetry-metric">
              <small>AFFILIATION</small>
              <strong>SRMIST</strong>
            </div>
            <div class="telemetry-metric">
              <small>STATUS</small>
              <strong class="text-green">ONLINE</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 02: ABOUT / SHARINGAN -->
    <section class="scene scene--about" id="about" data-page-id="1">
      <div class="scene-content about-dossier-layout">
        <div class="dossier-panel scene-item">
          <div class="scene-heading">
            <p>01 // EYE OF INSIGHT</p>
            <h2>CURIOUS BY <em>DESIGN.</em></h2>
          </div>

          <div class="dossier-stack">
            <!-- Dossier 1: First Principles -->
            <div class="dossier-card dossier-card--primary">
              <div class="dossier-card__header">
                <span class="dossier-badge">PHILOSOPHY 01</span>
                <span class="dossier-kanji">写</span>
              </div>
              <h3>Why I Build</h3>
              <p>I would rather understand the machine than memorize its manual. I learn by building from first principles, pushing mechanics to absolute failure, and rebuilding until the concept becomes second nature.</p>
            </div>

            <!-- Dossier 2: Technical Arsenal -->
            <div class="dossier-card dossier-card--secondary">
              <div class="dossier-card__header">
                <span class="dossier-badge">ARSENAL 02</span>
                <span class="dossier-metric">3 DOMAINS</span>
              </div>
              <div class="arsenal-groups">
                <div class="arsenal-group">
                  <strong>AI & INTELLIGENCE</strong>
                  <p>PyTorch • GPT-2 Reproduction • Computer Vision • Autonomous Agents</p>
                </div>
                <div class="arsenal-group">
                  <strong>SYSTEMS & HARDWARE</strong>
                  <p>Robotics • Embedded C++ • Microcontrollers • Linux Architecture</p>
                </div>
                <div class="arsenal-group">
                  <strong>CREATIVE CRAFT</strong>
                  <p>WebGL • Canvas Shaders • GSAP Motion • Web Audio API</p>
                </div>
              </div>
            </div>

            <!-- Dossier 3: Athletic Grit -->
            <div class="dossier-card dossier-card--tertiary">
              <div class="dossier-card__header">
                <span class="dossier-badge">THE EDGE 03</span>
                <span class="dossier-metric">DISCIPLINE</span>
              </div>
              <p>Competitive spirit, athletics, and strategic discipline keep my engineering sharp. Cricket, badminton, football, and anime inspire my endurance and relentless curiosity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 03: MAIN WORK / MANGEKYO -->
    <section class="scene scene--projects" id="main-work" data-page-id="2">
      <div class="scene-content mangekyo-showcase-layout">
        <div class="mangekyo-header scene-item">
          <p>02 // SELECTED SYSTEMS</p>
          <h2>BUILT TO <em>LEAVE A MARK.</em></h2>
        </div>

        <!-- Spotlight Stage -->
        <div class="mangekyo-spotlight-stage scene-item">
          <div class="mangekyo-spotlight-card">
            <div class="spotlight-badge-row">
              <span class="spotlight-num">01</span>
              <span class="spotlight-type">CREATOR INTELLIGENCE</span>
              <span class="spotlight-status">IN DEV</span>
            </div>
            <h3 class="spotlight-title">Viralyst</h3>
            <p class="spotlight-desc">AI that studies why media spreads and transforms viral patterns into algorithmic blueprints.</p>
            <div class="spotlight-footer">
              <div class="spotlight-tags">
                <span>PYTORCH</span>
                <span>EMBEDDINGS</span>
                <span>ATTENTION ANALYSIS</span>
              </div>
              <a class="spotlight-cta" href="https://genia-diversifiable-millie.ngrok-free.dev/" target="_blank" rel="noreferrer">
                <span>EXPLORE SYSTEM</span><i>↗</i>
              </a>
            </div>
          </div>

          <!-- Project Quick Switcher Ribbon -->
          <div class="mangekyo-ribbon" role="tablist">
            ${mainProjects.map((p, i) => `
              <button class="mangekyo-tab ${i === 0 ? 'is-active' : ''}" data-project-idx="${i}" role="tab" aria-label="Select ${p.title}">
                <span class="mangekyo-tab__num">${p.num}</span>
                <strong class="mangekyo-tab__title">${p.title}</strong>
                <small class="mangekyo-tab__type">${p.type}</small>
                <i class="mangekyo-tab__indicator"></i>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- 04: SIDE QUESTS / RINNEGAN -->
    <section class="scene scene--projects scene--side" id="side-work" data-page-id="3">
      <div class="scene-content rinnegan-bento-layout">
        <div class="rinnegan-header scene-item">
          <div class="scene-heading">
            <p>03 // EXPERIMENTAL LABS</p>
            <h2>NO SMALL <em>EXPERIMENTS.</em></h2>
          </div>
          <p class="rinnegan-intro">Research sandbox exploring autonomous agents, sensory web architectures, and attention mechanisms.</p>
        </div>

        <div class="rinnegan-bento-grid scene-item">
          <!-- Bento A: Pen Fight -->
          <a class="bento-tile bento-tile--hero" href="https://pen-fight-lemon.vercel.app/" target="_blank" rel="noreferrer">
            <div class="bento-tile__top">
              <span class="bento-pill">EXP 01</span>
              <span class="bento-beacon"><i></i>LIVE GAME</span>
            </div>
            <h3>Pen Fight</h3>
            <p>Competitive multiplayer physics browser game reimagining the classic school-desk sport.</p>
            <div class="bento-tile__foot">
              <b>ENTER ARENA</b><i>↗</i>
            </div>
          </a>

          <!-- Bento B: GPT-2 Rebuilt -->
          <div class="bento-tile bento-tile--research">
            <div class="bento-tile__top">
              <span class="bento-pill">EXP 02</span>
              <span class="bento-status">IN RESEARCH</span>
            </div>
            <h3>GPT-2, Rebuilt</h3>
            <p>Reproducing GPT-2 from first principles in PyTorch to master modern attention architectures.</p>
            <div class="bento-chips">
              <span>124M PARAMS</span>
              <span>PYTORCH</span>
              <span>ATTN HEADS</span>
            </div>
          </div>

          <!-- Bento C: JARVIS -->
          <div class="bento-tile bento-tile--agent">
            <div class="bento-tile__top">
              <span class="bento-pill">EXP 03</span>
              <span class="bento-status">PRIVATE</span>
            </div>
            <h3>JARVIS</h3>
            <p>Personal autonomous agent, computer control, neural voice pipeline, and local tools.</p>
            <div class="bento-chips">
              <span>AUTONOMOUS</span>
              <span>NEURAL VOICE</span>
            </div>
          </div>

          <!-- Bento D: Café Sample -->
          <a class="bento-tile bento-tile--sensory" href="https://cafe-sample-websitte.netlify.app/" target="_blank" rel="noreferrer">
            <div class="bento-tile__top">
              <span class="bento-pill">EXP 04</span>
              <span class="bento-beacon"><i></i>ATMOSPHERE</span>
            </div>
            <h3>Café Sample</h3>
            <p>A high-atmosphere café concept with bespoke art direction, sound, and fluid interaction.</p>
            <div class="bento-tile__foot">
              <b>EXPERIENCE</b><i>↗</i>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- 05: CONTACT / SUSANOO -->
    <section class="scene scene--contact" id="contact" data-page-id="4">
      <div class="scene-content contact-layout">
        <div class="contact-editorial scene-item">
          <div class="scene-heading">
            <p class="contact-kicker">04 // FINAL TRANSMISSION</p>
            <h2>MAKE THE<br/><em>NEXT MOVE.</em></h2>
          </div>

          <p class="contact-copy">
            Have an ambitious idea, an interesting problem, or something delightfully strange? Let’s create something legendary together.
          </p>

          <a class="contact-email-card" href="mailto:aarjunchandra@gmail.com">
            <div class="contact-email-card__info">
              <small>DIRECT TRANSMISSION</small>
              <strong>aarjunchandra@gmail.com</strong>
            </div>
            <span class="contact-email-card__arrow">↗</span>
          </a>

          <div class="contact-status-banner">
            <i></i>
            <span>AVAILABLE FOR FOUNDING ROLES & COLLABORATIONS • GURUGRAM / GLOBAL</span>
          </div>

          <div class="socials">
            <a href="https://github.com/Arjun-Chandra-7" target="_blank" rel="noreferrer">GITHUB ↗</a>
            <a href="https://www.instagram.com/arjun_chandra7/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
            <a href="https://wa.me/919717350301" target="_blank" rel="noreferrer">WHATSAPP ↗</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <div class="bottom-dock" aria-label="System Dock">
    <div class="dock-telemetry">
      <span class="dock-kicker">FORM // 01</span>
      <strong class="dock-form-name">DORMANT</strong>
      <span class="dock-kanji">無</span>
    </div>

    <button class="dock-advance-btn scroll-command" aria-label="Advance Form">
      <span class="dock-advance-pill">FORM 01</span>
      <i class="dock-advance-icon"><b></b></i>
      <em class="dock-advance-text">AWAKEN SHARINGAN</em>
    </button>

    <div class="dock-hints">
      <span>SCROLL / ARROWS TO CYCLE</span>
    </div>
  </div>
`;

// ==========================================================================
// PROCEDURAL AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHover() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playJutsu(chapterIndex) {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Sub-bass impact
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(90, now);
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.4);
      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.4);

      // Resonant harmonic chord based on chapter
      const freqs = [440, 523.25, 659.25, 783.99, 987.77];
      const baseFreq = freqs[chapterIndex] || 523;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.35);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }
}

const sfx = new SoundFX();
const audioToggleBtn = document.querySelector('.audio-toggle');
audioToggleBtn.addEventListener('click', () => {
  sfx.init();
  sfx.enabled = !sfx.enabled;
  audioToggleBtn.classList.toggle('is-playing', sfx.enabled);
});

// Enable audio on first user gesture
window.addEventListener('pointerdown', () => sfx.init(), { once: true });

// ==========================================================================
// DYNAMIC CIPHER ROLE SCRAMBLER
// ==========================================================================
function initRoleScrambler() {
  const el = document.querySelector('#role-text');
  if (!el) return;
  const chars = 'ABCDEF0123456789!<>[]_{}*+~#';
  let roleIdx = 0;
  let interval;

  function scrambleTo(targetText) {
    let iteration = 0;
    clearInterval(interval);
    interval = setInterval(() => {
      el.innerText = targetText
        .split('')
        .map((char, index) => {
          if (index < iteration) return targetText[index];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 28);
  }

  setInterval(() => {
    roleIdx = (roleIdx + 1) % ROLES.length;
    scrambleTo(ROLES[roleIdx]);
  }, 3200);
}

// ==========================================================================
// STATE & INTERACTION PIPELINE
// ==========================================================================
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const scenes = gsap.utils.toArray('.scene');
const characters = gsap.utils.toArray('.character');
const navButtons = gsap.utils.toArray('.nav-pill, .chapter-nav button');
const slider = document.querySelector('.t-page-slide');
const ghostRed = document.querySelector('.character-ghost--red');
const ghostBlue = document.querySelector('.character-ghost--blue');
const scrollCmd = document.querySelector('.scroll-command');
const cursorInner = document.querySelector('.chakra-cursor__inner');

let activeIndex = 0;
let transitioning = false;
let wheelReady = true;
let wheelTimer;
let touchStart = 0;

function updateInterface(index) {
  const chapter = chapters[index];
  root.dataset.chapter = index;
  root.style.setProperty('--accent', chapter.color);
  root.style.setProperty('--accent-glow', `${chapter.color}40`);
  slider.dataset.page = index;

  const dockKicker = document.querySelector('.dock-kicker');
  const dockForm = document.querySelector('.dock-form-name');
  const dockKanji = document.querySelector('.dock-kanji');
  if (dockKicker) dockKicker.textContent = `FORM // 0${index + 1}`;
  if (dockForm) dockForm.textContent = chapter.form;
  if (dockKanji) dockKanji.textContent = chapter.kanji;
  
  const nextLabel = index === chapters.length - 1 ? 'RETURN TO ORIGIN' : `AWAKEN FORM 0${index + 2}`;
  if (scrollCmd) {
    const pill = scrollCmd.querySelector('.dock-advance-pill, span');
    const text = scrollCmd.querySelector('.dock-advance-text, em');
    if (pill) pill.textContent = `FORM 0${index + 1}`;
    if (text) text.textContent = nextLabel;
  }

  // Update Dojutsu Cursor SVG
  if (cursorInner) {
    cursorInner.innerHTML = getCursorSVG(index);
  }

  const allNavButtons = document.querySelectorAll('.nav-pill, .chapter-nav button');
  allNavButtons.forEach((button) => {
    const target = Number(button.dataset.go);
    button.classList.toggle('is-active', target === index);
  });

  history.replaceState(null, '', `#${chapter.id}`);
}

function burstParticles() {
  const impact = document.querySelector('.impact');
  impact.replaceChildren();
  const count = 28;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('i');
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    const distance = 160 + Math.random() * Math.min(innerWidth, innerHeight) * 0.45;
    spark.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    impact.appendChild(spark);
  }
}

function goTo(nextIndex, direction = 1, instant = false) {
  if (nextIndex < 0) nextIndex = chapters.length - 1;
  if (nextIndex >= chapters.length) nextIndex = 0;
  if (nextIndex === activeIndex || transitioning) return;

  if (reduceMotion.matches || instant) {
    scenes[activeIndex].classList.remove('is-active');
    characters[activeIndex].classList.remove('is-active');
    activeIndex = nextIndex;
    scenes[activeIndex].classList.add('is-active');
    characters[activeIndex].classList.add('is-active');
    updateInterface(activeIndex);
    return;
  }

  transitioning = true;
  const previous = activeIndex;
  const oldScene = scenes[previous];
  const newScene = scenes[nextIndex];
  const oldCharacter = characters[previous];
  const newCharacter = characters[nextIndex];
  const oldItems = oldScene.querySelectorAll('.scene-item, .project-card, .about-card');
  const newItems = newScene.querySelectorAll('.scene-item, .project-card, .about-card');
  const wipe = document.querySelector('.ink-wipe');

  activeIndex = nextIndex;
  updateInterface(nextIndex);
  burstParticles();
  sfx.playJutsu(nextIndex);

  ghostRed.src = chapters[nextIndex].image;
  ghostBlue.src = chapters[nextIndex].image;
  newScene.classList.add('is-active');
  newCharacter.classList.add('is-active');

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      oldScene.classList.remove('is-active');
      oldCharacter.classList.remove('is-active');
      gsap.set([oldScene, oldItems, oldCharacter, newScene, newItems, newCharacter, wipe], { clearProps: 'all' });
      transitioning = false;
    }
  });

  const kanjiBloom = document.querySelector('.kanji-bloom');
  if (kanjiBloom) {
    kanjiBloom.textContent = chapters[nextIndex].kanji;
    tl.fromTo(kanjiBloom,
      { autoAlpha: 0.7, scale: 0.75, filter: 'blur(12px)' },
      { autoAlpha: 0, scale: 1.5, filter: 'blur(0px)', duration: 0.75, ease: 'power2.out' },
      0.12
    );
  }

  tl.set(newScene, { autoAlpha: 1 })
    .set(newItems, { autoAlpha: 0, y: 32 * direction, filter: 'blur(4px)' })
    .set(newCharacter, { autoAlpha: 0, scale: nextIndex === 4 ? 1.14 : 1.08, xPercent: -50, x: 26 * direction, filter: 'blur(6px) saturate(1.4)' })
    .set(wipe, { scaleX: 0, transformOrigin: direction > 0 ? 'left center' : 'right center' })
    .to(oldItems, { autoAlpha: 0, y: -20 * direction, filter: 'blur(3px)', duration: 0.26, stagger: 0.015 }, 0)
    .to(oldCharacter, { autoAlpha: 0, x: -30 * direction, xPercent: -50, scale: 0.95, filter: 'blur(6px)', duration: 0.44 }, 0.02)
    .to(wipe, { scaleX: 1, duration: 0.32, ease: 'power4.in' }, 0.1)
    .fromTo('.speed-lines', { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.01 }, 0.12)
    .fromTo('.speed-lines i', { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 0.9, duration: 0.22, stagger: 0.01, ease: 'power4.out' }, 0.12)
    .fromTo('.impact', { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power4.out' }, 0.18)
    .fromTo('.impact i', { x: 0, y: 0, scaleX: 0, autoAlpha: 1 }, { x: 'var(--tx)', y: 'var(--ty)', scaleX: 1, autoAlpha: 0, duration: 0.65, stagger: 0.005, ease: 'power3.out' }, 0.2)
    .fromTo([ghostRed, ghostBlue], { autoAlpha: 0.7, xPercent: -50, x: i => (i ? -18 : 18) }, { x: 0, xPercent: -50, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 0.25)
    .to('.sigil', { rotation: `+=${direction * 72}`, scale: 1.08, duration: 0.45, ease: 'power4.out' }, 0.2)
    .to(wipe, { scaleX: 0, transformOrigin: direction > 0 ? 'right center' : 'left center', duration: 0.36, ease: 'power4.out' }, 0.38)
    .to(newCharacter, { autoAlpha: 1, x: 0, xPercent: -50, scale: 1, filter: 'blur(0px) saturate(1)', duration: 0.6, ease: 'power4.out' }, 0.35)
    .to(newItems, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.46, stagger: 0.03, ease: 'power3.out' }, 0.48)
    .to('.sigil', { scale: 1, duration: 0.5, ease: 'power3.out' }, 0.5)
    .to('.speed-lines i', { autoAlpha: 0, duration: 0.2 }, 0.45)
    .to('.impact', { autoAlpha: 0, duration: 0.2 }, 0.6);
}

function initNavigation() {
  // Wheel navigation
  addEventListener('wheel', (event) => {
    event.preventDefault();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelReady = true; }, 240);
    if (!wheelReady || transitioning || Math.abs(event.deltaY) < 10) return;
    wheelReady = false;
    const direction = Math.sign(event.deltaY);
    goTo(activeIndex + direction, direction);
  }, { passive: false });

  // Keyboard navigation
  addEventListener('keydown', (event) => {
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      goTo(activeIndex + 1, 1);
    }
    if (['ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      goTo(activeIndex - 1, -1);
    }
    if (event.key === 'Home') goTo(0, -1);
    if (event.key === 'End') goTo(chapters.length - 1, 1);
    if (['1', '2', '3', '4', '5'].includes(event.key)) {
      const idx = Number(event.key) - 1;
      goTo(idx, idx > activeIndex ? 1 : -1);
    }
  });

  // Touch navigation
  addEventListener('touchstart', (event) => {
    touchStart = event.touches[0].clientY;
  }, { passive: true });

  addEventListener('touchend', (event) => {
    const delta = touchStart - event.changedTouches[0].clientY;
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + Math.sign(delta), Math.sign(delta));
    }
  }, { passive: true });

  // Clickable triggers
  document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = Number(button.dataset.go);
      goTo(target, target > activeIndex ? 1 : -1);
    });
  });

  // Clickable scroll command HUD button
  scrollCmd.addEventListener('click', () => {
    goTo(activeIndex + 1, 1);
  });
}

// ==========================================================================
// MULTI-PHASE GENERATIVE AURA CANVAS
// ==========================================================================
function initAura() {
  const canvas = document.querySelector('#aura');
  const ctx = canvas.getContext('2d');
  const pointer = { x: 0.5, y: 0.5 };
  const motes = Array.from({ length: 96 }, (_, i) => ({
    angle: Math.random() * Math.PI * 2,
    radius: 0.06 + Math.random() * 0.58,
    speed: 0.0003 + Math.random() * 0.0012,
    size: 0.5 + Math.random() * 2.2,
    phase: i * 0.65,
  }));

  let width;
  let height;
  let raf;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, width, height);
    const power = activeIndex / 4;
    const rgb = activeIndex === 0 ? '230,228,235' : activeIndex < 3 ? '255,36,71' : '181,92,255';
    const cx = width * (0.5 + (pointer.x - 0.5) * 0.025);
    const cy = height * (0.5 + (pointer.y - 0.5) * 0.02);

    ctx.globalCompositeOperation = 'lighter';
    motes.forEach((m) => {
      m.angle += m.speed * (1 + power * 4.5);
      const wobble = Math.sin(time * 0.0012 + m.phase) * (14 + power * 20);
      const x = cx + Math.cos(m.angle) * width * m.radius + wobble;
      const y = cy + Math.sin(m.angle * 1.1) * height * m.radius * 0.75;
      const tx = cx + Math.cos(m.angle - 0.03) * width * m.radius;
      const ty = cy + Math.sin((m.angle - 0.03) * 1.1) * height * m.radius * 0.75;

      // Energy beam streak
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(${rgb}, ${0.05 + power * 0.18})`;
      ctx.lineWidth = m.size * (1 + power * 1.2);
      ctx.stroke();

      // Core particle
      ctx.beginPath();
      ctx.arc(x, y, m.size * (1 + power * 1.6), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${0.15 + power * 0.4})`;
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(draw);
  };

  addEventListener('resize', resize);
  addEventListener('pointermove', (event) => {
    pointer.x = event.clientX / width;
    pointer.y = event.clientY / height;
  }, { passive: true });

  resize();
  if (!reduceMotion.matches) raf = requestAnimationFrame(draw);
}

// ==========================================================================
// CHAPTER 03: MANGEKYO SPOTLIGHT REEL INTERACTION
// ==========================================================================
function initSpotlightReel() {
  const tabs = document.querySelectorAll('.mangekyo-tab');
  const stage = document.querySelector('.mangekyo-spotlight-card');
  if (!stage) return;

  function setSpotlight(idx) {
    const data = mainProjects[idx];
    if (!data) return;

    gsap.to(stage, {
      opacity: 0.25,
      y: 6,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        const numEl = stage.querySelector('.spotlight-num');
        const typeEl = stage.querySelector('.spotlight-type');
        const statusEl = stage.querySelector('.spotlight-status');
        const titleEl = stage.querySelector('.spotlight-title');
        const descEl = stage.querySelector('.spotlight-desc');
        const tagsEl = stage.querySelector('.spotlight-tags');
        const ctaEl = stage.querySelector('.spotlight-cta');

        if (numEl) numEl.textContent = data.num;
        if (typeEl) typeEl.textContent = data.type.toUpperCase();
        if (statusEl) statusEl.textContent = data.status || 'ARCHIVE';
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.copy;
        if (tagsEl && data.specs) {
          tagsEl.innerHTML = data.specs.map(s => `<span>${s.val.toUpperCase()}</span>`).join('');
        }
        if (ctaEl) {
          if (data.href) {
            ctaEl.href = data.href;
            ctaEl.target = '_blank';
            ctaEl.innerHTML = `<span>${data.ctaText || 'EXPLORE SYSTEM'}</span><i>↗</i>`;
            ctaEl.classList.remove('is-disabled');
          } else {
            ctaEl.removeAttribute('href');
            ctaEl.innerHTML = `<span>${data.ctaText || 'ARCHIVAL STUDY'}</span><i>•</i>`;
            ctaEl.classList.add('is-disabled');
          }
        }

        tabs.forEach(t => t.classList.toggle('is-active', Number(t.dataset.projectIdx) === idx));
        gsap.to(stage, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sfx.playClick();
      setSpotlight(Number(tab.dataset.projectIdx));
    });
  });
}

// ==========================================================================
// CHAPTER 05: SUSANOO EMAIL ONE-CLICK COPY
// ==========================================================================
function initCopyEmail() {
  const emailCard = document.querySelector('.contact-email-card');
  const toast = document.querySelector('.copy-toast');
  if (!emailCard) return;

  emailCard.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = 'aarjunchandra@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    sfx.playClick();
    if (toast) {
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2400);
    }
  });
}

// ==========================================================================
// 3D CARD TILT & HOVER SOUNDS
// ==========================================================================
function initCardMotion() {
  document.querySelectorAll('.project-card, .about-card, .dossier-card, .bento-card, .bento-tile, .contact-email-card, .mangekyo-spotlight-card').forEach((card) => {
    card.addEventListener('pointerenter', () => sfx.playHover());
    card.addEventListener('pointermove', (event) => {
      if (reduceMotion.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--rx', `${-y * 6}deg`);
      card.style.setProperty('--ry', `${x * 8}deg`);
      card.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // Magnetic button micro-interactions
  if (matchMedia('(pointer: fine)').matches && !reduceMotion.matches) {
    document.querySelectorAll('.hero-btn-primary, .hero-btn-secondary, .brand, .dock-advance-btn, .spotlight-cta').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const mx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
        const my = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
        gsap.to(btn, { x: mx, y: my, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  document.querySelectorAll('button, a').forEach((el) => {
    el.addEventListener('pointerenter', () => sfx.playHover());
    el.addEventListener('click', () => sfx.playClick());
  });
}

// ==========================================================================
// INTERACTIVE CHAKRA CURSOR & SPARK TRAILS
// ==========================================================================
function initCursor() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const cursor = document.querySelector('.chakra-cursor');
  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });
  let lastSpark = 0;

  addEventListener('pointermove', (event) => {
    cursor.classList.add('is-visible');
    moveX(event.clientX);
    moveY(event.clientY);

    // Subtle character parallax preserving -50% horizontal center
    if (!reduceMotion.matches) {
      const px = (event.clientX / innerWidth - 0.5) * 14;
      const py = (event.clientY / innerHeight - 0.5) * 10;
      gsap.to('.character.is-active', { xPercent: -50, x: px, y: py, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    }

    // Trailing spark particle pool
    const now = performance.now();
    if (now - lastSpark > 65) {
      lastSpark = now;
      const spark = document.createElement('i');
      spark.className = 'chakra-spark';
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty('--dx', `${(Math.random() - 0.5) * 26}px`);
      spark.style.setProperty('--dy', `${(Math.random() - 0.5) * 26 + 10}px`);
      spark.style.background = chapters[activeIndex].color;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  }, { passive: true });

  addEventListener('pointerover', (event) => {
    const isTarget = Boolean(event.target.closest('a, button, .project-card, .about-card'));
    cursor.classList.toggle('is-targeting', isTarget);
  });

  addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
  addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) cursor.classList.remove('is-visible');
  });
}

// ==========================================================================
// DYNAMIC TAB TITLE & ANIMATED DOJU-ICON
// ==========================================================================
function initTabIdentity() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
  favicon.type = 'image/png';
  favicon.rel = 'shortcut icon';
  document.head.appendChild(favicon);

  let rotation = 0;
  let titleFrame = 0;
  const titleFrames = () => [
    `● ${chapters[activeIndex].form} // ARJUN CHANDRA`,
    `[${chapters[activeIndex].kanji}] SYS.2026 // GURUGRAM`,
    `ARJUN CHANDRA // PORTFOLIO`
  ];

  setInterval(() => {
    if (!document.hidden) {
      const frames = titleFrames();
      document.title = frames[titleFrame % frames.length];
      titleFrame += 1;
    }
  }, 1400);

  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'THE VOID IS WAITING…' : titleFrames()[0];
  });

  setInterval(() => {
    if (document.hidden) return;
    const color = chapters[activeIndex].color;
    ctx.clearRect(0, 0, 64, 64);
    ctx.save();
    ctx.translate(32, 32);
    ctx.rotate(rotation);

    // Outer ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();

    // 3 Rotating Tomoe / nodes
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 18, Math.sin(angle) * 18, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner core
    ctx.rotate(-rotation);
    ctx.fillStyle = '#050507';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = '700 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AC', 0, 1);
    ctx.restore();

    favicon.href = canvas.toDataURL('image/png');
    rotation += 0.22;
  }, 160);
}

// ==========================================================================
// INTRO SEQUENCE
// ==========================================================================
function playIntro() {
  const loader = document.querySelector('.loader');
  const tl = gsap.timeline({ onComplete: () => loader.remove() });

  tl.to('.loader__bar i', { scaleX: 1, duration: 0.65, ease: 'power3.inOut' })
    .to('.loader__glyph i', { scale: 16, duration: 0.68, ease: 'power4.in' }, 0.5)
    .to(loader, { autoAlpha: 0, duration: 0.3 }, 0.88)
    .from('.character--0', { autoAlpha: 0, scale: 1.15, xPercent: -50, filter: 'blur(8px)', duration: 0.8, ease: 'power4.out' }, 0.72)
    .from('.scene--hero .scene-item', { autoAlpha: 0, y: 30, filter: 'blur(3px)', duration: 0.55, stagger: 0.05, ease: 'power3.out' }, 0.9)
    .from('.site-header, .header-nav, .bottom-dock', { autoAlpha: 0, duration: 0.45, stagger: 0.04 }, 1.05);
}

// Initialize
const hashIndex = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
if (hashIndex > 0) {
  scenes[0].classList.remove('is-active');
  characters[0].classList.remove('is-active');
  activeIndex = hashIndex;
  scenes[activeIndex].classList.add('is-active');
  characters[activeIndex].classList.add('is-active');
}

updateInterface(activeIndex);
initRoleScrambler();
initNavigation();
initAura();
initSpotlightReel();
initCopyEmail();
initCardMotion();
initCursor();
initTabIdentity();

const snapshot = new URLSearchParams(location.search).get('snapshot');
if (snapshot !== null) {
  const index = Math.max(0, Math.min(chapters.length - 1, Number(snapshot) || 0));
  const l = document.querySelector('.loader');
  if (l) l.remove();
  scenes[activeIndex].classList.remove('is-active');
  characters[activeIndex].classList.remove('is-active');
  activeIndex = index;
  scenes[index].classList.add('is-active');
  characters[index].classList.add('is-active');
  updateInterface(index);
} else {
  requestAnimationFrame(playIntro);
}
