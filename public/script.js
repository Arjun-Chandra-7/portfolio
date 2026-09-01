/**
* OPTIMIZED ANIMATION ENGINE v2.5
* 
* NEW in v2.5:
* - Custom drag indicator for Swiper
* - Enhanced drag UX with visual feedback
* - Automatic show/hide based on swiper interaction
* 
* Previous improvements (v2.4):
* - Fixed MagneticPositions drift (absolute transforms)
* - Fixed MagneticPositions timing (runs after TextReveal)
* - Fixed MagneticPositions to handle dynamically created elements
* - Reduced ScrollTrigger count for ThemeSwitcher
* - GhostEngine resize/rebuild support
* - SplitText cleanup and double-wrap prevention
* - Proper Lenis + ScrollTrigger sync
* - SPA-ready destroy/init pattern
* - Fixed backdrop-filter to use CSS (not GSAP controlled)
* - TextReveal now preserves data-connect elements
* - Added data-tl-once attribute for one-time trigger animations
* - FIXED: HorizontalScroll sticky top calculation on hard refresh
* 
* Dependencies: GSAP, ScrollTrigger, SplitText (GSAP Plugin), Swiper, Lenis
*/

(function() {
  'use strict';

  // Prevent Safari from restoring scroll position on reload/navigation
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ==========================================================================
  // CONFIGURATION & STATE
  // ==========================================================================
  const CONFIG = {
    sidebarPadding: 40,
    preloaderDelay: 0.2,
    ctaSpeed: 0.728,
    resizeDebounce: 150,
    magneticInitDelay: 300,
    horizontalScrollDelay: 100,
    lenis: {
      duration: 0.4,  // Lower = less smooth, more snappy (0.1 = almost native, 1.2 = very smooth)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    }
  };
  
  const STATE = {
    sidebarScale: 1,
    workTween: null,
    lenis: null,
    magneticPairs: [],
    splitInstances: [],
    eventListeners: [],
    initialized: false
  };
  
  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================
  const Utils = {
    $(selector) {
      return document.querySelector(selector);
    },
  
    $$(selector) {
      return document.querySelectorAll(selector);
    },
  
    parseUnit(str) {
      const val = parseFloat(str) || 0;
      let unit = 'px';
      if (str.includes('vw')) unit = 'vw';
      else if (str.includes('vh')) unit = 'vh';
      else if (str.includes('%')) unit = '%';
      return { val, unit };
    },
  
    toPx(obj, sizeRef = 0) {
      const { val, unit } = obj;
      if (unit === 'vw') return val * (window.innerWidth / 100);
      if (unit === 'vh') return val * (window.innerHeight / 100);
      if (unit === '%') return val * (sizeRef / 100);
      return val;
    },
  
    parseJSON(str, fallback = {}) {
      try {
        return JSON.parse(str.replace(/'/g, '"'));
      } catch {
        return fallback;
      }
    },
  
    debounce(fn, delay = 100) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    },
  
    addEvent(target, event, handler, options) {
      target.addEventListener(event, handler, options);
      STATE.eventListeners.push({ target, event, handler, options });
    },
  
    isSplit(el) {
      return el.hasAttribute('data-split-initialized');
    },
  
    markSplit(el) {
      el.setAttribute('data-split-initialized', 'true');
    },
  
    unmarkSplit(el) {
      el.removeAttribute('data-split-initialized');
    }
  };
  
  // ==========================================================================
  // SIDEBAR AUTO-SCALE
  // ==========================================================================
  const Sidebar = {
    init() {
      this.scale();
    },

    scale() {
      // Disable auto-scale on mobile devices (screen width < 768px)
      if (window.innerWidth < 768) return;
      
      const sidebar = Utils.$('.nav-container');
      if (!sidebar) return;
  
      const availableHeight = window.innerHeight - CONFIG.sidebarPadding;
      STATE.sidebarScale = Math.min(1, availableHeight / sidebar.scrollHeight);
  
      gsap.set(sidebar, { scale: STATE.sidebarScale, transformOrigin: 'top left', force3D: false });
  
      const inverse = 1 / STATE.sidebarScale;
  
      const profileImg = Utils.$('.profile-img-wrap');
      if (profileImg && profileImg.closest('.nav-container')) {
        gsap.set(profileImg, { scale: inverse, transformOrigin: 'top left', force3D: false });
      }
  
      const navBtnText = Utils.$('.nav-button p');
      const navBtnSecText = Utils.$('.nav-button-secondary p');
      if (navBtnText) gsap.set(navBtnText, { scale: inverse, transformOrigin: 'center center', force3D: false });
      if (navBtnSecText) gsap.set(navBtnSecText, { scale: inverse, transformOrigin: 'center center', force3D: false });
    }
  };

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================
const MobileMenu = {
  isOpen: false,
  menuTrigger: null,
  menuWrap: null,
  menuIcons: null,
  gapOffset: 0,

  init() {
    // Only initialize on mobile
    if (window.innerWidth >= 768) return;

    this.menuTrigger = Utils.$('.mobile-menu');
    this.menuWrap = Utils.$('.nav-menu-wrap');
    this.menuIcons = Utils.$$('.mobile-menu-icons');

    if (!this.menuTrigger || !this.menuWrap) return;

    // Calculate gap offset based on icon height
    if (this.menuIcons.length > 0) {
      const iconHeight = this.menuIcons[0].offsetHeight;
      const computedStyle = window.getComputedStyle(this.menuTrigger);
      const gap = parseFloat(computedStyle.gap) || 0;
      // Convert gap to percentage of icon height
      this.gapOffset = (gap / 2 / iconHeight) * 100;
    }

    // Set initial states
    gsap.set(this.menuWrap, {
      clipPath: 'inset(0% 0% 100% 0%)',
      pointerEvents: 'none'
    });

    // Add click handler
    Utils.addEvent(this.menuTrigger, 'click', () => this.toggle());

    console.log('✓ Mobile Menu initialized');
  },

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
    this.isOpen = true;

    // Reveal menu from top to bottom
    gsap.to(this.menuWrap, {
      clipPath: 'inset(0% 0% 0% 0%)',
      pointerEvents: 'auto',
      duration: 0.8,
      ease: 'power2.out'
    });

    // Move icons apart - first goes down, second goes up
    // Add gapOffset to compensate for flexbox gap
    this.menuIcons.forEach((icon, index) => {
      const direction = index === 0 ? (50 + this.gapOffset) : (-50 - this.gapOffset);
      gsap.to(icon, {
        yPercent: direction,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    // Add active class for styling
    this.menuTrigger.classList.add('is-active');
  },

  close() {
    this.isOpen = false;

    // Hide menu from bottom to top
    gsap.to(this.menuWrap, {
      clipPath: 'inset(0% 0% 100% 0%)',
      pointerEvents: 'none',
      duration: 0.8,
      ease: 'power2.out'
    });

    // Move icons back to center
    gsap.to(this.menuIcons, {
      yPercent: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Remove active class
    this.menuTrigger.classList.remove('is-active');
  },

  destroy() {
    if (this.menuWrap) {
      gsap.set(this.menuWrap, { clearProps: 'clipPath,pointerEvents' });
    }
    if (this.menuIcons && this.menuIcons.length) {
      this.menuIcons.forEach(icon => {
        gsap.set(icon, { clearProps: 'yPercent' });
      });
    }
    this.isOpen = false;
    this.gapOffset = 0;
  }
};

  // ==========================================================================
  // GHOST ANIMATION ENGINE
  // ==========================================================================
  const GhostEngine = {
    initialized: false,
  
    init() {
      // Disable GhostEngine on mobile devices (screen width < 768px)
      if (window.innerWidth < 768) return;
      
      if (this.initialized) return;
      this.createAll();
      this.initialized = true;
    },
  
    destroy() {
      ScrollTrigger.getAll().forEach(st => {
        const trigger = st.vars.trigger;
        if (trigger === '.hero' || (typeof trigger === 'string' && trigger.includes('hero'))) {
          st.kill();
        }
      });
  
      const ghostElements = [
        '.nav-logo-item .nesh-logo',
        '.nesh-copyright-icon',
        '.nav-button',
        '.nav-button-secondary',
        '.nav-webflow-bg',
        '.nav-webflow-icon',
        '.nav-webflow-text',
        '.nav-experience-bg',
        '.nav-experience-numb',
        '.nav-experience-text'
      ];
  
      ghostElements.forEach(sel => {
        const el = Utils.$(sel);
        if (el) gsap.set(el, { clearProps: 'all' });
      });
  
      Utils.$$('.hero-navigation-link').forEach(el => {
        gsap.set(el, { clearProps: 'all' });
      });
  
      this.initialized = false;
    },
  
    rebuild() {
      this.destroy();
      requestAnimationFrame(() => {
        Sidebar.scale();
        this.createAll();
        this.initialized = true;
        ScrollTrigger.refresh();
      });
    },
  
    getSettings(el) {
      const configEl = el.closest('[data-flip-start]') || Utils.$('.hero');
      let trigger = '.hero', start = 'top top', end = '900px top';
      if (configEl) {
        if (configEl.getAttribute('data-flip-trigger')) trigger = configEl.getAttribute('data-flip-trigger');
        if (configEl.getAttribute('data-flip-start')) start = configEl.getAttribute('data-flip-start');
        if (configEl.getAttribute('data-flip-end')) end = configEl.getAttribute('data-flip-end');
      }
      return { trigger, start, end };
    },
  
    // Phase 1: Read all measurements from clean DOM (no mutations yet)
    measurePair(real, ghost, type) {
      if (!real || !ghost) return null;

      const settings = this.getSettings(real);
      const rRect = real.getBoundingClientRect();
      const gRect = ghost.getBoundingClientRect();
      const measurement = { real, ghost, type, settings, rRect, gRect };

      if (type === 'logo') {
        const parent = real.closest('.nesh-copyright-wrap') || real.closest('.nav-button-wrap') || real.closest('.nav-logo-item') || real.parentElement;
        measurement.parent = parent;
        measurement.parentRect = parent.getBoundingClientRect();
        measurement.computedStyle = {
          width: window.getComputedStyle(real).width,
          height: window.getComputedStyle(real).height
        };
        measurement.offsetHeight = real.offsetHeight;
      }

      if (type === 'text_font') {
        measurement.ghostFontSize = parseFloat(window.getComputedStyle(ghost).fontSize);
      }

      if (type === 'background') {
        const realStyle = window.getComputedStyle(real);
        const ghostStyle = window.getComputedStyle(ghost);
        measurement.realBorderRadius = parseFloat(realStyle.borderRadius) || 0;
        measurement.realBorderWidth = parseFloat(realStyle.borderWidth) || 0;
        measurement.ghostBorderRadius = parseFloat(ghostStyle.borderRadius) || 0;
      }

      measurement.realFontSize = window.getComputedStyle(real).fontSize;

      return measurement;
    },

    // Phase 2: Apply animations using pre-measured data (no more rect reads)
    applyAnimation(m) {
      if (!m) return;

      const { real, type, settings, rRect, gRect } = m;

      let xDiff = Math.round((gRect.left - rRect.left) / STATE.sidebarScale);
      let yDiff = Math.round((gRect.top - rRect.top) / STATE.sidebarScale);

      let vars = { ease: 'power1.inOut' };
      let toVarsOverrides = {};

      if (type === 'logo') {
        const { parent, parentRect, computedStyle, offsetHeight } = m;

        if (!parent.classList.contains('nesh-copyright-wrap') && !parent.classList.contains('nav-button-wrap')) {
          parent.style.position = 'relative';
          parent.style.minHeight = offsetHeight + 'px';
          parent.style.display = 'block';
        }

        xDiff = Math.round((gRect.left - parentRect.left) / STATE.sidebarScale);
        yDiff = Math.round((gRect.top - parentRect.top) / STATE.sidebarScale);

        vars.width = (gRect.width / STATE.sidebarScale) + 'px';
        vars.height = (gRect.height / STATE.sidebarScale) + 'px';
        vars.position = 'absolute';
        vars.top = '0px';
        vars.left = '0px';

        toVarsOverrides.width = computedStyle.width;
        toVarsOverrides.height = computedStyle.height;
        toVarsOverrides.position = 'absolute';
        toVarsOverrides.top = '0px';
        toVarsOverrides.left = '0px';

        vars.x = xDiff;
        vars.y = yDiff;
        vars.transformOrigin = 'top left';
        vars.force3D = false;
        delete vars.scale;
      }
      else if (type === 'link') {
        vars.x = xDiff;
        vars.y = yDiff;
        vars.scaleX = gRect.width / rRect.width;
        vars.scaleY = gRect.height / rRect.height;
        vars.transformOrigin = 'top left';
      }
      else if (type === 'background') {
        const sX = gRect.width / rRect.width;
        const sY = gRect.height / rRect.height;
        const avgScale = (sX + sY) / 2;
        vars.x = xDiff;
        vars.y = yDiff;
        vars.scaleX = sX;
        vars.scaleY = sY;
        vars.transformOrigin = 'top left';
        vars.backgroundColor = 'rgba(194, 184, 172, 0.3)';
        // Use ghost's border-radius with elliptical compensation per corner.
        // Each corner gets `Xpx Ypx` (horizontal vertical) so after scaling by
        // sX/sY the visible radius becomes a uniform circle of ghost's radius.
        const ghostR = m.ghostBorderRadius || m.realBorderRadius;
        const fromCorner = (ghostR / sX) + 'px ' + (ghostR / sY) + 'px';
        vars.borderTopLeftRadius = fromCorner;
        vars.borderTopRightRadius = fromCorner;
        vars.borderBottomLeftRadius = fromCorner;
        vars.borderBottomRightRadius = fromCorner;
        vars.borderWidth = (m.realBorderWidth / avgScale) + 'px';
        vars.boxSizing = 'border-box';
        vars.opacity = 1;
      }
      else if (type === 'icon_center') {
        vars.x = xDiff;
        vars.y = yDiff;
        vars.scaleX = gRect.width / rRect.width;
        vars.scaleY = gRect.height / rRect.height;
        vars.transformOrigin = 'top left';
      }
      else if (type === 'text_font') {
        vars.x = xDiff;
        vars.y = yDiff;
        vars.scaleX = gRect.width / rRect.width;
        vars.scaleY = gRect.height / rRect.height;
        vars.transformOrigin = 'top left';
      }

      let fromVars = { ...vars };
      let toVars = {
        x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        opacity: 0,
        fontSize: m.realFontSize,
        ease: 'power1.inOut', force3D: false,
        scrollTrigger: { trigger: settings.trigger, start: settings.start, end: settings.end, scrub: 1 },
        ...toVarsOverrides
      };

      // Only logo type uses explicit width/height
      if (type !== 'logo') {
        delete fromVars.width; delete toVars.width;
        delete fromVars.height; delete toVars.height;
      }
      // Only background type uses visual properties
      if (type !== 'background') {
        delete fromVars.backgroundColor; delete toVars.backgroundColor;
        delete fromVars.borderRadius; delete toVars.borderRadius;
        delete fromVars.borderTopLeftRadius; delete toVars.borderTopLeftRadius;
        delete fromVars.borderTopRightRadius; delete toVars.borderTopRightRadius;
        delete fromVars.borderBottomLeftRadius; delete toVars.borderBottomLeftRadius;
        delete fromVars.borderBottomRightRadius; delete toVars.borderBottomRightRadius;
        delete fromVars.opacity; delete toVars.opacity;
      } else {
        // Mirror the per-corner elliptical format on toVars so GSAP can interpolate
        // each token cleanly from the elliptical from-state (Xpx Ypx) to the
        // uniform end-state (Rpx Rpx) where real's CSS radius applies.
        const toCorner = m.realBorderRadius + 'px ' + m.realBorderRadius + 'px';
        toVars.borderTopLeftRadius = toCorner;
        toVars.borderTopRightRadius = toCorner;
        toVars.borderBottomLeftRadius = toCorner;
        toVars.borderBottomRightRadius = toCorner;
        delete fromVars.borderRadius; delete toVars.borderRadius;
      }
      // No types use fontSize anymore
      delete fromVars.fontSize; delete toVars.fontSize;
      delete fromVars.color; delete toVars.color;
      // Only logo type uses absolute positioning
      if (type !== 'logo') {
        delete fromVars.position; delete toVars.position;
        delete fromVars.top; delete toVars.top;
        delete fromVars.left; delete toVars.left;
      }

      delete fromVars.backdropFilter; delete toVars.backdropFilter;
      delete fromVars.webkitBackdropFilter; delete toVars.webkitBackdropFilter;

      gsap.fromTo(real, fromVars, toVars);
    },

    createAll() {
      // ---- Phase 1: Measure everything on a clean DOM (copyright icon handled separately) ----
      const measurements = [];

      measurements.push(this.measurePair(Utils.$('.nav-logo-item .nesh-logo'), Utils.$('.nesh-logo-ghost'), 'logo'));
      measurements.push(this.measurePair(Utils.$('.nav-button'), Utils.$('.hero-cta-button'), 'logo'));
      measurements.push(this.measurePair(Utils.$('.nav-button-secondary'), Utils.$('.hero-button'), 'logo'));

      Utils.$$('.hero-navigation-link').forEach(link => {
        const id = link.getAttribute('data-link-id');
        measurements.push(this.measurePair(link, Utils.$(`.hero-link-ghost[data-link-id="${id}"]`), 'link'));
      });

      measurements.push(this.measurePair(Utils.$('.nav-webflow-bg'), Utils.$('.hero-card-2-bg'), 'background'));
      measurements.push(this.measurePair(Utils.$('.nav-webflow-icon'), Utils.$('.hero-webflow-icon'), 'icon_center'));
      measurements.push(this.measurePair(Utils.$('.nav-webflow-text'), Utils.$('.hero-webflow-projects-text'), 'text_font'));
      measurements.push(this.measurePair(Utils.$('.nav-experience-bg'), Utils.$('.experience-bg'), 'background'));
      measurements.push(this.measurePair(Utils.$('.nav-experience-numb'), Utils.$('.experience-number'), 'icon_center'));
      measurements.push(this.measurePair(Utils.$('.nav-experience-text'), Utils.$('.experience-text'), 'text_font'));

      // ---- Phase 2: Apply all animations ----
      gsap.set('.hero-cta-button', { opacity: 0 });
      gsap.set('.hero-button', { opacity: 0 });

      measurements.forEach(m => this.applyAnimation(m));

      // ---- Phase 3: Copyright icon (explicit handler) ----
      // Must happen AFTER Phase 2 because the main logo animation sets
      // .nav-logo-item to position:relative, which shifts .nesh-copyright-wrap
      // (position:absolute inside .nav-logo-item). Measuring before that
      // gives wrong rRect. Also uses same scroll range as main logo (end: 50% top).
      const crReal = Utils.$('.nesh-copyright-icon');
      const crGhost = Utils.$('.nesh-copyright-icon-ghost');
      if (crReal && crGhost) {
        const parent = crReal.closest('.nesh-copyright-wrap');
        const gRect = crGhost.getBoundingClientRect();
        const pRect = parent.getBoundingClientRect();
        const computedWidth = window.getComputedStyle(crReal).width;
        const computedHeight = window.getComputedStyle(crReal).height;

        gsap.fromTo(crReal, {
          x: Math.round((gRect.left - pRect.left) / STATE.sidebarScale),
          y: Math.round((gRect.top - pRect.top) / STATE.sidebarScale),
          width: (gRect.width / STATE.sidebarScale) + 'px',
          height: (gRect.height / STATE.sidebarScale) + 'px',
          position: 'absolute',
          top: '0px',
          left: '0px',
          transformOrigin: 'top left',
          ease: 'power1.inOut'
        }, {
          x: 0, y: 0,
          width: computedWidth,
          height: computedHeight,
          position: 'absolute',
          top: '0px',
          left: '0px',
          ease: 'power1.inOut',
          force3D: false,
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '50% top',
            scrub: 1
          }
        });
      }
    }
  };

  // ==========================================================================
  // ATTRIBUTE STYLE ENGINE
  // ==========================================================================
  const StyleEngine = {
    init() {
      Utils.$$('[data-tl-type], [data-number-count]').forEach(el => this.process(el));
    },
  
    destroy() {
      STATE.splitInstances.forEach(({ instance, element }) => {
        if (instance && instance.revert) {
          instance.revert();
        }
        element.querySelectorAll('.line-mask').forEach(mask => {
          const line = mask.firstChild;
          if (line) mask.parentNode.insertBefore(line, mask);
          mask.remove();
        });
        Utils.unmarkSplit(element);
      });
      STATE.splitInstances = [];
    },
  
    setupMaskedNumber(el) {
      if (el.querySelector('.number-wrap')) return;
  
      const value = el.getAttribute('data-number-count') || el.textContent.trim();
      el.textContent = '';
  
      const wrap = document.createElement('div');
      wrap.className = 'number-wrap';
      el.appendChild(wrap);
  
      [...value].forEach(char => {
        const mask = document.createElement('div');
        mask.className = 'digit-mask';
        if (!isNaN(parseInt(char))) {
          const track = document.createElement('div');
          track.className = 'digit-track';
          for (let i = 0; i <= 9; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            track.appendChild(span);
          }
          mask.appendChild(track);
          mask.dataset.target = char;
          mask.dataset.isDigit = 'true';
        } else {
          mask.textContent = char;
          mask.dataset.isDigit = 'false';
        }
        wrap.appendChild(mask);
      });
    },
  
    process(el) {
      // If element has data-tl-desktop, only process on desktop (screen width >= 768px)
      const isDesktopOnly = el.hasAttribute('data-tl-desktop');
      if (isDesktopOnly && window.innerWidth < 768) return;
      
      const type = el.getAttribute('data-tl-type');
      const numberAttr = el.getAttribute('data-number-count');
      const trigger = el.getAttribute('data-tl-trigger') || '.hero';
      const start = el.getAttribute('data-tl-start') || '900px top';
      const end = el.getAttribute('data-tl-end') || 'bottom top';
  
      let rawFrom = el.getAttribute('data-tl-from') || '{}';
      let rawTo = el.getAttribute('data-tl-to') || '{}';
      rawFrom = rawFrom.replace(/'/g, '"');
      rawTo = rawTo.replace(/'/g, '"');
      let fromVars = {}, toVars = {};
      try { fromVars = JSON.parse(rawFrom); toVars = JSON.parse(rawTo); } catch (err) {}
  
      if (numberAttr !== null) {
        this.setupMaskedNumber(el);
        const isOnce = el.hasAttribute('data-tl-once');
        const tl = gsap.timeline({ 
          scrollTrigger: { 
            trigger: trigger, 
            start: start, 
            toggleActions: isOnce ? 'play none none none' : 'play none none reverse',
            once: isOnce
          } 
        });
        const masks = el.querySelectorAll('.digit-mask[data-is-digit="true"]');
        masks.forEach((mask, i) => {
          const track = mask.querySelector('.digit-track');
          const digit = parseInt(mask.dataset.target, 10);
          const h = mask.offsetHeight;
          gsap.set(track, { y: h * 9 });
          tl.to(track, { 
            y: -digit * h, 
            duration: toVars.duration || 1.2, 
            ease: toVars.ease || 'power3.out' 
          }, i * (toVars.stagger || 0.06));
        });
        return;
      }
  
      const splitType = el.getAttribute('data-tl-split');
      let targets;
  
      if (el.getAttribute('data-tl-target')) {
        targets = el.querySelectorAll(el.getAttribute('data-tl-target'));
      } else if (splitType && typeof SplitText !== 'undefined') {
        if (Utils.isSplit(el)) {
          targets = splitType === 'lines' ? el.querySelectorAll('.line') : el.querySelectorAll(`.${splitType.slice(0, -1)}`);
        } else {
          const split = new SplitText(el, {
            type: splitType,
            linesClass: 'line',
            wordsClass: 'word',
            charsClass: 'char'
          });
          STATE.splitInstances.push({ instance: split, element: el });
          Utils.markSplit(el);

          if (splitType === 'lines') {
            split.lines.forEach(line => {
              if (!line.parentElement.classList.contains('line-mask')) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('line-mask');
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
              }
            });
            targets = split.lines;

            // Gradient headings use background-clip:text on BOTH the parent
            // (.h2-style) and each .line. After splitting, the parent still paints
            // its gradient text at the natural position while each .line paints +
            // animates its own — a doubled "ghost". Neutralize the parent's own
            // paint so only the .line children render the gradient.
            const clip = window.getComputedStyle(el).webkitBackgroundClip || window.getComputedStyle(el).backgroundClip;
            if (clip === 'text') {
              el.style.background = 'none';
              el.style.webkitTextFillColor = 'transparent';
            }
          } else {
            targets = split[splitType];
          }
        }
      } else {
        targets = el;
      }
  
      let tweenConfig = { ...toVars };
      const isOnce = el.hasAttribute('data-tl-once');
      
      if (type === 'scroll') {
        tweenConfig.scrollTrigger = { trigger: trigger, start: start, end: end, scrub: 1 };
        if (isOnce) tweenConfig.scrollTrigger.once = true;
      } else {
        if (!tweenConfig.duration) tweenConfig.duration = 0.5;
        if (!tweenConfig.ease) tweenConfig.ease = 'power1.inOut';
        tweenConfig.scrollTrigger = { 
          trigger: trigger, 
          start: start, 
          toggleActions: isOnce ? 'play none none none' : 'restart none none reverse',
          once: isOnce
        };
      }
  
      gsap.fromTo(targets, fromVars, tweenConfig);
    }
  };
  
// ==========================================================================
// HORIZONTAL SCROLL
// ==========================================================================
const HorizontalScroll = {
  setupTimeout: null,
  
  init() {
    // Disable HorizontalScroll on mobile devices (screen width < 768px)
    if (window.innerWidth < 768) return;

    this.setup();
  },

  destroy() {
    if (this.setupTimeout) {
      clearTimeout(this.setupTimeout);
      this.setupTimeout = null;
    }
    
    if (STATE.workTween) {
      STATE.workTween.kill();
      STATE.workTween = null;
    }
  },

  setup() {
    const section = Utils.$('.work_section');
    const stickyEl = Utils.$('.work-sticky');
    const stickySupportEl = Utils.$('.work-sticky-support');
    const wrap = Utils.$('.work-track-wrap');
    const track = Utils.$('.work-track');

    if (!section || !stickyEl || !stickySupportEl || !wrap || !track) return;

    this.destroy();
    gsap.set(track, { clearProps: 'transform' });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.setupTimeout = setTimeout(() => {
          this.performSetup(section, stickyEl, stickySupportEl, wrap, track);
        }, CONFIG.horizontalScrollDelay);
      });
    });
  },
  
  performSetup(section, stickyEl, stickySupportEl, wrap, track) {
    // Force reflow
    section.offsetHeight;
    stickyEl.offsetHeight;
    stickySupportEl.offsetHeight;
    wrap.offsetHeight;
    track.offsetHeight;
    
    // Calculate and set work-sticky-support height
    const sectionHeight = section.offsetHeight;
    const stickyHeight = stickyEl.offsetHeight;
    const supportHeight = sectionHeight - stickyHeight;
    stickySupportEl.style.height = supportHeight + 'px';
    
    const wrapRect = wrap.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const overflowRight = Math.max(0, trackRect.right - wrapRect.right);
    const xMovement = -overflowRight;
    
    // Calculate the scroll distance (section height minus viewport)
    const viewportHeight = window.innerHeight;
    const scrollDistance = sectionHeight - viewportHeight;

    STATE.workTween = gsap.to(track, {
      x: xMovement,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${scrollDistance}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          const newWrapRect = wrap.getBoundingClientRect();
          const newTrackRect = track.getBoundingClientRect();
          const newOverflowRight = Math.max(0, newTrackRect.right - newWrapRect.right);
          
          // Recalculate heights on refresh
          const newSectionHeight = section.offsetHeight;
          const newStickyHeight = stickyEl.offsetHeight;
          const newSupportHeight = newSectionHeight - newStickyHeight;
          stickySupportEl.style.height = newSupportHeight + 'px';
          
          // Recalculate scroll distance on refresh
          const newViewportHeight = window.innerHeight;
          const newScrollDistance = newSectionHeight - newViewportHeight;
          
          // Update the tween
          if (STATE.workTween && STATE.workTween.scrollTrigger) {
            gsap.set(track, { x: 0 });
            STATE.workTween.vars.x = -newOverflowRight;
            STATE.workTween.scrollTrigger.vars.end = `+=${newScrollDistance}`;
            STATE.workTween.invalidate();
          }
        }
      }
    });
    
    // Work card reveal animation — each card animates as it enters view
    const workCards = Utils.$$('.work-card');
    if (workCards.length) {
      gsap.set(workCards, { y: '10%', opacity: 0, scale: 0.6 });

      const wrapRect = wrap.getBoundingClientRect();
      const inViewCards = [];
      const offScreenCards = [];

      workCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.left < wrapRect.right) {
          inViewCards.push(card);
        } else {
          offScreenCards.push(card);
        }
      });

      // Cards already visible — stagger when section enters viewport
      if (inViewCards.length) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(inViewCards, {
              y: '0%', opacity: 1, scale: 1,
              duration: 1.1, ease: 'expo.out',
              stagger: 0.1
            });
          },
          once: true
        });
      }

      // Off-screen cards — animate individually as they scroll into view
      offScreenCards.forEach((card) => {
        gsap.to(card, {
          y: '0%', opacity: 1, scale: 1,
          duration: 1.1, ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: STATE.workTween,
            start: 'left right',
            toggleActions: 'play none none none'
          }
        });
      });
    }

    ScrollTrigger.refresh();
  },

  recalculate() {
    const section = Utils.$('.work_section');
    const stickyEl = Utils.$('.work-sticky');
    const stickySupportEl = Utils.$('.work-sticky-support');
    
    if (!section || !stickyEl || !stickySupportEl) return;
    
    const sectionHeight = section.offsetHeight;
    const stickyHeight = stickyEl.offsetHeight;
    const supportHeight = sectionHeight - stickyHeight;
    stickySupportEl.style.height = supportHeight + 'px';
    
    ScrollTrigger.refresh();
  }
};
  
  // ==========================================================================
  // THEME SWITCHER
  // ==========================================================================
  const ThemeSwitcher = {
    elements: [
      {
        selector: '.nav-email-wrap',
        dark: {
          '.nav-email-wrap': { border: '1px solid rgba(255, 255, 255, 0.10)', background: 'rgba(29, 29, 29, 0.60)', color: 'rgba(255, 255, 255, 0.90)' },
          '.nav-email-item': { background: 'rgba(94, 94, 94, 0.50)' }
        },
        light: {
          '.nav-email-wrap': { border: '1px solid rgba(255, 255, 255, 0.20)', background: 'rgba(223, 222, 206, 0.80)', color: '#000000' },
          '.nav-email-item': { background: '#C9C8BA' }
        }
      },
      {
        selector: '.nav-comapny-wrap',
        dark: {
          '.nav-comapny-wrap': { border: '1px solid rgba(255, 255, 255, 0.10)', background: 'rgba(29, 29, 29, 0.60)', color: 'rgba(255, 255, 255, 0.90)' },
          '.happy-ring, .semiconbio': { opacity: 0 },
          '.happy-ring-white, .semiconbio-white': { opacity: 1 }
        },
        light: {
          '.nav-comapny-wrap': { border: '1px solid rgba(255, 255, 255, 0.20)', background: 'rgba(223, 222, 206, 0.80)', color: '#000000' },
          '.happy-ring, .semiconbio': { opacity: 1 },
          '.happy-ring-white, .semiconbio-white': { opacity: 0 }
        }
      },
      {
        selector: '.nav-menu',
        dark: {
          '.nav-menu': { color: 'rgba(255, 255, 255, 0.90)' },
          '.nav-menu-bg': { border: '1px solid rgba(255, 255, 255, 0.10)', background: 'rgba(29, 29, 29, 0.60)' },
          '.nav-item-bg': { border: '1px solid rgba(255, 255, 255, 0.03)', background: 'rgba(57, 57, 57, 0.90)' }
        },
        light: {
          '.nav-menu': { color: '#000000' },
          '.nav-menu-bg': { border: '1px solid rgba(255, 255, 255, 0.20)', background: 'rgba(223, 222, 206, 0.80)' },
          '.nav-item-bg': { border: '1px solid rgba(0, 0, 0, 0.10)', background: '#EBEADA' }
        },
        onDark: () => {
          Utils.$$('.nav-item-bg').forEach(el => el.classList.add('nav-item-dark'));
        },
        onLight: () => {
          Utils.$$('.nav-item-bg').forEach(el => el.classList.remove('nav-item-dark'));
        }
      },
      {
        selector: '.nav-stats-wrap',
        dark: {
          '.nav-stats-wrap': { color: 'rgba(255, 255, 255, 0.90)' },
          '.nav-stats-wrap .nav-top-bg': { border: '1px solid rgba(255, 255, 255, 0.10)', background: 'rgba(29, 29, 29, 0.60)' }
        },
        light: {
          '.nav-stats-wrap': { color: '#000000' },
          '.nav-stats-wrap .nav-top-bg': { border: '1px solid rgba(255, 255, 255, 0.20)', background: 'rgba(223, 222, 206, 0.80)' }
        },
        onDark: () => {
          Utils.$('.nav-experience-text')?.classList.add('text-color-white');
          Utils.$('.nav-webflow-text')?.classList.add('text-color-white');
        },
        onLight: () => {
          Utils.$('.nav-experience-text')?.classList.remove('text-color-white');
          Utils.$('.nav-webflow-text')?.classList.remove('text-color-white');
        }
      },
      {
        // .nav-top-bg + social-links switch together: when .nav-top-layout overlaps
        // a dark section, both the nav-top background AND the social-links flip theme
        // at the same moment. (Standalone .social-link config removed for this reason.)
        selector: '.nav-top-layout',
        dark: {
          '.nav-top-layout': { color: 'rgba(255, 255, 255, 0.90)' },
          '.nav-top-layout > .nav-top-bg': { border: '1px solid rgba(255, 255, 255, 0.10)', background: 'rgba(29, 29, 29, 0.90)' },
          '.social-link': { backgroundColor: '#393939', color: 'var(--white)' },
          '.social-path-white': { fill: 'var(--black)' }
        },
        light: {
          '.nav-top-layout': { color: '#000000' },
          '.nav-top-layout > .nav-top-bg': { border: '1px solid rgba(255, 255, 255, 0.20)', background: 'rgba(223, 222, 206, 0.80)' },
          '.social-link': { backgroundColor: '#EBEADA', color: 'var(--black)' },
          '.social-path-white': { fill: 'var(--white)' }
        },
        onDark: () => {
          Utils.$$('.social-link').forEach(el => el.classList.add('social-dark'));
        },
        onLight: () => {
          Utils.$$('.social-link').forEach(el => el.classList.remove('social-dark'));
        }
      }
    ],
  
    elementStates: {},
  
    init() {
      // Disable ThemeSwitcher on mobile devices (screen width < 768px)
      if (window.innerWidth < 768) return;
      
      const darkSections = Utils.$$('[data-theme="dark"]');
      if (!darkSections.length) return;
  
      this.elements.forEach(config => {
        this.elementStates[config.selector] = 'light';
      });
  
      darkSections.forEach(section => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: () => this.checkOverlaps(section),
          onLeave: () => this.resetAllToLight(),
          onLeaveBack: () => this.resetAllToLight()
        });
      });
    },
  
    checkOverlaps(section) {
      const sectionRect = section.getBoundingClientRect();

      this.elements.forEach(config => {
        const navEl = Utils.$(config.selector);
        if (!navEl) return;

        const navRect = navEl.getBoundingClientRect();
        const currentState = this.elementStates[config.selector];

        let overlaps;
        if (config.selector === '.nav-menu') {
          const overlapTop = Math.max(navRect.top, sectionRect.top);
          const overlapBottom = Math.min(navRect.bottom, sectionRect.bottom);
          const overlapHeight = Math.max(0, overlapBottom - overlapTop);
          overlaps = (overlapHeight / (navRect.height || 1)) >= 0.35;
        } else {
          overlaps = !(navRect.bottom < sectionRect.top || navRect.top > sectionRect.bottom);
        }

        if (overlaps && currentState === 'light') {
          this.applyStyles(config.dark);
          if (config.onDark) config.onDark();
          this.elementStates[config.selector] = 'dark';
        } else if (!overlaps && currentState === 'dark') {
          this.applyStyles(config.light);
          if (config.onLight) config.onLight();
          this.elementStates[config.selector] = 'light';
        }
      });
    },
  
    resetAllToLight() {
      this.elements.forEach(config => {
        if (this.elementStates[config.selector] === 'dark') {
          this.applyStyles(config.light);
          if (config.onLight) config.onLight();
          this.elementStates[config.selector] = 'light';
        }
      });
    },
  
    applyStyles(styles) {
      Object.entries(styles).forEach(([selector, props]) => {
        gsap.to(selector, { ...props, duration: 0.3 });
      });
    }
  };
  
