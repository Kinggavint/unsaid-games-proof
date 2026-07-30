/**
 * Unsaid Games — You Word Never Guess Landing Page
 * Interactive behaviors: smooth scroll, nav, scroll animations, hero image injection
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

  // Ensure an About link exists in the nav across pages
  if (navLinks) {
    const hasAbout = !!navLinks.querySelector('a[href$="about.html"]');
    if (!hasAbout) {
      const aboutLink = document.createElement('a');
      aboutLink.href = 'about.html';
      aboutLink.textContent = 'About';

      const servicesLink = navLinks.querySelector('a[href="services.html"]');
      const ctaLink = navLinks.querySelector('a.btn');

      if (servicesLink) {
        servicesLink.insertAdjacentElement('beforebegin', aboutLink);
      } else if (ctaLink) {
        navLinks.insertBefore(aboutLink, ctaLink);
      } else {
        navLinks.appendChild(aboutLink);
      }

      if (navToggle) {
        aboutLink.addEventListener('click', function () {
          navToggle.classList.remove('is-open');
          navLinks.classList.remove('is-open');
        });
      }
    }
  }

  // Ensure a Testimonials link exists in the nav across pages
  if (navLinks) {
    const hasTestimonials = !!navLinks.querySelector('a[href$="testimonials.html"]');
    if (!hasTestimonials) {
      const testimonialsLink = document.createElement('a');
      testimonialsLink.href = 'testimonials.html';
      testimonialsLink.textContent = 'Testimonials';

      // Insert after Services if present, otherwise before the primary CTA, else at end
      const servicesLink = navLinks.querySelector('a[href="services.html"]');
      const ctaLink = navLinks.querySelector('a.btn');

      if (servicesLink) {
        servicesLink.insertAdjacentElement('afterend', testimonialsLink);
      } else if (ctaLink) {
        navLinks.insertBefore(testimonialsLink, ctaLink);
      } else {
        navLinks.appendChild(testimonialsLink);
      }

      if (navToggle) {
        testimonialsLink.addEventListener('click', function () {
          navToggle.classList.remove('is-open');
          navLinks.classList.remove('is-open');
        });
      }
    }
  }

  // --- Scroll-Aware Navigation ---
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    if (!nav) return;
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

  // --- New: Inject hero images per page and set active nav link ---
  document.addEventListener('DOMContentLoaded', function () {
    // Determine hero image by path
    var path = (window.location.pathname || '').toLowerCase();
    var isServices = path.indexOf('services') !== -1;
    var isAbout = path.indexOf('about') !== -1;
    var isTestimonials = path.indexOf('testimonials') !== -1;

    var blueSrc = '/public/uploads/liwc/a686b0b0-8db5-464f-bfa3-50d00ae18c29/hero-arcade-blue.png';
    var blueAlt = 'Abstract neon blue arcade landscape with a glowing grid and wireframe mountains under a starry sky.';
    var magentaSrc = '/public/uploads/liwc/a686b0b0-8db5-464f-bfa3-50d00ae18c29/hero-arcade-magenta.png';
    var magentaAlt = 'Abstract neon magenta arcade scene with a glowing grid and purple sky filled with stars.';

    var heroSrc = blueSrc;
    var heroAlt = blueAlt;

    if (isServices || isTestimonials) {
      heroSrc = magentaSrc;
      heroAlt = magentaAlt;
    } else if (isAbout) {
      heroSrc = blueSrc;
      heroAlt = blueAlt;
    }

    // Find hero containers and inject image
    var heroContainers = document.querySelectorAll('.hero, .services-hero, .page-hero');
    heroContainers.forEach(function (section) {
      if (!section.querySelector('.hero-bg-image')) {
        var img = document.createElement('img');
        img.className = 'hero-bg-image';
        img.src = heroSrc;
        img.alt = heroAlt;
        img.decoding = 'async';
        img.loading = 'eager';
        section.insertBefore(img, section.firstChild);
      }
    });

    // Set active link in nav
    if (navLinks) {
      var current = window.location.pathname.split('/').pop() || 'index.html';
      var links = navLinks.querySelectorAll('a[href]');
      links.forEach(function (a) {
        var href = a.getAttribute('href');
        // simple normalize
        var file = (href || '').split('/').pop();
        if (!file) return;

        if ((current === 'index.html' && (file === 'index.html' || file === './' || file === '/')) ||
            current === file) {
          a.classList.add('active');
        }
      });
    }
  });
})();