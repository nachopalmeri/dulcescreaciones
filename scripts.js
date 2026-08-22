/* Dulces Creaciones - Main Scripts & Analytics Tracking */

// Initialize DataLayer for Google Tag Manager / GA4
window.dataLayer = window.dataLayer || [];

// Helper function to push events to GA4 and GTM
function trackEvent(eventName, params) {
  params = params || {};
  params.timestamp = new Date().toISOString();
  
  // GTM dataLayer push
  window.dataLayer.push({
    event: eventName,
    ...params
  });

  // Direct GA4 gtag event
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// Commercial intent tracking helpers
function getLinkLocation(element) {
  if (element.closest('.fab-wa') || element.classList.contains('fab-wa')) return 'fab';
  if (element.closest('#navbar') || element.closest('nav')) return 'nav';
  if (element.closest('.hero') || element.closest('.hero-editorial')) return 'hero';
  if (element.closest('#galeria') || element.closest('.gallery-grid')) return 'gallery';
  if (element.closest('#precios') || element.closest('.precios-grid')) return 'pricing';
  if (element.closest('#faq')) return 'faq';
  if (element.closest('#proceso')) return 'proceso';
  if (element.closest('#rellenos')) return 'rellenos';
  if (element.closest('#contacto') || element.closest('form')) return 'contact_form';
  if (element.closest('footer')) return 'footer';
  return element.closest('section')?.id || 'body';
}

function detectServiceFromUrl() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('15-ano') || path.includes('quince')) return 'tortas_15_anos';
  if (path.includes('infantil') || path.includes('disney') || path.includes('moana') || path.includes('kuromi')) return 'tortas_infantiles';
  if (path.includes('gaming') || path.includes('fortnite')) return 'tortas_gaming';
  if (path.includes('futbol') || path.includes('san-lorenzo')) return 'tortas_futbol';
  if (path.includes('mesa') || path.includes('candy')) return 'mesas_dulces';
  if (path.includes('boda') || path.includes('egresado')) return 'tortas_bodas_egresados';
  if (path.includes('baby-shower')) return 'tortas_baby_shower';
  if (path.includes('bautismo')) return 'tortas_bautismo';
  if (path.includes('comunion')) return 'tortas_comunion';
  if (path.includes('gluten') || path.includes('tacc') || path.includes('celiaco')) return 'tortas_sin_tacc';
  if (path.includes('menu')) return 'catalogo_menu';
  if (path.includes('blog')) return 'blog_informativo';
  return 'tortas_artesanales';
}

function trackWhatsAppClick(element) {
  let linkUrl = null;
  try {
    linkUrl = new URL(element.href);
  } catch (e) {
    linkUrl = { searchParams: new URLSearchParams() };
  }

  const ctaText = (element.innerText || element.textContent || element.getAttribute('aria-label') || 'WhatsApp').trim().replace(/\s+/g, ' ');
  const linkLocation = element.getAttribute('data-link-location') || getLinkLocation(element);
  const utmSource = linkUrl.searchParams.get('utm_source') || 'direct_site';
  const utmMedium = linkUrl.searchParams.get('utm_medium') || 'whatsapp';
  const utmCampaign = linkUrl.searchParams.get('utm_campaign') || '';

  trackEvent('whatsapp_click', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    cta_text: ctaText,
    link_location: linkLocation,
    service: detectServiceFromUrl(),
    destination_phone: '+5491133266362',
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign
  });
}

function trackInstagramClick(element) {
  const linkLocation = element.getAttribute('data-link-location') || getLinkLocation(element);
  trackEvent('instagram_click', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    link_location: linkLocation,
    social_network: 'instagram',
    profile: '@dulcescreaciones_dc'
  });
}

function trackMapsClick(element) {
  const linkLocation = element.getAttribute('data-link-location') || getLinkLocation(element);
  trackEvent('maps_click', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    link_location: linkLocation,
    destination: 'Temperley, Zona Sur GBA'
  });
}

function trackCtaClick(element) {
  const ctaText = (element.innerText || element.textContent || element.getAttribute('aria-label') || 'CTA').trim().replace(/\s+/g, ' ');
  const linkLocation = getLinkLocation(element);
  const ctaUrl = element.getAttribute('href') || element.getAttribute('action') || '';
  
  trackEvent('cta_click', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    cta_text: ctaText,
    cta_url: ctaUrl,
    link_location: linkLocation
  });
}

