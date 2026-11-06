/**
 * AXISBRIDGE — CORE SCRIPT & INTERACTION CONTROLLER
 * Full-stack frontend controller: header scroll, navigation, mobile drawer,
 * scroll reveals, hero pattern sizing, and validated WhatsApp qualification dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveals();
  initHeroPatternFit();
  initStatsCounter();
  initContactForm();
  initInsightsModal();
  initExpandableGovernance();
  highlightActiveNav();
});

/**
 * Key Figures Viewport Animation & Hover Elevation
 */
function initStatsCounter() {
  const statItems = document.querySelectorAll('.stats-strip-item');
  if (!statItems.length) return;

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stat-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  statItems.forEach(item => observer.observe(item));
}

/**
 * Header Scroll State Controller
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!toggleBtn || !nav) return;

  const toggle = (force) => {
    const isOpen = typeof force === 'boolean' ? force : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.textContent = isOpen ? 'Close' : 'Menu';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', () => toggle());

  // Close when clicking nav links
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggle(false);
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggle(false);
    }
  });
}

/**
 * Active Navigation Highlight based on URL
 */
function highlightActiveNav() {
  const navLinks = document.querySelectorAll('.primary-nav a');
  if (!navLinks.length) return;

  const path = window.location.pathname.toLowerCase();
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkFile = href.split('#')[0].toLowerCase();
    if (linkFile === filename || (filename === '' && linkFile === 'index.html') || (filename === 'index.html' && linkFile === '')) {
      link.classList.add('active');
    } else if (filename.includes('about') && linkFile.includes('about')) {
      link.classList.add('active');
    } else if (filename.includes('what-we-do') && linkFile.includes('what-we-do')) {
      link.classList.add('active');
    } else if (filename.includes('markets') && linkFile.includes('markets')) {
      link.classList.add('active');
    } else if (filename.includes('opportunities') && linkFile.includes('opportunities')) {
      link.classList.add('active');
    } else if (filename.includes('partnerships') && linkFile.includes('partnerships')) {
      link.classList.add('active');
    } else if (filename.includes('insights') && linkFile.includes('insights')) {
      link.classList.add('active');
    } else if (filename.includes('contact') && linkFile.includes('contact')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Scroll Triggered Reveals
 */
function initScrollReveals() {
  // Select all .reveal elements plus card and panel components across all pages
  const selector = '.reveal, .market-card, .pillar-interactive-panel, .insight-card-interactive, .vetting-card-item, .opportunities-grid > div';
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/**
 * Hero Pattern Fitting and Dynamic Geometric Scaling
 * Preserves the core logo pattern containing the architectural bridge photo.
 * Removed extraneous drift strokes as directed by official brand guidelines.
 */
function initHeroPatternFit() {
  const stage = document.getElementById('heroStage');
  if (!stage) return;

  const resize = () => {
    const width = stage.parentElement ? stage.parentElement.offsetWidth : window.innerWidth;
    const height = stage.parentElement ? stage.parentElement.offsetHeight : window.innerHeight * 0.84;
    const isMobile = width < 860;

    stage.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const r1 = document.getElementById('bgRect');
    const r2 = document.getElementById('maskRect');
    const r3 = document.getElementById('fillOverlay');
    if (r1) { r1.setAttribute('width', width); r1.setAttribute('height', height); }
    if (r2) { r2.setAttribute('width', width); r2.setAttribute('height', height); }
    if (r3) { r3.setAttribute('width', width); r3.setAttribute('height', height); }

    // Proportional mark scaling strictly contained inside right boundary, preventing text overlap
    let markWidth, markX, markY;
    if (isMobile) {
      markWidth = Math.min(width * 0.84, 380);
      markX = (width - markWidth) / 2;
      markY = Math.max(16, height * 0.06);
    } else {
      markWidth = Math.min(width * 0.44, height * 0.82, 560);
      markX = width - markWidth - Math.max(36, width * 0.04);
      markY = Math.max(24, (height - markWidth * (90 / 176)) / 2);
    }

    const transformStr = (w) => {
      const scale = w / 176;
      return `translate(${markX} ${markY}) scale(${scale}) translate(-847 -732)`;
    };

    const gMask = document.getElementById('gMask');
    const gOutline = document.getElementById('gMarkOutline');
    if (gMask) gMask.setAttribute('transform', transformStr(markWidth));
    if (gOutline) gOutline.setAttribute('transform', transformStr(markWidth));
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
}

/**
 * Interactive Insights Modal System
 * Enables in-depth reading dialog with responsive controls, keyboard Escape, and backdrop close.
 */
function initInsightsModal() {
  const modalOverlay = document.getElementById('insightModal');
  if (!modalOverlay) return;

  const modalImg = modalOverlay.querySelector('.axis-modal-header-img');
  const modalCategory = modalOverlay.querySelector('.modal-category');
  const modalDate = modalOverlay.querySelector('.modal-date');
  const modalTitle = modalOverlay.querySelector('.modal-title');
  const modalText = modalOverlay.querySelector('.modal-text');
  const closeBtn = modalOverlay.querySelector('.axis-modal-close');

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openModal = (data) => {
    if (modalImg && data.img) modalImg.src = data.img;
    if (modalCategory) modalCategory.textContent = data.category || 'Executive Intelligence';
    if (modalDate) modalDate.textContent = data.date || 'Current Analysis';
    if (modalTitle) modalTitle.textContent = data.title || 'Market Analysis Brief';
    if (modalText && data.body) {
      modalText.innerHTML = data.body;
    }
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  // Attach to interactive cards
  const interactiveCards = document.querySelectorAll('.insight-card-interactive, [data-modal-target]');
  interactiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked directly on an external anchor that isn't modal
      if (e.target.closest('a') && !e.target.closest('.open-modal-trigger') && !card.classList.contains('insight-card-interactive')) return;
      e.preventDefault();

      const title = card.getAttribute('data-title') || card.querySelector('h3, h2, .insight-title')?.textContent || '';
      const category = card.getAttribute('data-category') || card.querySelector('.insight-category, .kicker, .badge')?.textContent || '';
      const date = card.getAttribute('data-date') || card.querySelector('.insight-date, .meta-date')?.textContent || '';
      const img = card.getAttribute('data-img') || card.querySelector('img')?.getAttribute('src') || 'assets/images/boardroom.jpg';
      const bodySource = card.querySelector('.insight-full-content');
      const body = bodySource ? bodySource.innerHTML : `<p>${card.querySelector('p')?.textContent || ''}</p>`;

      openModal({ title, category, date, img, body });
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Interactive Contact & Qualification Dispatcher
 */
function initContactForm() {
  const form = document.getElementById('axisContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('formName')?.value || '').trim();
    const org = (document.getElementById('formOrg')?.value || '').trim();
    const pillar = document.getElementById('formPillar')?.value || 'General Inquiry';
    const desk = document.getElementById('formDesk')?.value || '+201154524401';
    const message = (document.getElementById('formMessage')?.value || '').trim();
    const feedback = document.getElementById('formFeedback');

    if (!name || !message) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please provide your name and message to continue.';
      }
      return;
    }

    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Connecting to Axis Bridge WhatsApp desk...';
    }

    // Format structured business qualification memo
    const memo = `*Axis Bridge Business Inquiry*\n\n` +
      `• *Name:* ${name}\n` +
      `• *Organisation:* ${org || 'N/A'}\n` +
      `• *Pillar / Interest:* ${pillar}\n` +
      `• *Message:* ${message}\n\n` +
      `_Submitted via Axis Bridge Official Portal_`;

    const cleanDesk = desk.replace(/[^\d]/g, '');
    const waUrl = `https://wa.me/${cleanDesk}?text=${encodeURIComponent(memo)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (feedback) {
        feedback.textContent = 'Inquiry dispatched to WhatsApp desk. Our corridor team will review and respond promptly.';
      }
    }, 450);
  });
}


/**
 * Expandable Interactive Governance Framework
 * Supports click/tap toggle for mobile and touch devices
 */
function initExpandableGovernance() {
  const govItems = document.querySelectorAll('.gov-expand-item');
  if (!govItems.length) return;

  govItems.forEach(item => {
    item.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');
      govItems.forEach(i => i.classList.remove('active'));
      if (!isAlreadyActive) {
        item.classList.add('active');
      }
    });
  });
}
