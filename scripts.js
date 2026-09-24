/* ==========================================================================
   DULCES CREACIONES — MAIN SCRIPTS & INTERACTIVE SUITE
   UX/UI + CRO + Analytics Tracking + Interactive Components
   ========================================================================== */

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
  if (element.closest('.fab-wa') || element.classList.contains('fab-wa')) return 'floating_fab';
  if (element.closest('#navbar') || element.closest('nav')) return 'nav';
  if (element.closest('.hero') || element.closest('.hero-grid')) return 'hero';
  if (element.closest('#especialidades') || element.closest('.category-grid')) return 'categories';
  if (element.closest('#galeria') || element.closest('.gallery-grid')) return 'gallery';
  if (element.closest('#lightbox')) return 'lightbox';
  if (element.closest('#proceso') || element.closest('.pasos-grid')) return 'proceso';
  if (element.closest('#rellenos') || element.closest('.rellenos-grid')) return 'rellenos';
  if (element.closest('#autor')) return 'about_author';
  if (element.closest('#zona')) return 'location_zone';
  if (element.closest('#faq')) return 'faq';
  if (element.closest('#cta-final')) return 'cta_final';
  if (element.closest('#exit-popup')) return 'exit_popup';
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
  const utmSource = linkUrl.searchParams?.get('utm_source') || 'direct_site';
  const utmMedium = linkUrl.searchParams?.get('utm_medium') || 'whatsapp';
  const utmCampaign = linkUrl.searchParams?.get('utm_campaign') || '';

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

// Global click event delegation for WhatsApp, Instagram, and Maps
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (waLink) {
      trackWhatsAppClick(waLink);
      return;
    }

    const igLink = e.target.closest('a[href*="instagram.com"]');
    if (igLink) {
      trackInstagramClick(igLink);
      return;
    }

    const reviewLink = e.target.closest('a[href*="writereview"]');
    if (reviewLink) {
      trackEvent('review_click', { link_location: getLinkLocation(reviewLink), page_path: window.location.pathname });
      return;
    }

    const mapsLink = e.target.closest('a[href*="maps.google."], a[href*="google.com/maps"], a[href*="maps.app.goo.gl"]');
    if (mapsLink) {
      trackEvent('maps_click', { link_location: getLinkLocation(mapsLink), page_path: window.location.pathname });
    }
  });
});

// ===== NAVBAR SCROLL EFFECT & MOBILE MENU =====
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar') || document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (hamburger && navLinks) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // Lock scrolling on <html>: overflow on <body> would turn it into a
      // scroll container and unstick the sticky header of secondary pages
      document.documentElement.style.overflow = isOpen ? 'hidden' : '';
      document.body.classList.toggle('nav-open', isOpen);

      trackEvent('menu_toggle', {
        action: isOpen ? 'open' : 'close',
        viewport_width: window.innerWidth
      });
    };

    hamburger.addEventListener('click', () => toggleMenu());

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }
});

// ===== SCROLL REVEAL ANIMATION (SAFE & ROBUST) =====
document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  
  // Reveal immediately if above the fold
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.05 });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
});

// ===== MARQUEE SEAMLESS LOOP =====
document.addEventListener('DOMContentLoaded', () => {
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner && !marqueeInner.getAttribute('data-duplicated')) {
    marqueeInner.innerHTML += marqueeInner.innerHTML;
    marqueeInner.setAttribute('data-duplicated', 'true');
  }
});