// ==========================================================================
// PRELOADER ANIMATION
// ==========================================================================
const Preloader = {
  timeline: null,

  init() {
    const logo = Utils.$('.nesh-logo-preload-svg');
    const wrapper = Utils.$('.nesh-logo-preload-wrap') || Utils.$('.nesh-logo-wrap');
    if (!logo || !wrapper) return;

    // Safety fallback: ensure preload logo is always removed after intro completes
    setTimeout(() => {
      if (logo) logo.style.display = 'none';
    }, 2800);

    // Disable preloader animation on mobile devices (screen width < 768px)
    if (window.innerWidth < 768) {
      if (logo) logo.style.display = 'none';
      return;
    }

    const letters = Utils.$$('.nesh-logo-letter');
    const navContainer = Utils.$('.nav-container');
    // .profile-img-wrap has an inverse-scale applied by Sidebar.scale(), so we
    // animate the inner .profile-img-item to avoid fighting that transform.
    const profileImgItem = Utils.$('.profile-img-item');
    const navLinks = Utils.$$('.hero-navigation-link');
    const navSeps = Utils.$$('.hero-navigation-sep');
    const navCards = Utils.$$('.nav-stats-card');
    const heroCard3 = Utils.$('.hero-card-3');
    const heroLeftText = Utils.$('.hero-left-text');
    const heroRightText = Utils.$('.hero-right-text');
    const heroHeading = Utils.$('.hero-heading');
    const navButton = Utils.$('.nav-button');
    const navButtonSecondary = Utils.$('.nav-button-secondary');
    // Captures .nav-logo-item which contains both the real nav logo (.nesh-logo)
    // and copyright wrap. Both are FLIP'd by GhostEngine to hero ghost positions,
    // so they'd flash visible if nav-container is shown before preloader logo hides.
    const navLogoItem = Utils.$('.nav-logo-item');

    // Split text helper: splits element into lines. With useMask, wraps each line
    // in an overflow:hidden parent and pushes yPercent 100 (for y-reveal animations).
    // Without useMask, just splits — caller is responsible for initial state.
    const splitLines = (el, useMask = true) => {
      if (!el || typeof SplitText === 'undefined' || Utils.isSplit(el)) return [];
      const split = new SplitText(el, { type: 'lines', linesClass: 'line' });
      STATE.splitInstances.push({ instance: split, element: el });
      Utils.markSplit(el);
      if (useMask) {
        split.lines.forEach(line => {
          if (!line.parentElement.classList.contains('line-mask')) {
            const mask = document.createElement('div');
            mask.classList.add('line-mask');
            line.parentNode.insertBefore(mask, line);
            mask.appendChild(line);
          }
        });
        gsap.set(split.lines, { yPercent: 100 });
      }
      gsap.set(el, { visibility: 'visible' });
      return split.lines;
    };

    const headingLines = splitLines(heroHeading, false);
    if (heroLeftText) gsap.set(heroLeftText, { autoAlpha: 0 });
    if (heroRightText) gsap.set(heroRightText, { autoAlpha: 0 });

    const rect = wrapper.getBoundingClientRect();
    const xToCenter = (window.innerWidth / 2) - (rect.left + rect.width / 2);
    const yToCenter = (window.innerHeight / 2) - (rect.top + rect.height / 2);

    gsap.set(logo, { autoAlpha: 1, y: yToCenter, x: window.innerWidth });
    gsap.set(letters, { yPercent: 110 });
    gsap.set(navSeps, { height: '0vw', autoAlpha: 1 });
    // Capture original display value so we can restore it after the preloader.
    // We hide via display:none inside the timeline (not during init) so GhostEngine
    // can measure .nav-logo-item children correctly before they get hidden.
    const navLogoItemDisplay = navLogoItem ? (window.getComputedStyle(navLogoItem).display || 'flex') : 'flex';

    this.timeline = gsap.timeline({ delay: CONFIG.preloaderDelay });

    // At timeline start, hide .nav-logo-item via display:none. This fires AFTER
    // GhostEngine has measured the children, so FLIP positioning works correctly.
    if (navLogoItem) this.timeline.set(navLogoItem, { display: 'none' }, 0);

    this.timeline.to(logo, { x: xToCenter, duration: 1, ease: 'power3.inOut' });
    this.timeline.to(letters, { yPercent: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }, '<');
    
    this.timeline.to(logo, { x: 0, y: 0, duration: 1, ease: 'power2.inOut' }, 1);

    // Show the nav-container at t=1.4 (40% through the logo's y-climb) so the
    // hero reveal chain can run while the preloader logo finishes its climb.
    // Inner elements stay hidden via their own autoAlpha:0 / mask states; the
    // real nav logo + copyright (.nav-logo-item) reveal at t=2 when the
    // preloader logo hides — a clean handoff.
    this.timeline.set(navContainer, { autoAlpha: 1 }, 1.4);
    this.timeline.set(logo, { display: 'none' }, 2);
    if (navLogoItem) this.timeline.set(navLogoItem, { display: navLogoItemDisplay }, 2);

    // Mask-wrap each nav link for y-reveal (no opacity)
    const navLinkInners = [];
    navLinks.forEach(link => {
      link.style.overflow = 'hidden';
      const inner = document.createElement('div');
      inner.classList.add('nav-link-mask-inner');
      while (link.firstChild) inner.appendChild(link.firstChild);
      link.appendChild(inner);
      navLinkInners.push(inner);
      gsap.set(inner, { yPercent: 100 });
      gsap.set(link, { autoAlpha: 1, pointerEvents: 'none' });
    });
    if (navSeps.length) gsap.set(navSeps, { autoAlpha: 1 });
    if (navCards.length) gsap.set(navCards, { autoAlpha: 1 });

    const webflowChildren = Utils.$$('.nav-webflow-bg, .nav-webflow-icon, .nav-webflow-text');
    const experienceChildren = Utils.$$('.nav-experience-bg, .nav-experience-numb, .nav-experience-text');
    if (webflowChildren.length) gsap.set(webflowChildren, { autoAlpha: 0, filter: 'blur(8px)' });
    if (experienceChildren.length) gsap.set(experienceChildren, { autoAlpha: 0, filter: 'blur(8px)' });
    if (navButton) gsap.set(navButton, { autoAlpha: 0, scale: 0.94, filter: 'blur(10px)' });
    if (navButtonSecondary) gsap.set(navButtonSecondary, { autoAlpha: 0, scale: 0.94, filter: 'blur(10px)' });
    if (heroCard3) gsap.set(heroCard3, { autoAlpha: 0, filter: 'blur(8px)' });
    if (profileImgItem) gsap.set(profileImgItem, { autoAlpha: 0, scale: 0.88, filter: 'blur(20px)', transformOrigin: 'center bottom' });
    if (headingLines.length) gsap.set(headingLines, { autoAlpha: 0, scale: 0.90, filter: 'blur(10px)' });

    const linkDur = 0.4;
    const sepDur = 0.2;
    const linkGap = 0.15;

    this.timeline.addLabel('heroReveal', 1.4);

    // 1. t=0.0 — profile image (blur + scale-from-bottom + autoAlpha)
    if (profileImgItem) {
      this.timeline.to(profileImgItem, {
        autoAlpha: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.1, ease: 'power2.out'
      }, 'heroReveal');
    }

    // 2. t=0.3 — hero heading (blur + scale + autoAlpha, per line)
    if (headingLines.length) {
      this.timeline.to(headingLines, {
        autoAlpha: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.0, stagger: 0.1, ease: 'power2.out'
      }, 'heroReveal+=0.3');
    }

    // 3. t=0.6 — nav links + seps all fire concurrently (no stagger between them).
    //    0.6 is the floor: earlier collides with the logo handoff and glitches the reveal.
    const navStart = 'heroReveal+=0.6';
    if (navLinkInners.length) {
      this.timeline.to(navLinkInners, { yPercent: 0, duration: linkDur, ease: 'power2.out' }, navStart);
      this.timeline.set(navLinks, { pointerEvents: 'auto' }, navStart + '+=' + linkDur);
    }
    if (navSeps.length) {
      this.timeline.to(navSeps, { height: '0.8vw', duration: sepDur, ease: 'power2.out' }, navStart);
    }

    // 4. t=0.80 — cards group, 0.1s stagger: webflow trio → experience trio → hero-card-3
    //    (all use the same autoAlpha + minimal blur, 0.9s duration)
    //    Links at 0.5, cards @ 0.60
    const cardsStart = 0.60;
    const cardOrder = [
      Utils.$('.nav-webflow-bg'),
      Utils.$('.nav-webflow-icon'),
      Utils.$('.nav-webflow-text'),
      Utils.$('.nav-experience-bg'),
      Utils.$('.nav-experience-numb'),
      Utils.$('.nav-experience-text'),
      heroCard3
    ];
    cardOrder.forEach((el, i) => {
      if (!el) return;
      this.timeline.to(el, {
        autoAlpha: 1, filter: 'blur(0px)',
        duration: 0.9, ease: 'power2.out'
      }, 'heroReveal+=' + (cardsStart + i * 0.1));
    });

    // 5. t=1.25 / 1.33 — nav-button + nav-button-secondary (autoAlpha + scale-up + blur)
    //    50% cascade: cards start at 0.80, 50% of 0.9s = 0.45 → buttons @ 1.25
    if (navButton) this.timeline.to(navButton, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, 'heroReveal+=1.25');
    if (navButtonSecondary) this.timeline.to(navButtonSecondary, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, 'heroReveal+=1.33');

    // 6. t=1.65 / 1.75 — hero-left-text + hero-right-text (paragraphs, line reveal)
    //    50% cascade: buttons start at 1.25, 50% of 0.8s = 0.40 → paragraphs @ 1.65
    const paragraphsStart = 1.65;
    if (heroLeftText) {
      this.timeline.call(() => {
        gsap.set(heroLeftText, { autoAlpha: 1 });
        const lines = heroLeftText.querySelectorAll('.line');
        if (lines.length) {
          gsap.set(lines, { yPercent: 100, autoAlpha: 0, filter: 'blur(6px)' });
          gsap.to(lines, {
            yPercent: 0, autoAlpha: 1, filter: 'blur(0px)',
            duration: 0.7, stagger: 0.075, ease: 'power2.out'
          });
        }
      }, null, 'heroReveal+=' + paragraphsStart);
    }

    if (heroRightText) {
      this.timeline.call(() => {
        gsap.set(heroRightText, { autoAlpha: 1 });
        const lines = heroRightText.querySelectorAll('.line');
        if (lines.length) {
          gsap.set(lines, { yPercent: 100, autoAlpha: 0, filter: 'blur(6px)' });
          gsap.to(lines, {
            yPercent: 0, autoAlpha: 1, filter: 'blur(0px)',
            duration: 0.7, stagger: 0.075, ease: 'power2.out'
          });
        }
      }, null, 'heroReveal+=' + (paragraphsStart + 0.1));
    }

  },

  destroy() {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }
};
  
