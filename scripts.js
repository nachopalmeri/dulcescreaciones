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
