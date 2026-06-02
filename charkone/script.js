/* ════════════════════════════════════════════
   CHARKONE RESTOCAFE — script.js
   Interactions: Nav, Hero Parallax, Particles,
   Duality, Slider, Menu Filter, Scroll Reveal
   ════════════════════════════════════════════ */

'use strict';

// ──────────────── NAV ────────────────
const nav = document.getElementById('main-nav');
const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.getElementById('nav-links');

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Scrolled style
  if (y > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScroll = y;
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ──────────────── PARTICLES ────────────────
(function spawnParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.setProperty('--dur', (3 + Math.random() * 5) + 's');
    p.style.setProperty('--delay', (Math.random() * 6) + 's');
    p.style.left = (Math.random() * 100) + '%';
    p.style.top = (40 + Math.random() * 55) + '%';
    p.style.width = (2 + Math.random() * 3) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
})();

// ──────────────── HERO PARALLAX ────────────────
const heroBg = document.getElementById('hero-bg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `scale(1.06) translateY(${y * 0.18}px)`;
  }
}, { passive: true });

// ──────────────── SCROLL REVEAL ────────────────
const revealTargets = document.querySelectorAll(
  '.duality-header, .duality-col, .seating-header, .vibe-card, ' +
  '.menu-header, .menu-category, .instagram-header, .instagram-embed-wrap, ' +
  '.footer-left, .footer-map'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

// ──────────────── MENU FILTER ────────────────
const filterBtns = document.querySelectorAll('.filter-tab');
const menuCategories = document.querySelectorAll('.menu-category');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active tab
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Show / hide categories
    menuCategories.forEach(cat => {
      const catType = cat.dataset.category;
      if (filter === 'all' || catType === filter) {
        cat.classList.remove('hidden');
        cat.style.opacity = '0';
        cat.style.transform = 'translateY(16px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            cat.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
          }, 50);
        });
      } else {
        cat.classList.add('hidden');
      }
    });
  });
});

// ──────────────── VIBE SLIDER DOTS ────────────────
const sliderTrack = document.getElementById('vibe-slider');
const dots = document.querySelectorAll('.dot');

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const slideIndex = parseInt(dot.dataset.slide);
    const cards = sliderTrack.querySelectorAll('.vibe-card');
    const card = cards[slideIndex];

    if (card) {
      sliderTrack.scrollTo({
        left: card.offsetLeft - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--section-px') || 24),
        behavior: 'smooth'
      });
    }

    dots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
  });
});

// Update dots on scroll
let dotScrollTimer;
sliderTrack.addEventListener('scroll', () => {
  clearTimeout(dotScrollTimer);
  dotScrollTimer = setTimeout(() => {
    const cards = sliderTrack.querySelectorAll('.vibe-card');
    let closestIndex = 0;
    let minDist = Infinity;

    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - sliderTrack.getBoundingClientRect().left);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    dots.forEach(d => d.classList.remove('active'));
    if (dots[closestIndex]) dots[closestIndex].classList.add('active');
  }, 80);
}, { passive: true });

// ──────────────── MAGNETIC HERO CTA ────────────────
const heroCta = document.getElementById('hero-reserve-btn');

if (heroCta) {
  heroCta.addEventListener('mousemove', (e) => {
    const rect = heroCta.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    heroCta.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });

  heroCta.addEventListener('mouseleave', () => {
    heroCta.style.transform = 'translate(0, 0)';
    heroCta.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
}

// ──────────────── SMOOTH ANCHOR SCROLL ────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ──────────────── CURSOR GLOW (DESKTOP ONLY) ────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(217,160,91,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s;
    top: -150px; left: -150px;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}


// ──────────────── INSTAGRAM EMBED RELOAD ────────────────
if (window.instgrm) {
  window.instgrm.Embeds.process();
}

window.addEventListener('load', () => {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
});

// ──────────────── BOOKING FORM — OCCASION TAGS ────────────────
(function initBookingTags() {
  const tags = document.querySelectorAll('.bf-tag');
  const hiddenInput = document.getElementById('bf-occasion');
  if (!tags.length || !hiddenInput) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const isActive = tag.classList.contains('active');
      // Deselect all
      tags.forEach(t => t.classList.remove('active'));
      if (!isActive) {
        tag.classList.add('active');
        hiddenInput.value = tag.dataset.value;
      } else {
        hiddenInput.value = '';
      }
    });
  });
})();