// ==========================================================================
// MAGNETIC POSITIONING
// ==========================================================================
const MagneticPositions = {
  initialized: false,
  pairs: [],
  rafId: null,
  isRunning: false,
  isMobile: false,
  lastWidth: window.innerWidth,

  init() {
    if (this.initialized) return;

    this.isMobile = window.innerWidth < 768;
    this.lastWidth = window.innerWidth;
    this.pairs = [];
    this.collectPairs();

    if (this.pairs.length === 0) return;

    this.positionAllOnce();

    if (!this.isMobile) {
      this.startLoop();
    }

    this._resizeHandler = () => {
      const newWidth = window.innerWidth;
      const wasMobile = this.isMobile;
      
      if (this.isMobile && newWidth === this.lastWidth) {
        return;
      }
      
      this.lastWidth = newWidth;
      this.isMobile = newWidth < 768;
      
      // If crossing the mobile/desktop threshold, rebuild pairs
      if (wasMobile !== this.isMobile) {
        this.rebuildPairs();
      } else {
        this.positionAllOnce();
      }
      
      if (this.isMobile) {
        this.stopLoop();
      } else if (!this.isRunning) {
        this.startLoop();
      }
    };
    
    window.addEventListener('resize', this._resizeHandler, { passive: true });

    this.initialized = true;
  },

  collectPairs() {
    document.querySelectorAll('[data-origin]').forEach(target => {
      if (target.hasAttribute('data-desktop') && window.innerWidth < 768) return;
  
      // Check for mobile-specific connection
      let id = target.getAttribute('data-connect');
      if (this.isMobile && target.hasAttribute('data-connect-mobile')) {
        id = target.getAttribute('data-connect-mobile');
      }
      
      if (!id) return;
  
      const anchor = document.querySelector(`[data-connect="${id}"]:not([data-origin])`);
      if (!anchor) return;
  
      // Check for mobile-specific offset
      let offsetRaw = target.getAttribute('data-offset') || '0,0';
      if (this.isMobile && target.hasAttribute('data-offset-mobile')) {
        offsetRaw = target.getAttribute('data-offset-mobile');
      }
      
      // Check for mobile-specific origin
      let originConfig = target.getAttribute('data-origin');
      if (this.isMobile && target.hasAttribute('data-origin-mobile')) {
        originConfig = target.getAttribute('data-origin-mobile');
      }
      
      // Check for mobile-specific anchor position
      let anchorConfig = target.getAttribute('data-anchor-pos') || 'center';
      if (this.isMobile && target.hasAttribute('data-anchor-pos-mobile')) {
        anchorConfig = target.getAttribute('data-anchor-pos-mobile');
      }
      
      const [rawX, rawY] = offsetRaw.split(',').map(s => s.trim());
  
      this.pairs.push({
        target,
        anchor,
        originConfig: originConfig.toLowerCase(),
        anchorConfig: anchorConfig.toLowerCase(),
        offsetX: this.parseUnit(rawX),
        offsetY: this.parseUnit(rawY)
      });
  
      target.style.willChange = 'transform';
    });
  },

  rebuildPairs() {
    // Clear existing pairs and transforms
    this.pairs.forEach(pair => {
      if (pair.target) {
        pair.target.style.transform = 'none';
      }
    });
    this.pairs = [];
    
    // Recollect with new mobile/desktop state
    this.collectPairs();
    
    if (this.pairs.length > 0) {
      this.positionAllOnce();
    }
  },

  parseUnit(value) {
    if (!value || value === '0') return { value: 0, unit: 'px' };
    const match = String(value).match(/^(-?[\d.]+)(px|%|vw|vh|rem|em)?$/i);
    if (!match) return { value: 0, unit: 'px' };
    return { value: parseFloat(match[1]), unit: (match[2] || 'px').toLowerCase() };
  },

  toPx(parsed, ref = 0) {
    const { value, unit } = parsed;
    switch (unit) {
      case '%': return (value / 100) * ref;
      case 'vw': return (value / 100) * window.innerWidth;
      case 'vh': return (value / 100) * window.innerHeight;
      case 'rem': return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
      default: return value;
    }
  },

  getPoint(rect, config) {
    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2;

    if (config.includes('left')) x = rect.left;
    else if (config.includes('right')) x = rect.right;
    if (config.includes('top')) y = rect.top;
    else if (config.includes('bottom')) y = rect.bottom;

    return { x, y };
  },

  positionAllOnce() {
    this.pairs.forEach(pair => {
      const { target, anchor, originConfig, anchorConfig, offsetX, offsetY } = pair;

      if (!target || !anchor) return;

      target.style.transform = 'none';
      target.offsetHeight;

      const targetRect = target.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      const anchorPoint = this.getPoint(anchorRect, anchorConfig);
      const originPoint = this.getPoint(targetRect, originConfig);

      const offX = this.toPx(offsetX, targetRect.width);
      const offY = this.toPx(offsetY, targetRect.height);

      const finalX = Math.round((anchorPoint.x - originPoint.x + offX) * 100) / 100;
      const finalY = Math.round((anchorPoint.y - originPoint.y + offY) * 100) / 100;

      target.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
      target.style.visibility = 'visible';
      target.style.opacity = '1';
    });
  },

  updateAll() {
    this.pairs.forEach(pair => this.updatePairDesktop(pair));
  },

  updatePairDesktop(pair) {
    const { target, anchor, originConfig, anchorConfig, offsetX, offsetY } = pair;

    if (!target || !anchor) return;

    const matrix = new DOMMatrix(getComputedStyle(target).transform);
    const currentX = matrix.m41 || 0;
    const currentY = matrix.m42 || 0;

    const targetRectRaw = target.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();

    const baseRect = {
      left: targetRectRaw.left - currentX,
      top: targetRectRaw.top - currentY,
      width: targetRectRaw.width,
      height: targetRectRaw.height,
      right: targetRectRaw.right - currentX,
      bottom: targetRectRaw.bottom - currentY
    };

    const anchorPoint = this.getPoint(anchorRect, anchorConfig);
    const originPoint = this.getPoint(baseRect, originConfig);

    const offX = this.toPx(offsetX, baseRect.width);
    const offY = this.toPx(offsetY, baseRect.height);

    const finalX = Math.round((anchorPoint.x - originPoint.x + offX) * 100) / 100;
    const finalY = Math.round((anchorPoint.y - originPoint.y + offY) * 100) / 100;

    target.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
    target.style.visibility = 'visible';
    target.style.opacity = '1';
  },

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;
      this.updateAll();
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  },

  stopLoop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  },

  destroy() {
    this.stopLoop();

    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }

    this.pairs.forEach(pair => {
      if (pair.target) {
        pair.target.style.transform = '';
        pair.target.style.willChange = '';
        pair.target.style.visibility = '';
        pair.target.style.opacity = '';
      }
    });

    this.pairs = [];
    this.initialized = false;
  },

  rebuild() {
    const newWidth = window.innerWidth;
    if (this.isMobile && newWidth === this.lastWidth) {
      return;
    }
    
    this.destroy();
    setTimeout(() => this.init(), 100);
  },

  refresh() {
    const newWidth = window.innerWidth;
    if (this.isMobile && newWidth === this.lastWidth) {
      return;
    }
    
    this.positionAllOnce();
  }
};
  
