/* ==============================================
   THE FOREST BREW — JavaScript
   ================================================ */

'use strict';

// ── Utility: debounce ──
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ── Navbar scroll behavior ──
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = debounce(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, 10);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── Mobile Nav Toggle ──
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.contains(e.target) && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

// ── Sticky Badge hide on scroll down, show on scroll up ──
(function initBadge() {
  const badge = document.getElementById('stickyBadge');
  if (!badge) return;
  let lastY = 0;
  const onScroll = debounce(() => {
    const y = window.scrollY;
    if (y > lastY && y > 200) {
      badge.style.transform = 'translateX(calc(100% + 30px))';
      badge.style.opacity = '0';
    } else {
      badge.style.transform = 'translateX(0)';
      badge.style.opacity = '1';
    }
    lastY = y;
  }, 30);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── Back to Top Button ──
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const onScroll = debounce(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Menu Slider Carousel ──
(function initMenuSlider() {
  const track = document.getElementById('menuSliderTrack');
  const prevBtn = document.getElementById('menuSliderPrev');
  const nextBtn = document.getElementById('menuSliderNext');
  const dotsContainer = document.getElementById('menuSliderDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.menu-slide');
  let current = 0;

  // Build dots dynamically
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'menu-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to menu page ${i + 1}`);
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getSlideWidth() {
    if (!slides[0]) return 0;
    return slides[0].getBoundingClientRect().width;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, slides.length - 1));
    const offset = getSlideWidth() * current;
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update active dot
    const dots = dotsContainer.querySelectorAll('.menu-dot');
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });

    // Update slides accessibility attributes
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', String(i !== current));
    });
  }

  function next() {
    goTo(current < slides.length - 1 ? current + 1 : 0);
  }

  function prev() {
    goTo(current > 0 ? current - 1 : slides.length - 1);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, { passive: true });

  // Keyboard navigation
  dotsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // Re-position on screen resize
  window.addEventListener('resize', debounce(() => goTo(current), 200));
})();

// ── Reviews Carousel ──
(function initReviews() {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsContainer = document.getElementById('reviewDots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = track.querySelectorAll('.review-card');
  let current = 0;
  let autoplayTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'review-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getCardWidth() {
    if (!cards[0]) return 0;
    const style = window.getComputedStyle(track);
    const gapVal = parseInt(style.getPropertyValue('gap'));
    const gap = isNaN(gapVal) ? 20 : gapVal;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    const offset = getCardWidth() * current;
    track.style.transform = `translateX(-${offset}px)`;
    document.querySelectorAll('.review-dot').forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    // Update slide aria
    cards.forEach((card, i) => {
      card.setAttribute('aria-hidden', String(i !== current));
    });
    resetAutoplay();
  }

  function next() { goTo(current < cards.length - 1 ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : cards.length - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }, { passive: true });

  // Keyboard
  dotsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(next, 4500);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // Pause on hover
  const section = track.closest('.reviews-section');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    section.addEventListener('mouseleave', startAutoplay);
  }

  // Re-position on resize
  window.addEventListener('resize', debounce(() => goTo(current), 200));
})();

// ── Add reveal classes to sections dynamically ──
(function addRevealClasses() {
  const selectors = [
    '.about-image-col',
    '.about-text-col',
    '.vibe-card',
    '.social-embed-col',
    '.social-content-col',
    '.menu-section .section-header',
    '.menu-slider-wrapper',
    '.menu-footer',
    '.reviews-section .section-header',
    '.reviews-track-wrapper',
    '.location-detail',
    '.location-map-col',
    '.footer-brand',
    '.footer-links-col',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i > 0 && i <= 3) el.classList.add(`reveal-delay-${i}`);
    });
  });
})();

// ── Scroll Reveal (IntersectionObserver) ──
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    els.forEach(el => el.classList.add('in-view'));
  }
})();

// ── Hero Parallax (subtle) ──
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg-overlay');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
})();

// ── Active nav link on scroll ──
(function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.style.color = isActive ? 'var(--color-cream)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

// ── Touch support for Vibe Cards ──
(function initVibeCardTouch() {
  const cards = document.querySelectorAll('.vibe-card');
  cards.forEach(card => {
    card.addEventListener('touchstart', function() {
      cards.forEach(c => {
        if (c !== card) c.classList.remove('touched');
      });
      card.classList.toggle('touched');
    }, { passive: true });
  });

  document.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.vibe-card')) {
      cards.forEach(c => c.classList.remove('touched'));
    }
  }, { passive: true });
})();