// ===== GALLERY FILTERING & LIGHTBOX =====
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxCtaLink = document.querySelector('.lightbox-cta-link');
  let lightboxShareBtn = null;
  if (lightboxCtaLink && lightboxCtaLink.parentElement) {
    lightboxShareBtn = document.createElement('button');
    lightboxShareBtn.type = 'button';
    lightboxShareBtn.className = 'lightbox-share-btn';
    lightboxShareBtn.textContent = 'Compartir';
    lightboxCtaLink.parentElement.appendChild(lightboxShareBtn);
  }
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  // Filter Buttons
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter') || 'all';

        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category') || 'all';
          if (category === 'all' || itemCat.includes(category)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 200);
          }
        });

        trackEvent('gallery_filter', { filter_category: category });
      });
    });
  }

  // Lightbox
  let visibleImages = [];
  let currentIndex = 0;

  function updateVisibleImages() {
    visibleImages = Array.from(document.querySelectorAll('.gallery-item'))
      .filter(item => window.getComputedStyle(item).display !== 'none')
      .map(item => ({
        src: item.querySelector('img')?.getAttribute('src') || '',
        alt: item.querySelector('img')?.getAttribute('alt') || 'Torta artesanal',
        label: item.querySelector('.gallery-item-label')?.textContent || 'Diseño Exclusivo'
      }));
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    updateVisibleImages();
    if (visibleImages.length === 0) return;

    currentIndex = index >= 0 && index < visibleImages.length ? index : 0;
    renderLightboxItem();
    lightbox.removeAttribute('inert');
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    trackEvent('gallery_view', {
      image_src: visibleImages[currentIndex].src,
      image_label: visibleImages[currentIndex].label,
      image_index: currentIndex + 1
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('inert', '');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderLightboxItem() {
    const item = visibleImages[currentIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = item.label;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} de ${visibleImages.length}`;
    }
    if (lightboxCtaLink) {
      const msg = encodeURIComponent(`Hola! Estuve viendo la galería y me encantó la ${item.label} 🎂 ¿Podrían pasarme presupuesto y disponibilidad?`);
      lightboxCtaLink.href = `https://wa.me/5491133266362?text=${msg}&utm_source=lightbox&utm_medium=whatsapp&utm_campaign=gallery_inquiry`;
    }
  }

  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        updateVisibleImages();
        const imgSrc = item.querySelector('img')?.getAttribute('src');
        const idx = visibleImages.findIndex(img => img.src === imgSrc);
        openLightbox(idx !== -1 ? idx : 0);
      });
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
      renderLightboxItem();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % visibleImages.length;
      renderLightboxItem();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
      renderLightboxItem();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % visibleImages.length;
      renderLightboxItem();
    }
  });

  if (lightboxShareBtn) {
    lightboxShareBtn.addEventListener('click', async () => {
      const item = visibleImages[currentIndex];
      if (!item) return;
      const url = 'https://dulcescreaciones.vercel.app/?utm_source=share&utm_medium=referral&utm_campaign=gallery_share#galeria';
      const text = `Mirá esta torta de Dulces Creaciones (Temperley): ${item.label}`;
      trackEvent('share', { method: navigator.share ? 'web_share' : 'whatsapp', content_type: 'gallery_image', item_id: item.label });
      if (navigator.share) {
        try { await navigator.share({ title: 'Dulces Creaciones', text, url }); } catch (e) {}
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank', 'noopener');
    });
  }
});

// ===== THEME TOGGLE (LIGHT / DARK) =====
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

// ===== FAQ ACCORDION TRACKING =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('details.faq-item').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        const summaryText = details.querySelector('summary')?.innerText || 'FAQ';
        trackEvent('faq_toggle', {
          faq_question: summaryText.trim(),
          page_location: window.location.href
        });
      }
    });
  });
});

// ===== EXIT INTENT POPUP (SMART & NON-INTRUSIVE) =====
document.addEventListener('DOMContentLoaded', () => {
  const exitPopup = document.getElementById('exit-popup');
  const exitClose = document.getElementById('exit-popup-close');
  let shown = false;

  try {
    shown = sessionStorage.getItem('dc_exit_popup_shown') === 'true';
  } catch (e) {}

  if (exitPopup && !shown) {
    const showPopup = () => {
      if (shown) return;
      shown = true;
      try {
        sessionStorage.setItem('dc_exit_popup_shown', 'true');
      } catch (e) {}

      exitPopup.style.opacity = '1';
      exitPopup.style.pointerEvents = 'auto';

      trackEvent('exit_popup_show', {
        page_location: window.location.href
      });
    };

    const hidePopup = () => {
      exitPopup.style.opacity = '0';
      exitPopup.style.pointerEvents = 'none';
    };

    // Trigger on desktop mouse leaving viewport towards top
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 10 && window.innerWidth > 768) {
        showPopup();
      }
    });

    if (exitClose) {
      exitClose.addEventListener('click', hidePopup);
    }
    exitPopup.addEventListener('click', (e) => {
      if (e.target === exitPopup) hidePopup();
    });
  }
});

