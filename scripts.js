/* ==========================================================================
   DULCES CREACIONES — SCRIPTS & INTERACTION
   Pastelería Artesanal · Temperley, Buenos Aires
   ========================================================================== */

window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, params) {
  params = params || {};
  params.timestamp = new Date().toISOString();
  window.dataLayer.push({
    event: eventName,
    ...params
  });
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

function trackWhatsAppClick(element) {
  let linkUrl = null;
  try {
    linkUrl = new URL(element.href);
  } catch (e) {
    linkUrl = { searchParams: new URLSearchParams() };
  }

  const ctaText = (element.innerText || element.textContent || 'WhatsApp').trim().replace(/\s+/g, ' ');
  const utmSource = linkUrl.searchParams?.get('utm_source') || 'site';
  const utmMedium = linkUrl.searchParams?.get('utm_medium') || 'whatsapp';
  const utmCampaign = linkUrl.searchParams?.get('utm_campaign') || '';

  trackEvent('whatsapp_click', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    cta_text: ctaText,
    destination_phone: '+5491133266362',
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign
  });
}

function trackInstagramClick() {
  trackEvent('instagram_click', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    social_network: 'instagram',
    profile: '@dulcescreaciones_dc'
  });
}

// Global click tracking
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (waLink) {
      trackWhatsAppClick(waLink);
      return;
    }
    const igLink = e.target.closest('a[href*="instagram.com"]');
    if (igLink) {
      trackInstagramClick();
      return;
    }
  });
});

// ===== HEADER SCROLL & MOBILE MENU =====
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (menuToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }
});

// ===== PORTFOLIO FILTERING & LIGHTBOX =====
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxPhoto = document.getElementById('lightbox-photo');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxWaBtn = document.querySelector('.lightbox-wa-btn');
  const lightboxDismiss = document.querySelector('.lightbox-dismiss');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  // Filter Buttons
  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter') || 'all';

        galleryCards.forEach(card => {
          const itemCategory = card.getAttribute('data-category') || 'all';
          if (category === 'all' || itemCategory.includes(category)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        trackEvent('gallery_filter', { category });
      });
    });
  }

  // Lightbox
  let visibleCards = [];
  let currentIndex = 0;

  function refreshVisibleCards() {
    visibleCards = Array.from(document.querySelectorAll('.gallery-card'))
      .filter(card => window.getComputedStyle(card).display !== 'none')
      .map(card => ({
        src: card.querySelector('img')?.getAttribute('src') || '',
        alt: card.querySelector('img')?.getAttribute('alt') || 'Torta artesanal',
        title: card.querySelector('.gallery-card-title')?.textContent || 'Diseño de Pastelería'
      }));
  }

  function openLightbox(index) {
    if (!lightboxModal || !lightboxPhoto) return;
    refreshVisibleCards();
    if (visibleCards.length === 0) return;

    currentIndex = index >= 0 && index < visibleCards.length ? index : 0;
    renderCurrentPhoto();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    trackEvent('gallery_view', {
      photo: visibleCards[currentIndex].title
    });
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderCurrentPhoto() {
    const item = visibleCards[currentIndex];
    if (!item) return;

    lightboxPhoto.src = item.src;
    lightboxPhoto.alt = item.alt;

    if (lightboxTitle) {
      lightboxTitle.textContent = item.title;
    }
    if (lightboxWaBtn) {
      const msg = encodeURIComponent(`Hola! Estuve viendo la web y me gustó mucho la ${item.title} 🎂 ¿Podrían pasarme presupuesto y disponibilidad?`);
      lightboxWaBtn.href = `https://wa.me/5491133266362?text=${msg}&utm_source=lightbox&utm_medium=whatsapp&utm_campaign=gallery_inquiry`;
    }
  }

  if (galleryCards.length > 0) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        refreshVisibleCards();
        const imgSrc = card.querySelector('img')?.getAttribute('src');
        const idx = visibleCards.findIndex(c => c.src === imgSrc);
        openLightbox(idx !== -1 ? idx : 0);
      });
    });
  }

  if (lightboxDismiss) lightboxDismiss.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
      renderCurrentPhoto();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % visibleCards.length;
      renderCurrentPhoto();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
      renderCurrentPhoto();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % visibleCards.length;
      renderCurrentPhoto();
    }
  });
});

// ===== THEME TOGGLE (LIGHT / DARK) =====
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle-btn');
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
