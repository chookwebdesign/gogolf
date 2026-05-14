(function () {
  'use strict';

  /* ---- Nav scroll shadow ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', e => {
      if (
        mobileMenu.classList.contains('open') &&
        !nav.contains(e.target) &&
        !mobileMenu.contains(e.target)
      ) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Active nav link ---- */
  const path = window.location.pathname;
  const pageMap = {
    'index.html': ['/', '/index.html', ''],
    'about.html': ['/about.html', '/about'],
    'programmes.html': ['/programmes.html', '/programmes'],
    'contact.html': ['/contact.html', '/contact'],
  };

  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const matches = pageMap[href] || [];
    const active = matches.some(m => path.endsWith(m)) ||
      (href === 'index.html' && (path === '/' || path === ''));
    if (active) link.classList.add('active');
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-question').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  /* ---- Intersection observer for animations ---- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .stagger').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.fade-up, .stagger').forEach(el => el.classList.add('visible'));
  }

  /* ---- Contact form (Formspree async) ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = document.querySelector('.form-success');
      const orig = btn.textContent;

      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });

        if (!res.ok) throw new Error();

        form.reset();
        btn.textContent = 'Message sent!';
        if (success) success.style.display = 'block';

        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
          if (success) success.style.display = 'none';
        }, 6000);
      } catch {
        btn.textContent = 'Error — please try again';
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
        }, 3500);
      }
    });
  }

  /* ---- Testimonial carousel ---- */
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (track && prevBtn && nextBtn) {
    let current = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    const slide = () => {
      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
    };
    prevBtn.addEventListener('click', () => { current = (current - 1 + total) % total; slide(); });
    nextBtn.addEventListener('click', () => { current = (current + 1) % total; slide(); });
    window.addEventListener('resize', slide);
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth',
        });
      }
    });
  });
})();
