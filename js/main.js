/**
 * Pedro Duarte Portfolio — Main JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initMobileMenu();
  initFaqAccordion();
  initScrollAnimations();
  initNavActiveState();
  initCtaTracking();
  initLanguageSelector();
  initI18n();
  initHeroParticles();
  initNavbarScroll();
});

/* ═══════════════════════════════════════ */
/* NAVBAR SCROLL (slide-in + blur on scroll) */
/* ═══════════════════════════════════════ */

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let isScrolled = false;
  const update = () => {
    const threshold = window.innerHeight * 0.9;
    const shouldScroll = window.scrollY > threshold;
    if (shouldScroll !== isScrolled) {
      isScrolled = shouldScroll;
      navbar.classList.toggle('is-scrolled', shouldScroll);
    }
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ═══════════════════════════════════════ */
/* HERO PARTICLES (interactive canvas)     */
/* ═══════════════════════════════════════ */

function initHeroParticles() {
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('heroParticles');
  if (!hero || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  const particles = [];
  const repelRadius = 120;
  const repelRadiusSq = repelRadius * repelRadius;
  let mouseX = -1000;
  let mouseY = -1000;
  let rafId = null;
  let isVisible = true;
  let isMobile = window.innerWidth < 768;

  function targetCount() {
    const area = window.innerWidth * window.innerHeight;
    const cap = isMobile ? 30 : 80;
    const divisor = isMobile ? 20000 : 12000;
    return Math.min(cap, Math.floor(area / divisor));
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.3 + 0.05,
    };
  }

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    isMobile = window.innerWidth < 768;
    const target = targetCount();
    while (particles.length < target) particles.push(createParticle());
    particles.length = target;
  }

  function render() {
    if (!isVisible) { rafId = null; return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distSq = dx * dx + dy * dy;
      if (distSq < repelRadiusSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (repelRadius - dist) / repelRadius;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + p.alpha + ')';
      ctx.fill();
    }
    rafId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  canvas.style.pointerEvents = 'none';

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  const io = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && rafId === null) rafId = requestAnimationFrame(render);
  }, { threshold: 0 });
  io.observe(hero);

  rafId = requestAnimationFrame(render);
}

/* ═══════════════════════════════════════ */
/* LANGUAGE SELECTOR                       */
/* ═══════════════════════════════════════ */

function initLanguageSelector() {
  const trigger = document.getElementById('lang-trigger');
  const dropdown = document.getElementById('lang-dropdown');

  if (!trigger || !dropdown) return;

  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  // Language buttons
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      dropdown.classList.add('hidden');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

/* ═══════════════════════════════════════ */
/* MOBILE MENU                            */
/* ═══════════════════════════════════════ */

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const close = document.getElementById('menu-close');
  const menu = document.getElementById('mobile-menu');
  const links = menu.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    menu.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });

  close.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  menu.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ═══════════════════════════════════════ */
/* FAQ ACCORDION                          */
/* ═══════════════════════════════════════ */

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';

      // Close all items
      items.forEach(other => {
        other.dataset.open = 'false';
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.style.maxHeight = '0';
        setTimeout(() => {
          if (other.dataset.open !== 'true') {
            otherAnswer.classList.add('hidden');
          }
        }, 350);
      });

      // Toggle clicked item
      if (!isOpen) {
        item.dataset.open = 'true';
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.remove('hidden');
        // Force reflow
        answer.offsetHeight;
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ═══════════════════════════════════════ */
/* SCROLL ANIMATIONS (IntersectionObserver) */
/* ═══════════════════════════════════════ */

function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════ */
/* GA / GTM CTA TRACKING                  */
/* ═══════════════════════════════════════ */

function initCtaTracking() {
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-cta]');
    if (!cta) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      cta_location: cta.dataset.cta,
      cta_text: cta.textContent.trim(),
      cta_href: cta.getAttribute('href') || '',
    });
  });
}

/* ═══════════════════════════════════════ */
/* ACTIVE NAV STATE ON SCROLL             */
/* ═══════════════════════════════════════ */

function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('nav-link--active', 'text-white');
            link.classList.remove('text-gray-400');
          } else {
            link.classList.remove('nav-link--active', 'text-white');
            link.classList.add('text-gray-400');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-72px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}