// ===== PWA INSTALL PROMPT =====
document.addEventListener('DOMContentLoaded', () => {
  let deferredPrompt;
  const pwaPrompt = document.getElementById('pwa-prompt');
  const pwaInstall = document.getElementById('pwa-install');
  const pwaDismiss = document.getElementById('pwa-dismiss');

  let pwaDismissed = false;
  try {
    pwaDismissed = localStorage.getItem('pwaDismissed') === 'true';
  } catch (e) {}

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (pwaPrompt && !pwaDismissed && window.innerWidth < 768) {
      setTimeout(() => {
        pwaPrompt.style.display = 'block';
        setTimeout(() => pwaPrompt.classList.add('visible'), 50);
      }, 6000);
    }
  });

  if (pwaInstall) {
    pwaInstall.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        try {
          localStorage.setItem('pwaInstalled', 'true');
        } catch (e) {}
      }
      deferredPrompt = null;
      if (pwaPrompt) {
        pwaPrompt.classList.remove('visible');
        setTimeout(() => { pwaPrompt.style.display = 'none'; }, 300);
      }
    });
  }

  if (pwaDismiss) {
    pwaDismiss.addEventListener('click', () => {
      try {
        localStorage.setItem('pwaDismissed', 'true');
      } catch (e) {}
      if (pwaPrompt) {
        pwaPrompt.classList.remove('visible');
        setTimeout(() => { pwaPrompt.style.display = 'none'; }, 300);
      }
    });
  }

});

// ===== WHATSAPP CTA (desktop pill / mobile bottom bar) =====
// Hidden while another WhatsApp call to action is already on screen:
// the hero buttons, the final CTA section or the footer WhatsApp button.
document.addEventListener('DOMContentLoaded', () => {
  const fab = document.querySelector('.fab-wa');
  if (!fab) return;

  // Pages whose FAB markup predates the mobile bar get its label here
  if (!fab.querySelector('.fab-bar-text')) {
    const bar = document.createElement('span');
    bar.className = 'fab-bar-text';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span class="fab-bar-title">Consultar por WhatsApp</span>' +
      '<span class="fab-bar-sub">Presupuesto sin cargo en el día</span>';
    fab.appendChild(bar);
  }

  if (!('IntersectionObserver' in window)) return;

  const heroTarget = document.querySelector('.hero-actions') || document.querySelector('.hero-cta');
  const targets = [
    heroTarget,
    document.getElementById('cta-final'),
    document.querySelector('footer .dc-footer-cta-btn')
  ].filter(Boolean);
  if (targets.length === 0) return;

  const inView = new Set();
  if (heroTarget && heroTarget.getBoundingClientRect().top < window.innerHeight) {
    inView.add(heroTarget);
    fab.classList.add('fab-hidden');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) inView.add(entry.target);
      else inView.delete(entry.target);
    });
    fab.classList.toggle('fab-hidden', inView.size > 0);
  });
  targets.forEach((el) => observer.observe(el));
});

// ===== MAP FACADE (load Google Maps only on tap) =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.map-facade').forEach((facade) => {
    const btn = facade.querySelector('.map-facade-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = facade.dataset.mapSrc;
      iframe.title = 'Ubicación de Dulces Creaciones en Temperley, Zona Sur';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      facade.replaceWith(iframe);
      trackEvent('maps_click', { link_location: 'map_facade' });
    });
  });
});