// ==========================================================================
// CARD INTERACTIONS
// ==========================================================================
const CardInteractions = {
  isMobile: false,
  activeCard: null,
  activeClone: null,

  init() {
    this.isMobile = window.innerWidth < 768;
    
    this.initAboutCards();
    this.initCapaCards();
    this.initResizeHandler();
  },

  initResizeHandler() {
    let lastWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      if (newWidth === lastWidth) return;

      const wasMobile = this.isMobile;
      this.isMobile = newWidth < 768;
      lastWidth = newWidth;

      if (wasMobile !== this.isMobile) {
        this.resetCapaCards();
      }
    }, { passive: true });
  },

  initAboutCards() {
    const cards = Utils.$$('.about-card-wrap');
    const buttons = Utils.$$('.about-card-button');

    buttons.forEach(button => {
      const handler = () => {
        const card = button.closest('.about-card-wrap');
        if (!card) return;

        const popup = card.querySelector('.popup-card-wrap');
        if (!popup) return;

        // If this popup is already open, do nothing (avoid flicker + duplicate close listeners).
        if (popup.classList.contains('is-active-card')) return;

        // Only one popup open at a time: close any other open popup first.
        document.querySelectorAll('.popup-card-wrap.is-active-card').forEach(p => {
          p.classList.remove('is-active-card');
        });

        cards.forEach(c => c.style.zIndex = '5');
        card.style.zIndex = '10';

        popup.classList.add('is-active-card');

        const closeBtn = popup.querySelector('.popup-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            popup.classList.remove('is-active-card');
            card.style.zIndex = '5';
          }, { once: true });
        }
      };

      Utils.addEvent(button, 'click', handler);
    });
  },

  initCapaCards() {
    const cards = Utils.$$('.capa-card-item');
    const overviewWrap = Utils.$('.capa-overview-wrap');

    if (cards.length === 0) return;

    // Hide all gsap-icon-letter elements initially
    const allLetters = Utils.$$('.gsap-icon-letter');
    if (allLetters.length) gsap.set(allLetters, { opacity: 0 });

    const self = this;

    cards.forEach((card, index) => {
      const parentCard = card.closest('.capa-card');

      // Desktop: hover
      card.addEventListener('mouseenter', function() {
        if (self.isMobile) return;
        
        if (parentCard) parentCard.style.zIndex = '10';
        self.animateCardIn(card);
      });

      card.addEventListener('mouseleave', function() {
        if (self.isMobile) return;
        
        self.animateCardOut(card);
        if (parentCard) parentCard.style.zIndex = '5';
      });

      // Mobile: tap
      card.addEventListener('click', function(e) {
        if (!self.isMobile) return;
        if (!overviewWrap) return;

        // If clicking arrow wrap, don't open (let it close if active)
        if (e.target.closest('.capa-card-arrow-wrap')) {
          return;
        }

        // If this card is already active, close it
        if (self.activeCard === card) {
          self.closeActiveCard();
          return;
        }

        // Close any previously active card first
        if (self.activeCard) {
          self.closeActiveCard(false);
        }

        // Get positions
        const cardRect = card.getBoundingClientRect();
        
        // Show overview (transparent) to get its position
        gsap.set(overviewWrap, { 
          display: 'flex', 
          backgroundColor: 'transparent' 
        });
        const overviewRect = overviewWrap.getBoundingClientRect();
        
        // Calculate starting offset
        const overviewCenterX = overviewRect.left + overviewRect.width / 2;
        const overviewCenterY = overviewRect.top + overviewRect.height / 2;
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const startX = cardCenterX - overviewCenterX;
        const startY = cardCenterY - overviewCenterY;

        // Hide original card AND arrow wrap IMMEDIATELY before cloning
        const originalArrowWrap = card.querySelector('.capa-card-arrow-wrap');
        card.style.visibility = 'hidden';
        if (originalArrowWrap) {
          originalArrowWrap.style.visibility = 'hidden';
        }

        // Clone the card
        const clone = card.cloneNode(true);
        clone.classList.add('is-flipped-card');
        
        // Make clone visible
        clone.style.visibility = 'visible';

        // Add clone to overview
        overviewWrap.innerHTML = '';
        overviewWrap.appendChild(clone);

        // Set clone at original card position
        gsap.set(clone, {
          x: startX,
          y: startY
        });

        // Get arrow wrap in clone and set initial background
        const cloneArrowWrap = clone.querySelector('.capa-card-arrow-wrap');
        const cloneArrow = clone.querySelector('.capa-card-arrow');
        if (cloneArrowWrap) {
          // Make clone arrow visible
          cloneArrowWrap.style.visibility = 'visible';

          gsap.set(cloneArrowWrap, {
            backgroundColor: 'rgba(63, 64, 60, 0)'
          });

          // Rotate arrow 180deg when opened
          if (cloneArrow) {
            gsap.to(cloneArrow, { rotation: 180, duration: 0.4, ease: 'power2.out' });
          }

          // Add click handler to close
          cloneArrowWrap.addEventListener('click', function(e) {
            e.stopPropagation();
            self.closeActiveCard();
          });
        }

        // Animation duration for flip
        const flipDuration = 0.5;

        // Sequential animation
        const tl = gsap.timeline();

        // 1. Move clone to center
        tl.to(clone, {
          x: 0,
          y: 0,
          duration: flipDuration,
          ease: 'power3.out'
        });

        // 2. Background starts animating at same time as flip
        tl.to(overviewWrap, {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          duration: 0.5,
          ease: 'power2.out'
        }, '<');

        // 3. Arrow wrap background (same time as overlay background)
        if (cloneArrowWrap) {
          tl.to(cloneArrowWrap, {
            backgroundColor: 'rgba(63, 64, 60, 0.15)',
            duration: 0.4,
            ease: 'power2.out'
          }, '<');
        }

        // 4. Card content starts at 50% of flip animation
        tl.add(() => self.animateCardIn(clone), flipDuration * 0.5);

        // Store references
        self.activeCard = card;
        self.activeClone = clone;
      });
    });

    // Mobile: tap outside to close
    document.addEventListener('click', (e) => {
      if (!this.isMobile || !this.activeCard) return;
      if (!overviewWrap) return;

      const isCardClick = e.target.closest('.capa-card-item');
      const isOverviewClick = overviewWrap.contains(e.target);

      if (!isCardClick && !isOverviewClick) {
        this.closeActiveCard();
      }
    });
  },

  animateCardIn(targetCard) {
    const cardBottom = targetCard.querySelector('.capa-card-bottom');
    const cardIcons = targetCard.querySelectorAll('[data-var-hover], [data-var-hover-mobile]');
    const cardLetters = targetCard.querySelectorAll('.gsap-icon-letter');

    const tl = gsap.timeline();

    tl.to(targetCard, {
      '--card-hover--card-text': 1,
      '--card-hover--card-padding-top-bottom': this.isMobile ? 2.61 : 1.35,
      '--card-hover--card-padding-left-right': this.isMobile ? 1.35 : 1.25,
      duration: 0.65,
      ease: 'power3.out'
    });

    if (cardBottom) {
      tl.to(cardBottom, {
        gridTemplateRows: '1fr',
        duration: 0.65,
        ease: 'power3.out'
      }, '<');
    }

    cardIcons.forEach(icon => {
      let targetScale;
      if (this.isMobile && icon.hasAttribute('data-var-hover-mobile')) {
        targetScale = parseFloat(icon.dataset.varHoverMobile) || 1;
      } else if (icon.hasAttribute('data-var-hover')) {
        targetScale = parseFloat(icon.dataset.varHover) || 1;
      } else {
        targetScale = 1;
      }
      
      tl.to(icon, {
        '--card-hover--card-icon-size': targetScale,
        duration: 0.65,
        ease: 'power3.out'
      }, '<');
    });

    if (cardLetters.length) {
      // Kill any in-flight letter tweens (including future-staggered ones from a
      // prior hover) so fast in/out cycles can't leave letters stuck visible.
      gsap.killTweensOf(cardLetters);
      tl.fromTo(cardLetters,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', overwrite: true },
        '<'
      );
    }

    return tl;
  },

  animateCardOut(targetCard) {
    const cardBottom = targetCard.querySelector('.capa-card-bottom');
    const cardIcons = targetCard.querySelectorAll('[data-var-hover], [data-var-hover-mobile]');
    const cardLetters = targetCard.querySelectorAll('.gsap-icon-letter');

    const tl = gsap.timeline();

    if (cardBottom) {
      tl.to(cardBottom, {
        gridTemplateRows: '0fr',
        duration: 0.65,
        ease: 'power2.out'
      });
    }

    tl.to(targetCard, {
      '--card-hover--card-text': 0,
      '--card-hover--card-padding-top-bottom': 1,
      '--card-hover--card-padding-left-right': 1,
      duration: 0.65,
      ease: 'power2.out'
    }, '<');

    cardIcons.forEach(icon => {
      tl.to(icon, {
        '--card-hover--card-icon-size': 1,
        duration: 0.65,
        ease: 'power2.out'
      }, '<');
    });

    if (cardLetters.length) {
      gsap.killTweensOf(cardLetters);
      // Reverse stagger on hover-out: last letter fades first, first letter last.
      tl.to(cardLetters, {
        opacity: 0,
        duration: 0.3,
        stagger: { each: 0.05, from: 'end' },
        ease: 'power2.out',
        overwrite: true
      }, '<');
    }

    return tl;
  },

  closeActiveCard(animate = true) {
    const overviewWrap = Utils.$('.capa-overview-wrap');

    if (!this.activeCard) return;

    const originalCard = this.activeCard;
    const clone = this.activeClone;

    // Get original arrow wrap to restore later
    const originalArrowWrap = originalCard.querySelector('.capa-card-arrow-wrap');

    if (overviewWrap && animate && clone) {
      // Get original card position
      const cardRect = originalCard.getBoundingClientRect();
      const overviewRect = overviewWrap.getBoundingClientRect();
      
      const overviewCenterX = overviewRect.left + overviewRect.width / 2;
      const overviewCenterY = overviewRect.top + overviewRect.height / 2;
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const endX = cardCenterX - overviewCenterX;
      const endY = cardCenterY - overviewCenterY;

      // Get arrow wrap and arrow in clone
      const cloneArrowWrap = clone.querySelector('.capa-card-arrow-wrap');
      const cloneArrow = clone.querySelector('.capa-card-arrow');

      const tl = gsap.timeline({
        onComplete: () => {
          overviewWrap.innerHTML = '';
          gsap.set(overviewWrap, { display: 'none', backgroundColor: 'transparent' });
          originalCard.style.visibility = 'visible';
          
          // Restore original arrow wrap visibility
          if (originalArrowWrap) {
            originalArrowWrap.style.visibility = 'visible';
          }
        }
      });

      // 1. First - fade out backgrounds
      tl.to(overviewWrap, {
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out'
      });

      if (cloneArrowWrap) {
        tl.to(cloneArrowWrap, {
          backgroundColor: 'rgba(63, 64, 60, 0)',
          duration: 0.3,
          ease: 'power2.out'
        }, '<');
      }

      // Rotate arrow back to 0deg
      if (cloneArrow) {
        tl.to(cloneArrow, { rotation: 0, duration: 0.3, ease: 'power2.out' }, '<');
      }

      // 2. Then - collapse card + move back (same time)
      tl.add(this.animateCardOut(clone));

      tl.to(clone, {
        x: endX,
        y: endY,
        duration: 0.7,
        ease: 'power2.out'
      }, '<');

    } else if (overviewWrap) {
      overviewWrap.innerHTML = '';
      gsap.set(overviewWrap, { display: 'none', backgroundColor: 'transparent' });
      originalCard.style.visibility = 'visible';
      
      // Restore original arrow wrap visibility
      if (originalArrowWrap) {
        originalArrowWrap.style.visibility = 'visible';
      }
    }

    this.activeCard = null;
    this.activeClone = null;
  },

  resetCapaCards() {
    this.closeActiveCard(false);
  }
};
  
  // ==========================================================================
  // PROFILE IMAGE HANDLER
  // ==========================================================================
  const ProfileImage = {
    isMoved: false,
    originalStyles: null,
  
    init() {
      const hero = Utils.$('.hero');
      const profileWrap = Utils.$('.profile-img-wrap');
      const navContainer = Utils.$('.nav-container');
      if (!hero || !profileWrap || !navContainer) return;
  
      this.originalStyles = {
        cssText: profileWrap.style.cssText,
        scale: 1 / STATE.sidebarScale
      };
  
      const elementPercent = 0.50;
  
      const handleScroll = () => {
        const heroRect = hero.getBoundingClientRect();
        const hasPassed = (heroRect.top + heroRect.height * elementPercent) <= 0;
  
        if (hasPassed && !this.isMoved) {
          const rect = profileWrap.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(profileWrap);
          const currentOpacity = computedStyle.opacity;
          const currentVisibility = computedStyle.visibility;
          
          document.body.appendChild(profileWrap);
          profileWrap.style.cssText = `
            position: fixed !important;
            top: ${rect.top}px !important;
            left: ${rect.left}px !important;
            width: ${rect.width}px !important;
            height: ${rect.height}px !important;
            transform: none !important;
            z-index: 1000;
            opacity: ${currentOpacity};
            visibility: ${currentVisibility};
          `;
          this.isMoved = true;
        } else if (!hasPassed && this.isMoved) {
          const computedStyle = window.getComputedStyle(profileWrap);
          const currentOpacity = computedStyle.opacity;
          const currentVisibility = computedStyle.visibility;
          
          navContainer.prepend(profileWrap);
          profileWrap.style.cssText = this.originalStyles.cssText;
          gsap.set(profileWrap, { 
            scale: this.originalStyles.scale, 
            transformOrigin: 'top left', 
            force3D: false,
            opacity: currentOpacity,
            visibility: currentVisibility
          });
          this.isMoved = false;
        }
      };
  
      Utils.addEvent(window, 'scroll', handleScroll, { passive: true });
      handleScroll();
    }
  };
  
