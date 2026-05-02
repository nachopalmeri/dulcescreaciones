/* Dulces Creaciones - Main Scripts */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Hero Carousel
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
let currentSlide = 0;

function showSlide(index) {
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  showSlide(currentSlide);
}

if (heroSlides.length > 0) {
  // Auto-advance every 5 seconds
  setInterval(nextSlide, 5000);

  // Dot click navigation
  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Marquee duplicate for seamless loop
const marqueeInner = document.querySelector('.marquee-inner');
if (marqueeInner) {
  marqueeInner.innerHTML += marqueeInner.innerHTML;
}

// FAQ accordion
const faqQuestions = Array.from(document.querySelectorAll('.faq-question'));

function closeFaqItem(question) {
  const answer = question.nextElementSibling;
  question.classList.remove('active');
  question.setAttribute('aria-expanded', 'false');
  if (answer) {
    answer.classList.remove('open');
    answer.style.maxHeight = '0px';
  }
}

function openFaqItem(question) {
  const answer = question.nextElementSibling;
  if (!answer) return;
  question.classList.add('active');
  question.setAttribute('aria-expanded', 'true');
  answer.classList.add('open');
  answer.style.maxHeight = `${answer.scrollHeight}px`;
}

if (faqQuestions.length > 0) {
  faqQuestions.forEach((question, index) => {
    const answer = question.nextElementSibling;
    const answerId = `faq-answer-${index + 1}`;

    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-expanded', 'false');

    if (answer) {
      answer.id = answerId;
      question.setAttribute('aria-controls', answerId);
    }
  });

  const toggleFaq = (question) => {
    const isOpen = question.classList.contains('active');

    faqQuestions.forEach((item) => closeFaqItem(item));

    if (!isOpen) {
      openFaqItem(question);
    }
  };

  document.addEventListener('click', (event) => {
    const question = event.target.closest('.faq-question');
    if (!question) return;
    toggleFaq(question);
  });

  document.addEventListener('keydown', (event) => {
    const question = event.target.closest('.faq-question');
    if (!question) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFaq(question);
    }
  });
}

// WhatsApp Click Tracking - Meta Pixel + GA4
function trackWhatsAppClick(ctaLocation) {
  // Meta Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_category: 'tortas',
      location: ctaLocation
    });
  }
  // GA4 Event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_click', {
      event_category: 'contact',
      event_label: ctaLocation,
      value: 1
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(function(link) {
    link.addEventListener('click', function() {
      // Extract UTM source from URL or fallback to section ID
      const url = new URL(this.href);
      const utmSource = url.searchParams.get('utm_source') || 
                        this.closest('section')?.id || 
                        (this.classList.contains('fab-wa') ? 'fab' : 'unknown');
      trackWhatsAppClick(utmSource);
    });
  });
});

// ===== DARK MODE TOGGLE =====
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀' : '☽';
    themeToggle.title = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
  }
  localStorage.setItem('dc-theme', theme);
}

if (themeToggle) {
  const saved = localStorage.getItem('dc-theme');
  if (saved) { setTheme(saved); }
  // default: light — no auto-detect OS preference

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, startIndex) {
  lightboxImages = images;
  lightboxIndex = startIndex;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  if (!lightboxImages[lightboxIndex]) return;
  lightboxImg.src = lightboxImages[lightboxIndex].src;
  lightboxImg.alt = lightboxImages[lightboxIndex].alt || '';
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

if (lightbox) {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const images = Array.from(galleryItems);

  galleryItems.forEach((img, i) => {
    img.parentElement.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(images, i);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  lightboxPrev.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  });

  lightboxNext.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; updateLightbox(); }
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; }
      else { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; }
      updateLightbox();
    }
  });
}

// ===== SCROLL COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('counting');
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// ===== EXIT INTENT POPUP (honest, no fake urgency) =====
const exitPopup = document.getElementById('exit-popup');
const exitDismissed = sessionStorage.getItem('dc-exit-dismissed');

if (exitPopup && !exitDismissed) {
  let exitShown = false;
  document.addEventListener('mouseout', function(e) {
    if (e.clientY < 5 && !exitShown) {
      exitShown = true;
      exitPopup.classList.add('active');
    }
  });

  const exitClose = document.getElementById('exit-popup-close');
  if (exitClose) {
    exitClose.addEventListener('click', function() {
      exitPopup.classList.remove('active');
      sessionStorage.setItem('dc-exit-dismissed', '1');
    });
  }

  exitPopup.addEventListener('click', function(e) {
    if (e.target === exitPopup) {
      exitPopup.classList.remove('active');
      sessionStorage.setItem('dc-exit-dismissed', '1');
    }
  });
}
