/**
 * Unsaid Games — Guessing Board Landing Page
 * Interactive behaviors: smooth scroll, nav, scroll animations
 */

(function () {
  'use strict';

  // --- Mobile Nav Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
      });
    });
  }

  // --- Scroll-Aware Navigation ---
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Add scrolled state
    if (scrollY > 10) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    // Hide/show nav on scroll direction
    if (scrollY > 200) {
      if (scrollY > lastScrollY + 5) {
        nav.classList.add('nav--hidden');
      } else if (scrollY < lastScrollY - 5) {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll Animations (Intersection Observer) ---
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --- Parallax-style subtle effect on floating elements ---
  let mouseX = 0;
  let mouseY = 0;
  let rafId = null;

  const floatEls = document.querySelectorAll('.float-emoji-1, .float-emoji-2, .float-emoji-3');

  function handleMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!rafId) {
      rafId = requestAnimationFrame(function () {
        floatEls.forEach(function (el, i) {
          const factor = (i + 1) * 5;
          el.style.transform = 'translate(' + (mouseX * factor) + 'px, ' + (mouseY * factor) + 'px)';
        });
        rafId = null;
      });
    }
  }

  // Only add parallax on desktop
  if (window.matchMedia('(min-width: 960px)').matches) {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
  }
})();