// Global click event listener for analytics
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href') || '';

  // WhatsApp links
  if (href.includes('wa.me') || href.includes('whatsapp.com')) {
    trackWhatsAppClick(link);
    return;
  }

  // Instagram links
  if (href.includes('instagram.com')) {
    trackInstagramClick(link);
    return;
  }

  // Google Maps links
  if (href.includes('maps.google.') || href.includes('goo.gl/maps') || href.includes('google.com/maps')) {
    trackMapsClick(link);
    return;
  }

  // Generic key CTA buttons
  if (link.classList.contains('nav-cta') || link.classList.contains('btn-wa') || link.classList.contains('btn-wa-big') || link.classList.contains('hero-cta')) {
    trackCtaClick(link);
  }
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ===== HAMBURGER MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleMenu());

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }
});

// ===== SCROLL REVEAL ANIMATION =====
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  });
} else {
  // Fallback if IntersectionObserver not available
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });
}

// ===== MARQUEE DUPLICATE FOR SEAMLESS LOOP =====
document.addEventListener('DOMContentLoaded', () => {
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner && !marqueeInner.getAttribute('data-duplicated')) {
    marqueeInner.innerHTML += marqueeInner.innerHTML;
    marqueeInner.setAttribute('data-duplicated', 'true');
  }
});

// ===== FAQ ACCORDION =====
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Track FAQ toggle interaction
    const faqTitle = (question.innerText || question.textContent || '').trim();
    trackEvent('faq_toggle', {
      faq_question: faqTitle,
      page_location: window.location.href
    });
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
      faqQuestions.forEach(item => closeFaqItem(item));
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
});

// ===== DARK / LIGHT THEME TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀' : '☽';
      themeToggle.title = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
    try {
      localStorage.setItem('dc-theme', theme);
    } catch (e) {}
  }

  if (themeToggle) {
    const saved = localStorage.getItem('dc-theme');
    if (saved) {
      setTheme(saved);
    }

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      trackEvent('theme_change', { theme: next });
    });
  }
});

// ===== LIGHTBOX GALLERY =====
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function openLightbox(images, startIndex) {
    if (!lightbox || !lightboxImg) return;
    lightboxImages = images;
    lightboxIndex = startIndex;
    updateLightbox();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    trackEvent('gallery_view', {
      image_src: lightboxImg.src,
      image_index: lightboxIndex + 1,
      total_images: lightboxImages.length,
      page_location: window.location.href
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!lightboxImages[lightboxIndex] || !lightboxImg) return;
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].alt || 'Torta artesanal Dulces Creaciones';
    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    }
  }

  if (lightbox) {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const images = Array.from(galleryItems);

    galleryItems.forEach((img, i) => {
      const parent = img.parentElement;
      if (parent) {
        parent.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(images, i);
        });
      }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightbox();
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        updateLightbox();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightbox();
      }
      if (e.key === 'ArrowRight') {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        updateLightbox();
      }
    });

    // Touch swipe for mobile lightbox
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        } else {
          lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        }
        updateLightbox();
      }
    }, { passive: true });
  }
});

// ===== EXIT INTENT POPUP =====
document.addEventListener('DOMContentLoaded', () => {
  const exitPopup = document.getElementById('exit-popup');
  let exitDismissed = false;
  try {
    exitDismissed = sessionStorage.getItem('dc-exit-dismissed');
  } catch (e) {}

  if (exitPopup && !exitDismissed) {
    let exitShown = false;
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY < 5 && !exitShown) {
        exitShown = true;
        exitPopup.classList.add('active');
        trackEvent('exit_popup_shown', { page_location: window.location.href });
      }
    });

    const exitClose = document.getElementById('exit-popup-close');
    if (exitClose) {
      exitClose.addEventListener('click', function() {
        exitPopup.classList.remove('active');
        try { sessionStorage.setItem('dc-exit-dismissed', '1'); } catch (e) {}
      });
    }

    exitPopup.addEventListener('click', function(e) {
      if (e.target === exitPopup) {
        exitPopup.classList.remove('active');
        try { sessionStorage.setItem('dc-exit-dismissed', '1'); } catch (e) {}
      }
    });
  }
});

// ===== PWA INSTALL PROMPT =====
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwaPrompt = document.getElementById('pwa-prompt');
  let pwaDismissed = false;
  try {
    pwaDismissed = localStorage.getItem('pwaDismissed');
  } catch (err) {}

  if (pwaPrompt && !pwaDismissed && !window.matchMedia('(display-mode: standalone)').matches) {
    setTimeout(() => {
      pwaPrompt.style.display = 'block';
      setTimeout(() => pwaPrompt.classList.add('visible'), 100);
      trackEvent('pwa_prompt_shown', { page_location: window.location.href });
    }, 6000);
  }
});
