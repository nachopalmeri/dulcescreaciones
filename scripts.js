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

// ===== PASTELERIA ASSISTANT CHATBOT (ELI · DULCES CREACIONES) =====
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('dc-chatbot-root')) {
    const chatRoot = document.createElement('div');
    chatRoot.id = 'dc-chatbot-root';
    chatRoot.innerHTML = `
      <button class="dc-chat-launcher" id="dc-chat-launcher" aria-label="Abrir asistente virtual" aria-haspopup="dialog">
        <div class="dc-chat-avatar">🎂</div>
        <span>¿Dudas con tu torta?</span>
        <div class="dc-chat-pulse"></div>
      </button>

      <div class="dc-chat-modal" id="dc-chat-modal" role="dialog" aria-modal="true" aria-label="Asistente Dulces Creaciones">
        <div class="dc-chat-header">
          <div class="dc-chat-header-info">
            <div class="dc-chat-header-avatar">🍰</div>
            <div>
              <h3 class="dc-chat-title">Eli · Dulces Creaciones</h3>
              <p class="dc-chat-subtitle"><span style="color:#25D366">●</span> En línea · Pastelería Artesanal</p>
            </div>
          </div>
          <button class="dc-chat-close" id="dc-chat-close" aria-label="Cerrar chat">✕</button>
        </div>

        <div class="dc-chat-body" id="dc-chat-body">
          <div class="dc-chat-msg bot">
            <div class="dc-chat-bubble">
              ¡Hola! 🎂 Soy Eli de <strong>Dulces Creaciones</strong>. Diseñamos tortas 100% artesanales en Temperley. ¿En qué puedo ayudarte hoy?
            </div>
            <div class="dc-chat-chips-container" id="dc-initial-chips">
              <button class="dc-chat-chip" data-query="precio">💰 ¿Cuánto cuesta una torta?</button>
              <button class="dc-chat-chip" data-query="retiro">📍 ¿Dónde y cómo se retira?</button>
              <button class="dc-chat-chip" data-query="sabores">🍓 Sabores y rellenos</button>
              <button class="dc-chat-chip" data-query="tiempo">🕒 ¿Con cuánta anticipación pedir?</button>
              <button class="dc-chat-chip" data-query="mesas">🧁 Mesas dulces y Candy Bar</button>
              <button class="dc-chat-chip" data-query="tacc">🌾 Tortas sin TACC</button>
              <button class="dc-chat-chip" data-query="whatsapp">📲 Hablar con Elizabeth por WhatsApp</button>
            </div>
          </div>
        </div>

        <form class="dc-chat-footer" id="dc-chat-form">
          <input type="text" class="dc-chat-input" id="dc-chat-input" placeholder="Escribí tu consulta aquí..." autocomplete="off" />
          <button type="submit" class="dc-chat-send" aria-label="Enviar mensaje">➤</button>
        </form>
      </div>
    `;
    document.body.appendChild(chatRoot);
  }

  const launcher = document.getElementById('dc-chat-launcher');
  const modal = document.getElementById('dc-chat-modal');
  const closeBtn = document.getElementById('dc-chat-close');
  const chatBody = document.getElementById('dc-chat-body');
  const chatForm = document.getElementById('dc-chat-form');
  const chatInput = document.getElementById('dc-chat-input');

  if (!launcher || !modal || !chatBody) return;

  function toggleChat(open) {
    const isOpen = typeof open === 'boolean' ? open : !modal.classList.contains('open');
    modal.classList.toggle('open', isOpen);
    if (isOpen) {
      chatInput?.focus();
      trackEvent('chatbot_open', { page_location: window.location.href });
    }
  }

  launcher.addEventListener('click', () => toggleChat());
  closeBtn?.addEventListener('click', () => toggleChat(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      toggleChat(false);
    }
  });

  const KNOWLEDGE_RESPONSES = {
    precio: {
      text: "Cada torta es una creación artesanal personalizada. Los precios se calculan según el tamaño (porciones), pisos y la complejidad del diseño. Te pasamos presupuesto exacto y sin cargo en menos de 24 horas.",
      cta: "Pedir presupuesto por WhatsApp",
      msg: "Hola! Quiero consultar el presupuesto de una torta personalizada 🎂"
    },
    retiro: {
      text: "📍 <strong>Punto de retiro en Temperley, Zona Sur GBA</strong>.<br>Para garantizar que cada torta llegue en perfecto estado, los pedidos se retiran personalmente en nuestro taller coordinando día y horario por WhatsApp.",
      cta: "Coordinar retiro por WhatsApp",
      msg: "Hola! Quiero coordinar el retiro de un pedido en Temperley 📍"
    },
    sabores: {
      text: "Nuestros rellenos estrella son:<br>• Dulce de leche artesanal con nueces, chips o merenguitos<br>• Bariloche (dulce de leche + ganache de chocolate)<br>• Crema Oreo / Pasta Bon o Bon / Marroc<br>• Ganache de chocolate blanco o negro<br>Bizcochuelos súper húmedos de vainilla, cacao amargo o marmolado.",
      cta: "Ver disponibilidad de sabores",
      msg: "Hola! Quiero consultar disponibilidad de sabores y rellenos para mi torta 🍓"
    },
    tiempo: {
      text: "Recomendamos encargar con <strong>7 a 15 días de anticipación</strong> para tortas de cumpleaños, y <strong>15 a 20 días</strong> para eventos grandes (15 años, bodas o mesas dulces). Tomamos los turnos con una seña del 50%.",
      cta: "Reservar mi fecha ahora",
      msg: "Hola! Quiero consultar disponibilidad de fecha para un evento 📅"
    },
    mesas: {
      text: "Armamos mesas dulces completas y temáticas con cupcakes decorados, cake pops, alfajorcitos y mini tartas para complementar tu mesa.",
      cta: "Cotizar mesa dulce",
      msg: "Hola! Quisiera un presupuesto para una mesa dulce temática 🧁"
    },
    tacc: {
      text: "Elaboramos tortas especiales libres de gluten / sin TACC para que todos puedan disfrutar del evento con total tranquilidad y el mismo sabor delicioso.",
      cta: "Consultar opciones sin TACC",
      msg: "Hola! Quisiera consultar por tortas sin TACC / sin gluten 🌾"
    },
    whatsapp: {
      text: "¡Perfecto! Podés chatear directamente con Elizabeth para enviarle tu foto de referencia, consultar dudas y apartar tu fecha.",
      cta: "Abrir WhatsApp con Elizabeth",
      msg: "Hola Elizabeth! Vengo desde la web de Dulces Creaciones para consultar por un pedido 🎂"
    }
  };

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'dc-chat-msg user';
    msgDiv.innerHTML = `<div class="dc-chat-bubble">${text}</div>`;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendBotResponse(key, customText) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'dc-chat-msg bot';
    typingDiv.id = 'dc-typing';
    typingDiv.innerHTML = `
      <div class="dc-chat-typing">
        <span class="dc-chat-dot"></span>
        <span class="dc-chat-dot"></span>
        <span class="dc-chat-dot"></span>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();
      const resp = KNOWLEDGE_RESPONSES[key] || {
        text: customText || "¡Con gusto te asesoramos! Mandanos tu idea o foto de referencia por WhatsApp y te armamos un presupuesto personalizado.",
        cta: "Consultar por WhatsApp",
        msg: "Hola! Quiero hacer una consulta sobre un pedido de pastelería 🎂"
      };

      const botDiv = document.createElement('div');
      botDiv.className = 'dc-chat-msg bot';
      const encodedMsg = encodeURIComponent(resp.msg);
      botDiv.innerHTML = `
        <div class="dc-chat-bubble">${resp.text}</div>
        <a href="https://wa.me/5491133266362?text=${encodedMsg}&utm_source=chatbot&utm_medium=whatsapp&utm_campaign=chat_assistant" target="_blank" rel="noopener noreferrer" class="dc-chat-wa-btn">
          <span>📲</span> ${resp.cta}
        </a>
      `;
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;

      trackEvent('chatbot_query', {
        query_key: key,
        page_location: window.location.href
      });
    }, 380);
  }

  function matchQueryToKey(query) {
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (q.includes('precio') || q.includes('costo') || q.includes('cuanto') || q.includes('sale') || q.includes('valor') || q.includes('presupuesto')) return 'precio';
    if (q.includes('donde') || q.includes('retiro') || q.includes('retira') || q.includes('ubicacion') || q.includes('direccion') || q.includes('envio') || q.includes('delivery') || q.includes('temperley')) return 'retiro';
    if (q.includes('sabor') || q.includes('rellen') || q.includes('chocolate') || q.includes('dulce de leche') || q.includes('oreo') || q.includes('fruta')) return 'sabores';
    if (q.includes('tiempo') || q.includes('anticip') || q.includes('cuanto antes') || q.includes('fecha') || q.includes('dia') || q.includes('urgente')) return 'tiempo';
    if (q.includes('mesa') || q.includes('candy') || q.includes('cupcake') || q.includes('pop') || q.includes('evento')) return 'mesas';
    if (q.includes('tacc') || q.includes('gluten') || q.includes('celiac')) return 'tacc';
    if (q.includes('whatsapp') || q.includes('contacto') || q.includes('telefono') || q.includes('hablar') || q.includes('elizabeth')) return 'whatsapp';
    return null;
  }

  chatBody.addEventListener('click', (e) => {
    const chip = e.target.closest('.dc-chat-chip');
    if (!chip) return;
    const queryKey = chip.getAttribute('data-query');
    const chipText = chip.innerText.trim();
    appendUserMessage(chipText);
    appendBotResponse(queryKey);
  });

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    appendUserMessage(query);
    chatInput.value = '';

    const matchedKey = matchQueryToKey(query);
    if (matchedKey) {
      appendBotResponse(matchedKey);
    } else {
      appendBotResponse('fallback', `Recibido: "${query}". Para coordinar todos los detalles específicos de tu diseño o fecha, te invitamos a escribirnos directo por WhatsApp con Elizabeth:`);
    }
  });
});