// ──────────────── BOOKING FORM — WHATSAPP SUBMIT ────────────────
(function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('bf-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('bf-name')?.value.trim();
    const phone   = document.getElementById('bf-phone')?.value.trim();
    const date    = document.getElementById('bf-date')?.value;
    const time    = document.getElementById('bf-time')?.value;
    const guests  = document.getElementById('bf-guests')?.value;
    const zone    = document.getElementById('bf-zone')?.value;
    const occasion = document.getElementById('bf-occasion')?.value;

    if (!name || !phone || !date || !time || !guests || !zone) {
      // Shake unfilled fields
      [
        { id: 'bf-name', val: name },
        { id: 'bf-phone', val: phone },
        { id: 'bf-date', val: date },
        { id: 'bf-time', val: time },
        { id: 'bf-guests', val: guests },
        { id: 'bf-zone', val: zone }
      ].forEach(({ id, val }) => {
        if (!val) {
          const el = document.getElementById(id);
          if (el) {
            el.style.borderColor = '#ff4d4d';
            el.style.boxShadow = '0 0 0 3px rgba(255,77,77,0.2)';
            setTimeout(() => {
              el.style.borderColor = '';
              el.style.boxShadow = '';
            }, 2500);
          }
        }
      });
      return;
    }

    // Format date nicely
    const dateObj = new Date(date + 'T00:00:00');
    const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    const niceDate = dateObj.toLocaleDateString('en-IN', options);

    const msg = [
      `*🍽️ CharKone RestoCafe — Table Reservation*`,
      ``,
      `👤 *Name:* ${name}`,
      `📞 *Phone:* ${phone}`,
      `📅 *Date:* ${niceDate}`,
      `🕐 *Time:* ${time}`,
      `👥 *Guests:* ${guests}`,
      `🌌 *Zone:* ${zone}`,
      occasion ? `🎉 *Occasion:* ${occasion}` : null,
      ``,
      `_Please confirm my reservation. Thank you!_ 🙏`
    ].filter(Boolean).join('\n');

    const waNumber = '918902727154';
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Reset form after a brief delay so fields are clean when the user returns
    setTimeout(() => {
      form.reset();
      const tags = document.querySelectorAll('.bf-tag');
      tags.forEach(t => t.classList.remove('active'));
      const hiddenInput = document.getElementById('bf-occasion');
      if (hiddenInput) hiddenInput.value = '';
    }, 1000);
  });
})();

// ──────────────── CHARKONE REVIEWS CAROUSEL ────────────────
(function initCharKoneReviews() {
  const track = document.getElementById('charkone-reviews-track');
  const prevBtn = document.getElementById('ck-reviewPrev');
  const nextBtn = document.getElementById('ck-reviewNext');
  const dotsContainer = document.getElementById('ck-reviewDots');
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
    const gapVal = parseFloat(style.gap) || 24;
    return cards[0].getBoundingClientRect().width + gapVal;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    track.style.transform = `translateX(-${getCardWidth() * current}px)`;
    dotsContainer.querySelectorAll('.review-dot').forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    cards.forEach((card, i) => card.setAttribute('aria-hidden', String(i !== current)));
    resetAutoplay();
  }

  function next() { goTo(current < cards.length - 1 ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : cards.length - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }, { passive: true });

  // Autoplay
  function startAutoplay() { autoplayTimer = setInterval(next, 5000); }
  function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }
  startAutoplay();

  // Pause on hover
  const section = track.closest('.reviews-section');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    section.addEventListener('mouseleave', startAutoplay);
  }

  // Re-position on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(current), 200);
  });
})();

// ──────────────── UPDATE SCROLL REVEAL TARGETS ────────────────
(function updateRevealTargets() {
  const newTargets = [
    '.booking-header', '.booking-form',
    '.reviews-header', '.reviews-track-wrapper', '.reviews-nav', '.reviews-cta',
    '.reel-frame-col', '.reel-content-col'
  ];
  newTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        revealObserver.observe(el);
      }
    });
  });
})();