// ==========================================================================
// CTA ANIMATION
// ==========================================================================
const CTAAnimation = {
  init() {
    const wrap = Utils.$('.cta-wrap');
    if (!wrap) return;

    const typingGrid = wrap.querySelector('.typing-grid');
    const typingBubble = typingGrid?.querySelector('.cta-bubble') || typingGrid?.firstElementChild;
    const chatGrid = wrap.querySelector('.cta-chat-grid');
    const chatBubble = chatGrid?.querySelector('.cta-bubble') || chatGrid?.firstElementChild;
    const chatText = chatGrid?.querySelector('.cta-text');
    const buttonGrid = wrap.querySelector('.cta-button-grid');
    const buttonBubble = buttonGrid?.querySelector('.cta-bubble') || buttonGrid?.firstElementChild;
    const buttonText = buttonGrid?.querySelector('p');
    const dots = wrap.querySelectorAll('.typing-dots');
    const speed = CONFIG.ctaSpeed;

    // Initial states for grids
    gsap.set([chatGrid, buttonGrid], { gridTemplateRows: '0fr' });
    gsap.set(typingGrid, { gridTemplateRows: '1fr' });
    
    // Initial states for bubbles (scale from 0)
    if (typingBubble) gsap.set(typingBubble, { scale: 0, opacity: 0, transformOrigin: 'bottom left' });
    if (chatBubble) gsap.set(chatBubble, { scale: 0, opacity: 0, transformOrigin: 'bottom left' });
    if (buttonBubble) gsap.set(buttonBubble, { scale: 0, opacity: 0, transformOrigin: 'bottom left' });
    
    // Initial states for text content
    if (chatText) gsap.set(chatText, { opacity: 0, filter: 'blur(4px)' });
    if (buttonText) gsap.set(buttonText, { opacity: 0, filter: 'blur(4px)' });
    
    // Typing dots initial state
    gsap.set(dots, { y: 0, opacity: 0.6 });

    // Typing dots loop animation
    const dotsTl = gsap.timeline({ repeat: -1, paused: true });
    dotsTl.to(dots, { y: -6, opacity: 1, duration: 0.35 * speed, stagger: 0.15 * speed, ease: 'power1.inOut' })
          .to(dots, { y: 0, opacity: 0.6, duration: 0.35 * speed, stagger: 0.15 * speed, ease: 'power1.inOut' });

    // Helper function to get position offset between two elements
    const getPositionOffset = (from, to) => {
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      return {
        x: toRect.left - fromRect.left,
        y: toRect.top - fromRect.top
      };
    };

    ScrollTrigger.create({
      trigger: wrap,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        // Calculate offsets before animation starts
        const chatOffset = getPositionOffset(typingGrid, chatGrid);
        const buttonOffset = getPositionOffset(typingGrid, buttonGrid);
        
        // Set typing grid initial position at chat-grid level
        gsap.set(typingGrid, { x: chatOffset.x, y: chatOffset.y });
        
        const tl = gsap.timeline();
        
        // === PHASE 1: TYPING AT CHAT-GRID POSITION ===
        tl.to(typingBubble, {
          scale: 1,
          opacity: 1,
          duration: 0.5 * speed,
          ease: 'back.out(1.7)'
        });
        
        tl.to(typingBubble, {
          scale: 1.03,
          duration: 0.1 * speed,
          ease: 'power2.out'
        }, '-=0.1');
        
        tl.to(typingBubble, {
          scale: 1,
          duration: 0.15 * speed,
          ease: 'power2.inOut'
        });
        
        tl.call(() => dotsTl.play(), null, '-=0.2');

        // === PHASE 2: CHAT APPEARS + TYPING MOVES TO BUTTON-GRID ===
        // Move typing to button-grid position
        tl.to(typingGrid, {
          x: buttonOffset.x,
          y: buttonOffset.y,
          duration: 0.4 * speed,
          ease: 'power2.inOut'
        }, '+=0.5');
        
        // Chat grid expands (slightly after typing starts moving)
        tl.to(chatGrid, { 
          gridTemplateRows: '1fr', 
          duration: 0.3 * speed, 
          ease: 'power2.out' 
        }, '<0.1');
        
        // Chat bubble pops in
        tl.to(chatBubble, {
          scale: 1,
          opacity: 1,
          duration: 0.5 * speed,
          ease: 'back.out(1.7)'
        }, '-=0.1');
        
        tl.to(chatBubble, {
          scale: 1.03,
          duration: 0.1 * speed,
          ease: 'power2.out'
        }, '-=0.1');
        
        tl.to(chatBubble, {
          scale: 1,
          duration: 0.15 * speed,
          ease: 'power2.inOut'
        });
        
        if (chatText) {
          tl.to(chatText, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.4 * speed,
            ease: 'power2.out'
          }, '-=0.2');
        }

        // === PHASE 3: BUTTON APPEARS + TYPING MOVES TO ORIGINAL ===
        // Move typing back to original position
        tl.to(typingGrid, {
          x: 0,
          y: 0,
          duration: 0.4 * speed,
          ease: 'power2.inOut'
        }, '+=0.5');
        
        // Button grid expands
        tl.to(buttonGrid, { 
          gridTemplateRows: '1fr', 
          duration: 0.3 * speed, 
          ease: 'power2.out' 
        }, '<0.1');
        
        // Button bubble pops in
        tl.to(buttonBubble, {
          scale: 1,
          opacity: 1,
          duration: 0.5 * speed,
          ease: 'back.out(1.7)'
        }, '-=0.1');
        
        tl.to(buttonBubble, {
          scale: 1.03,
          duration: 0.1 * speed,
          ease: 'power2.out'
        }, '-=0.1');
        
        tl.to(buttonBubble, {
          scale: 1,
          duration: 0.15 * speed,
          ease: 'power2.inOut'
        });
        
        if (buttonText) {
          tl.to(buttonText, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.4 * speed,
            ease: 'power2.out'
          }, '-=0.2');
        }

        // === PHASE 4: TYPING DISAPPEARS ===
        tl.call(() => dotsTl.pause(), null, '+=0.3');
        
        tl.to(typingBubble, {
          scale: 0,
          opacity: 0,
          duration: 0.4 * speed,
          ease: 'back.in(1.7)'
        });
      }
    });
  }
};
  
  // ==========================================================================
  // SWIPER INITIALIZATION WITH CUSTOM DRAG INDICATOR
  // ==========================================================================
  const SwiperInit = {
    instance: null,
    dragWrap: null,
    dragTween: null,
    isDragging: false,
    isInsideSwiper: false,
    dragStartX: 0,
    dragStartY: 0,
    lastDragDirection: null, // 'left' or 'right'

    init() {
      if (typeof Swiper === 'undefined' || !Utils.$('.swiper')) return;

      this.dragWrap = Utils.$('.drag-wrap');
      if (!this.dragWrap) {
        console.warn('SwiperInit: .drag-wrap element not found');
        return;
      }

      gsap.set(this.dragWrap, { 
        opacity: 0, 
        scale: 0.8,
        pointerEvents: 'none',
        position: 'fixed',
        zIndex: 9999
      });

      this.instance = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 14,
        loop: false,
        autoHeight: true,
        simulateTouch: true,
        grabCursor: false,
        speed: 500,
        resistanceRatio: 0.85,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          bulletClass: 'swiper-bullet',
          bulletActiveClass: 'is-active'
        },
        on: {
          touchStart: (swiper, event) => {
            this.isDragging = true;
            this.dragStartX = event.touches?.[0]?.clientX || event.clientX || 0;
            this.dragStartY = event.touches?.[0]?.clientY || event.clientY || 0;
            this.lastDragDirection = null;
            this.startDragging(event);
          },
          touchMove: (swiper, event) => {
            this.updateDragIndicatorPosition(event);
            
            // Calculate drag direction
            const currentX = event.touches?.[0]?.clientX || event.clientX || 0;
            const currentY = event.touches?.[0]?.clientY || event.clientY || 0;
            const deltaX = currentX - this.dragStartX;
            const deltaY = Math.abs(currentY - this.dragStartY);
            
            
            // Detect direction
            if (Math.abs(deltaX) > 5 && Math.abs(deltaX) > deltaY * 0.5) {
              const newDirection = deltaX < 0 ? 'left' : 'right';
              
              
              if (newDirection !== this.lastDragDirection) {
                this.lastDragDirection = newDirection;
                
                // Scale icons DIRECTLY HERE
                
                const leftIcon = this.dragWrap?.querySelector('.drag-left-icon');
                const rightIcon = this.dragWrap?.querySelector('.drag-right-icon');
                
                
                if (leftIcon && rightIcon) {
                  if (newDirection === 'left') {
                    gsap.to(leftIcon, { scale: 1.5, duration: 0.2, ease: 'back.out(2)' });
                    gsap.to(rightIcon, { scale: 0.8, duration: 0.2, ease: 'power2.out' });
                    
                    // Add classes
                    leftIcon.classList.add('is-active');
                    rightIcon.classList.remove('is-active');
                  } else {
                    gsap.to(rightIcon, { scale: 1.5, duration: 0.2, ease: 'back.out(2)' });
                    gsap.to(leftIcon, { scale: 0.8, duration: 0.2, ease: 'power2.out' });
                    
                    // Add classes
                    rightIcon.classList.add('is-active');
                    leftIcon.classList.remove('is-active');
                  }
                } else {
                }
              }
            }
          },
          touchEnd: () => {
            this.isDragging = false;
            this.backToIdle();
          },
          sliderMove: (swiper, event) => {
            this.updateDragIndicatorPosition(event);
            
            // Calculate drag direction for desktop
            const currentX = event.clientX || 0;
            const currentY = event.clientY || 0;
            
            if (currentX === 0) return; // Skip if no valid coordinates
            
            const deltaX = currentX - this.dragStartX;
            const deltaY = Math.abs(currentY - this.dragStartY);
            
            
            // Detect direction
            if (Math.abs(deltaX) > 5) {
              const newDirection = deltaX < 0 ? 'left' : 'right';
              
              
              if (newDirection !== this.lastDragDirection) {
                this.lastDragDirection = newDirection;
                
                // Scale icons DIRECTLY HERE
                
                const leftIcon = this.dragWrap?.querySelector('.drag-left-icon');
                const rightIcon = this.dragWrap?.querySelector('.drag-right-icon');
                
                
                if (leftIcon && rightIcon) {
                  if (newDirection === 'left') {
                    gsap.to(leftIcon, { scale: 1.5, duration: 0.2, ease: 'back.out(2)' });
                    gsap.to(rightIcon, { scale: 0.8, duration: 0.2, ease: 'power2.out' });
                    
                    // Add classes
                    leftIcon.classList.add('is-active');
                    rightIcon.classList.remove('is-active');
                  } else {
                    gsap.to(rightIcon, { scale: 1.5, duration: 0.2, ease: 'back.out(2)' });
                    gsap.to(leftIcon, { scale: 0.8, duration: 0.2, ease: 'power2.out' });
                    
                    // Add classes
                    rightIcon.classList.add('is-active');
                    leftIcon.classList.remove('is-active');
                  }
                } else {
                }
              }
            }
          }
        }
      });

      const swiperEl = Utils.$('.swiper');
      if (swiperEl) {
        // Mouse enters swiper - SHOW cursor
        Utils.addEvent(swiperEl, 'mouseenter', (e) => {
          this.isInsideSwiper = true;
          this.showDragIndicatorIdle();
          this.updateDragIndicatorPosition(e);
        });

        // Mouse leaves swiper - HIDE cursor (only if not dragging)
        Utils.addEvent(swiperEl, 'mouseleave', (e) => {
          
          // IMPORTANT: Do NOT change isInsideSwiper if we're dragging
          // Let the mouseup event determine final position
          if (!this.isDragging) {
            this.isInsideSwiper = false;
            this.hideDragIndicator();
          } else {
          }
        });

        // Mouse moves inside swiper - FOLLOW cursor always
        Utils.addEvent(swiperEl, 'mousemove', (e) => {
          this.updateDragIndicatorPosition(e);
        });

        // Mouse down - START DRAG (scale up)
        Utils.addEvent(swiperEl, 'mousedown', (e) => {
          this.isDragging = true;
          this.dragStartX = e.clientX;
          this.dragStartY = e.clientY;
          this.lastDragDirection = null;
          this.startDragging(e);
        });

        // Mouse moves anywhere while dragging - FOLLOW cursor
        Utils.addEvent(document, 'mousemove', (e) => {
          if (this.isDragging) {
            this.updateDragIndicatorPosition(e);
            
            // Calculate drag direction
            const deltaX = e.clientX - this.dragStartX;
            const deltaY = Math.abs(e.clientY - this.dragStartY);
            
            
            // Lower threshold - detect horizontal direction if movement > 5px and mostly horizontal
            if (Math.abs(deltaX) > 5 && Math.abs(deltaX) > deltaY * 0.5) {
              const newDirection = deltaX < 0 ? 'left' : 'right';
              
              
              // Only update if direction changed
              if (newDirection !== this.lastDragDirection) {
                this.lastDragDirection = newDirection;
                this.updateDragDirection(newDirection);
              }
            }
            
            // Track if we're inside swiper bounds during drag
            const swiperRect = swiperEl.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            const wasInside = this.isInsideSwiper;
            this.isInsideSwiper = (
              x >= swiperRect.left &&
              x <= swiperRect.right &&
              y >= swiperRect.top &&
              y <= swiperRect.bottom
            );
            
            if (wasInside !== this.isInsideSwiper) {
            }
          }
        });

        // Mouse up - STOP DRAG
        Utils.addEvent(document, 'mouseup', (e) => {
          if (this.isDragging) {
            this.isDragging = false;

            // Check: are we still inside swiper?
            const swiperRect = swiperEl.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            const stillInside = (
              x >= swiperRect.left &&
              x <= swiperRect.right &&
              y >= swiperRect.top &&
              y <= swiperRect.bottom
            );


            this.isInsideSwiper = stillInside;

            if (stillInside) {
              // Still inside swiper - keep visible, just scale back down
              this.backToIdle();
            } else {
              // Outside swiper - hide
              this.hideDragIndicator();
            }
          }
        });

        // Client text link hover — animate drag-wrap p elements
        const clientLinks = Utils.$$('.swiper-slide .client-text-link');
        const dragParagraphs = this.dragWrap ? this.dragWrap.querySelectorAll('p') : [];

        if (clientLinks.length && dragParagraphs.length >= 2) {
          clientLinks.forEach(link => {
            Utils.addEvent(link, 'mouseenter', () => {
              gsap.to(dragParagraphs[0], { yPercent: -100, duration: 0.4, ease: 'power2.out' });
              gsap.to(dragParagraphs[1], { yPercent: -100, duration: 0.4, ease: 'power2.out' });
            });
            Utils.addEvent(link, 'mouseleave', () => {
              gsap.to(dragParagraphs[0], { yPercent: 0, duration: 0.4, ease: 'power2.out' });
              gsap.to(dragParagraphs[1], { yPercent: 0, duration: 0.4, ease: 'power2.out' });
            });
          });
        }
      }
    },

    showDragIndicatorIdle() {
      if (!this.dragWrap) return;
      
      
      if (this.dragTween) this.dragTween.kill();
      
      // Smooth fade in animation (same duration as fade out)
      this.dragTween = gsap.to(this.dragWrap, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      this.dragWrap.classList.add('is-ready');
      this.dragWrap.classList.remove('is-dragging');
    },

    startDragging(event) {
      if (!this.dragWrap) return;
      
      if (this.dragTween) this.dragTween.kill();
      
      this.updateDragIndicatorPosition(event);
      
      // Reset both icons to scale 1 when starting drag
      const leftIcon = this.dragWrap.querySelector('.drag-left-icon');
      const rightIcon = this.dragWrap.querySelector('.drag-right-icon');
      
      if (leftIcon) gsap.set(leftIcon, { scale: 1 });
      if (rightIcon) gsap.set(rightIcon, { scale: 1 });

      this.dragWrap.classList.add('is-dragging');
      this.dragWrap.classList.remove('is-ready');
    },

    updateDragDirection(direction) {
      
      if (!this.dragWrap) {
        return;
      }
      
      
      try {
        const leftIcon = this.dragWrap.querySelector('.drag-left-icon');
        const rightIcon = this.dragWrap.querySelector('.drag-right-icon');
        
        
        if (!leftIcon || !rightIcon) {
          return;
        }
        
        if (direction === 'left') {
          // Scale up left icon, scale down right icon
          gsap.to(leftIcon, {
            scale: 1.5,
            duration: 0.2,
            ease: 'back.out(2)'
          });
          gsap.to(rightIcon, {
            scale: 0.8,
            duration: 0.2,
            ease: 'power2.out'
          });
        } else if (direction === 'right') {
          // Scale up right icon, scale down left icon
          gsap.to(rightIcon, {
            scale: 1.5,
            duration: 0.2,
            ease: 'back.out(2)'
          });
          gsap.to(leftIcon, {
            scale: 0.8,
            duration: 0.2,
            ease: 'power2.out'
          });
        }
        
      } catch (error) {
      }
    },

    backToIdle() {
      if (!this.dragWrap) return;
      
      
      if (this.dragTween) this.dragTween.kill();
      
      // Reset both icons to normal scale
      const leftIcon = this.dragWrap.querySelector('.drag-left-icon');
      const rightIcon = this.dragWrap.querySelector('.drag-right-icon');
      
      if (leftIcon) {
        gsap.to(leftIcon, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      if (rightIcon) {
        gsap.to(rightIcon, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      
      this.dragWrap.classList.add('is-ready');
      this.dragWrap.classList.remove('is-dragging');
      
      // Reset direction
      this.lastDragDirection = null;
    },

    updateDragIndicatorPosition(event) {
      if (!this.dragWrap) return;

      const x = event.clientX || event.touches?.[0]?.clientX || 0;
      const y = event.clientY || event.touches?.[0]?.clientY || 0;

      gsap.set(this.dragWrap, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50
      });
    },

    updateDragIndicator(event) {
      if (!this.dragWrap) return;

      const x = event.clientX || event.touches?.[0]?.clientX || 0;
      const y = event.clientY || event.touches?.[0]?.clientY || 0;

      gsap.set(this.dragWrap, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50
      });
    },

    hideDragIndicator() {
      if (!this.dragWrap) return;
      
      
      this.isDragging = false;
      
      if (this.dragTween) this.dragTween.kill();
      
      this.dragTween = gsap.to(this.dragWrap, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in'
      });

      this.dragWrap.classList.remove('is-dragging', 'is-ready');
      
    },

    destroy() {
      if (this.dragWrap) {
        if (this.dragTween) this.dragTween.kill();
        gsap.set(this.dragWrap, { opacity: 0 });
        this.dragWrap.classList.remove('is-dragging', 'is-ready');
      }

      if (this.instance) {
        this.instance.destroy(true, true);
        this.instance = null;
      }

      this.isDragging = false;
      this.isInsideSwiper = false;
    }
  };
  
  // ==========================================================================
  // LENIS SMOOTH SCROLL
  // ==========================================================================
  const LenisInit = {
    init() {
      if (typeof Lenis === "undefined") return;
  
      const lenisOptions = {
        ...(CONFIG.lenis || {}),
        lerp: 0.1,
      };
  
      STATE.lenis = new Lenis(lenisOptions);
  
      STATE.lenis.on("scroll", ScrollTrigger.update);
  
      gsap.ticker.add((time) => {
        STATE.lenis.raf(time * 1000);
      });
  
      gsap.ticker.lagSmoothing(0);
    },
  
    destroy() {
      if (STATE.lenis) {
        STATE.lenis.destroy();
        STATE.lenis = null;
      }
    },
  };
  
  // ==========================================================================
  // TEXT REVEAL ANIMATION
  // ==========================================================================
  const TextReveal = {
    init() {
      const target = Utils.$('.what_you_get-text');
      if (!target || Utils.isSplit(target)) return;
  
      this.splitTextPreservingElements(target);
      Utils.markSplit(target);
  
      const chars = target.querySelectorAll('.anim-char');
  
      gsap.fromTo(chars,
        { color: '#E0DFC5', filter: 'blur(0px)', opacity: 0.1, y: 5 },
        {
          color: 'black', filter: 'blur(0px)', opacity: 1, y: 0,
          force3D: true, duration: 0.5, stagger: 0.1, ease: 'power1.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 92%',
            end: 'top 25%',
            scrub: 1,
            markers: false
          }
        }
      );
    },
  
    splitTextPreservingElements(element) {
      const processNode = (node, container) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const chars = text.split('');
          
          chars.forEach(char => {
            const span = document.createElement('span');
            span.className = 'anim-char';
            span.textContent = char;
            container.appendChild(span);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const shouldPreserve = 
            node.hasAttribute('data-connect') || 
            node.hasAttribute('data-origin') ||
            node.classList.contains('span') ||
            node.tagName === 'BR' ||
            node.tagName === 'IMG';
  
          if (shouldPreserve) {
            const clone = node.cloneNode(true);
            container.appendChild(clone);
          } else {
            const wrapper = node.cloneNode(false);
            
            Array.from(node.childNodes).forEach(child => {
              processNode(child, wrapper);
            });
            
            if (wrapper.childNodes.length > 0) {
              container.appendChild(wrapper);
            }
          }
        }
      };
  
      const fragment = document.createDocumentFragment();
      
      Array.from(element.childNodes).forEach(node => {
        processNode(node, fragment);
      });
  
      element.innerHTML = '';
      element.appendChild(fragment);
    }
  };
  
  // ==========================================================================
  // IMAGE TRAIL (FOOTER LOGO)
  // ==========================================================================
  const ImageTrail = {
    images: [
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a080d17ca1d8d0c085a58_Frame%20116046298.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b45d5bf5df6ed763ff_Frame%20116046247.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b48a5e0c4375823c97_Frame%20116046251.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b4729e06b7b9774003_Frame%20116046250.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b40e774226223d6d23_Frame%20116046242.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b4c7536983db8aa94b_Frame%20116046243.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b4ea501cfa7bfc61bc_Frame%20116046248.avif',
      'https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a04eefa82a9886bdc4a85_Frame%20116046241.avif'
    ],
    config: {
      wrapperSelector: '.footer-logo',
      svgSelector: '.footer-logo-icon',
      imageGroupId: 'image-trail-group',
      minDistance: 30,
      maxImages: 20,
      fadeOutDelay: 100,
      fadeOutInterval: 50,
      imageWidth: 200,
      imageHeight: 280,
      maxRotation: 30
    },
    trailImages: [],
    imageIndex: 0,
    lastX: 0,
    lastY: 0,
    moveTimeout: null,
    fadeInterval: null,
    wrapper: null,
    svg: null,
    imageGroup: null,

    init() {
      // Disable ImageTrail on mobile devices (screen width < 768px)
      if (window.innerWidth < 768) return;
      
      // Preload images
      this.images.forEach(src => {
        const img = new Image();
        img.src = src;
      });

      this.wrapper = Utils.$(this.config.wrapperSelector);
      this.svg = Utils.$(this.config.svgSelector);
      this.imageGroup = document.getElementById(this.config.imageGroupId);

      if (!this.wrapper || !this.svg || !this.imageGroup) {
        return;
      }

      this.trailImages = [];
      this.imageIndex = 0;
      this.lastX = 0;
      this.lastY = 0;

      Utils.addEvent(this.wrapper, 'mousemove', this.handleMouseMove.bind(this));
      Utils.addEvent(this.wrapper, 'mouseleave', this.handleMouseLeave.bind(this));

      console.log('✓ NESH Image Trail initialized');
    },

    getSVGCoords(e) {
      const rect = this.svg.getBoundingClientRect();
      const vb = this.svg.viewBox.baseVal;
      return {
        x: (e.clientX - rect.left) / rect.width * vb.width,
        y: (e.clientY - rect.top) / rect.height * vb.height
      };
    },

    addImage(x, y) {
      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', this.images[this.imageIndex++ % this.images.length]);
      img.setAttribute('x', x - this.config.imageWidth / 2);
      img.setAttribute('y', y - this.config.imageHeight / 2);
      img.setAttribute('width', this.config.imageWidth);
      img.setAttribute('height', this.config.imageHeight);
      img.setAttribute('preserveAspectRatio', 'xMidYMid slice');

      const rot = (Math.random() - 0.5) * this.config.maxRotation;
      img.setAttribute('transform', `rotate(${rot} ${x} ${y})`);

      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-out';

      this.imageGroup.appendChild(img);

      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });

      this.trailImages.push(img);

      if (this.trailImages.length > this.config.maxImages) {
        const old = this.trailImages.shift();
        old.style.opacity = '0';
        setTimeout(() => old.remove(), 300);
      }
    },

    startFadeOut() {
      if (this.fadeInterval) return;

      this.fadeInterval = setInterval(() => {
        if (this.trailImages.length === 0) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          return;
        }

        // FIFO: First in, first out - remove from beginning
        const img = this.trailImages.shift();
        img.style.opacity = '0';
        setTimeout(() => img.remove(), 300);
      }, this.config.fadeOutInterval);
    },

    stopFadeOut() {
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    },

    handleMouseMove(e) {
      const pos = this.getSVGCoords(e);
      this.stopFadeOut();

      const dist = Math.hypot(pos.x - this.lastX, pos.y - this.lastY);
      if (dist > this.config.minDistance) {
        this.addImage(pos.x, pos.y);
        this.lastX = pos.x;
        this.lastY = pos.y;
      }

      clearTimeout(this.moveTimeout);
      this.moveTimeout = setTimeout(() => this.startFadeOut(), this.config.fadeOutDelay);
    },

    handleMouseLeave() {
      clearTimeout(this.moveTimeout);
      this.startFadeOut();
    },

    destroy() {
      clearTimeout(this.moveTimeout);
      this.stopFadeOut();

      this.trailImages.forEach(img => img.remove());
      this.trailImages = [];
      this.imageIndex = 0;
    }
  };

  // ==========================================================================
  // BUTTON HOVER ANIMATION
  // ==========================================================================
  const ButtonHover = {
    init() {
      // Disable on mobile devices (screen width < 768px)
      if (window.innerWidth < 768) return;

      document.querySelectorAll('[data-button-hover]').forEach(el => {
        const isLink = el.tagName === 'A' && !el.querySelector('p');

        let originalTarget, cloneTarget, mask;

        if (isLink) {
          // Check if already wrapped by Preloader (hero-navigation-link)
          const preloaderInner = el.querySelector('.nav-link-mask-inner');

          if (preloaderInner) {
            // Already wrapped by Preloader — use inner as mask
            el.classList.add('is-text-link');
            mask = preloaderInner;

            const originalSpan = document.createElement('span');
            originalSpan.innerHTML = preloaderInner.innerHTML;

            const cloneSpan = document.createElement('span');
            cloneSpan.innerHTML = preloaderInner.innerHTML;
            cloneSpan.classList.add('clone-text');

            preloaderInner.innerHTML = '';
            preloaderInner.appendChild(originalSpan);
            preloaderInner.appendChild(cloneSpan);

            originalTarget = originalSpan;
            cloneTarget = cloneSpan;
          } else {
            // Text link — use the element itself as mask
            el.classList.add('is-text-link');

            // Wrap existing text in a span
            const originalSpan = document.createElement('span');
            originalSpan.innerHTML = el.innerHTML;

            const cloneSpan = document.createElement('span');
            cloneSpan.innerHTML = el.innerHTML;
            cloneSpan.classList.add('clone-text');

            el.innerHTML = '';
            el.appendChild(originalSpan);
            el.appendChild(cloneSpan);

            originalTarget = originalSpan;
            cloneTarget = cloneSpan;
            mask = el;
          }
        } else {
          // Button with p — wrap p in mask div
          const originalP = el.querySelector('p');
          if (!originalP) return;

          mask = document.createElement('div');
          mask.classList.add('nav-button-mask');

          originalP.parentNode.insertBefore(mask, originalP);
          mask.appendChild(originalP);

          const cloneP = originalP.cloneNode(true);
          cloneP.classList.add('clone-p');
          // Reset any hidden styles inherited from CTA animation
          gsap.set(cloneP, { opacity: 1, filter: 'none', clearProps: 'opacity,filter' });
          mask.appendChild(cloneP);

          originalTarget = originalP;
          cloneTarget = cloneP;
        }

        const splitA = new SplitText(originalTarget, { type: 'words', wordsClass: 'word' });
        const splitB = new SplitText(cloneTarget, { type: 'words', wordsClass: 'word' });

        const h = originalTarget.offsetHeight;

        gsap.set(splitB.words, { y: h });

        let showingA = true;
        let tl = null;

        el.addEventListener('mouseenter', () => {
          if (tl) tl.kill();
          tl = gsap.timeline();

          if (showingA) {
            tl.to(splitA.words, {
              y: -h, duration: 0.5, stagger: 0.05, ease: 'power2.out'
            });
            tl.fromTo(splitB.words,
              { y: h },
              { y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
              '<'
            );
          } else {
            tl.to(splitB.words, {
              y: -h, duration: 0.5, stagger: 0.05, ease: 'power2.out'
            });
            tl.fromTo(splitA.words,
              { y: h },
              { y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' },
              '<'
            );
          }

          showingA = !showingA;
        });
      });
    }
  };

  // ==========================================================================
  // CLIPBOARD FUNCTIONALITY
  // ==========================================================================
  const Clipboard = {
    init() {
      // Bind the hover + click-to-copy logic to the whole .nav-email-item
      // (the .clipboard-wrap lives inside it), so hovering/clicking anywhere
      // in the item triggers the tooltip + copy.
      Utils.$$('.nav-email-item').forEach(parentContainer => {
        const clipboardItem = parentContainer.querySelector('.clipboard-item');
        const clipboardText = clipboardItem?.querySelector('p');
        const clipboardIcon = clipboardItem?.querySelector('.clipboard-icon');
        const emailText = parentContainer.querySelector('.email-text');
  
        if (!clipboardItem || !clipboardText || !emailText) return;
  
        let isClicked = false;
  
        gsap.set(clipboardItem, { opacity: 0, y: 10 });
        if (clipboardIcon) gsap.set(clipboardIcon, { display: 'none' });
  
        const enterHandler = () => {
          gsap.to(clipboardItem, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        };
  
        const leaveHandler = () => {
          gsap.to(clipboardItem, {
            opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
            onComplete: () => {
              clipboardText.textContent = 'Copy to clipboard';
              if (clipboardIcon) gsap.set(clipboardIcon, { display: 'none' });
              gsap.set(clipboardItem, { backgroundColor: '#EBEADA' });
              isClicked = false;
            }
          });
        };
  
        const clickHandler = async () => {
          if (isClicked) return;
  
          try {
            await navigator.clipboard.writeText(emailText.textContent.trim());
            isClicked = true;
            clipboardText.textContent = 'Email Copied';
  
            if (clipboardIcon) {
              gsap.set(clipboardIcon, { display: 'block' });
              gsap.fromTo(clipboardIcon, 
                { opacity: 0, scale: 0.8 }, 
                { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
              );
            }
  
            gsap.to(clipboardItem, { backgroundColor: '#FFFF23', duration: 0.3, ease: 'power2.out' });
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
        };
  
        Utils.addEvent(parentContainer, 'mouseenter', enterHandler);
        Utils.addEvent(parentContainer, 'mouseleave', leaveHandler);
        Utils.addEvent(parentContainer, 'click', clickHandler);
      });
    }
  };
  
// ==========================================================================
// RESIZE HANDLER (FIXED FOR MOBILE)
// ==========================================================================
const ResizeHandler = {
  handler: null,
  lastWidth: window.innerWidth,

  init() {
    this.lastWidth = window.innerWidth;
    
    this.handler = Utils.debounce(() => {
      const newWidth = window.innerWidth;
      const isMobile = newWidth < 768;
      
      // On mobile, only respond to WIDTH changes (orientation change)
      // Ignore height-only changes (browser chrome hiding/showing)
      if (isMobile && newWidth === this.lastWidth) {
        return; // Ignore - this is just browser chrome
      }
      
      this.lastWidth = newWidth;

      window.location.reload();
    }, CONFIG.resizeDebounce);

    Utils.addEvent(window, 'resize', this.handler);
  }
};
  // ==========================================================================
  // MAIN INITIALIZATION
  // ==========================================================================
  function destroyAll() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  
    STATE.eventListeners.forEach(({ target, event, handler, options }) => {
      target.removeEventListener(event, handler, options);
    });
    STATE.eventListeners = [];
  
    GhostEngine.destroy();
    StyleEngine.destroy();
    HorizontalScroll.destroy();
    MagneticPositions.destroy();
    Preloader.destroy();
    SwiperInit.destroy();
    LenisInit.destroy();
    ImageTrail.destroy();
    MobileMenu.destroy();
  
    STATE.initialized = false;
  }
  
  function initAll() {
    if (STATE.initialized) {
      console.warn('Animation engine already initialized. Call destroyAll() first.');
      return;
    }
  
    gsap.registerPlugin(ScrollTrigger);
  
    Sidebar.init();
    GhostEngine.init();
    StyleEngine.init();
    HorizontalScroll.init();
    ThemeSwitcher.init();
    MobileMenu.init();
  
    CardInteractions.init();
    ProfileImage.init();
    CTAAnimation.init();
    Clipboard.init();
    ImageTrail.init();
    ButtonHover.init();
  
    SwiperInit.init();
    LenisInit.init();
    if (STATE.lenis && window.innerWidth >= 768) {
      STATE.lenis.stop();
      setTimeout(() => { if (STATE.lenis) STATE.lenis.start(); }, 3000);
    }

    TextReveal.init();
  
    ResizeHandler.init();
  
    ScrollTrigger.refresh();
  
    STATE.initialized = true;
    
    setTimeout(() => {
      MagneticPositions.init();
    }, CONFIG.magneticInitDelay);
  }
  
  window.AnimationEngine = {
    init: initAll,
    destroy: destroyAll,
    refresh: () => {
      Sidebar.scale();
      ScrollTrigger.refresh();
    },
    rebuildGhosts: () => GhostEngine.rebuild(),
    rebuildMagnetic: () => MagneticPositions.rebuild(),
    recalculateHorizontalScroll: () => HorizontalScroll.recalculate(),
    debug: {
      magneticPairs: () => STATE.magneticPairs,
      state: () => STATE
    }
  };
  
  function boot() {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        Preloader.init();
        initAll();
      });
    });
  }

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot);
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(boot, 50);
    });
  }

  // Handle Safari bfcache — page restored from back/forward navigation
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
  });

})();