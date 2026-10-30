/**
 * WebToolOcean Testimonial Slider Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 * Supports 6 distinct designs: Modern Cards, Minimal, Elegant, Dark, Quote Focus, Compact Slider.
 *
 * Usage:
 * <script src="https://cdn.widgets.webtoolocean.com/embed/testimonial-slider.js" data-widget-id="WIDGET_ID" async></script>
 * OR:
 * <div class="wto-widget" data-widget="testimonial-slider" data-id="WIDGET_ID"></div>
 * <script src="https://cdn.widgets.webtoolocean.com/embed/testimonial-slider.js" async></script>
 */
(function () {
  "use strict";

  // Locate the executing script tag
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].getAttribute("data-widget-id")) return scripts[i];
      }
      return scripts[scripts.length - 1];
    })();

  var widgetId = currentScript ? currentScript.getAttribute("data-widget-id") : null;

  var globalLoadedKey = "__WTO_TESTIMONIAL_" + (widgetId || "default") + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_TESTIMONIALS = [
    {
      id: "demo-t1",
      name: "Sophia Martinez",
      designation: "Head of Marketing",
      company: "Lumina Studio",
      rating: 5,
      review:
        "WebToolOcean has completely transformed our conversion rates. Adding widgets takes seconds and the visual polish immediately elevated our brand trust.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      websiteUrl: "https://luminastudio.example.com",
    },
    {
      id: "demo-t2",
      name: "Alexander Wright",
      designation: "Founder & CEO",
      company: "Apex Growth",
      rating: 5,
      review:
        "The clean design and mobile responsiveness are outstanding. We saw an immediate 28% increase in client inquiries after embedding these testimonials.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      websiteUrl: "https://apexgrowth.example.com",
    },
    {
      id: "demo-t3",
      name: "Emily Chen",
      designation: "Product Designer",
      company: "Pulse UI",
      rating: 5,
      review:
        "Every layout is genuinely gorgeous. The typography, spacing, and micro-interactions feel like they were crafted by a senior design agency.",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      websiteUrl: "https://pulseui.example.com",
    },
    {
      id: "demo-t4",
      name: "Marcus Vance",
      designation: "E-Commerce Director",
      company: "Nordic Goods",
      rating: 4,
      review:
        "Extremely reliable and effortless to customize. Our shoppers love reading genuine customer feedback right on the checkout page.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      websiteUrl: "https://nordicgoods.example.com",
    },
  ];

  var DEFAULT_CONFIG = {
    designId: "modern-cards",
    title: "What Our Customers Say",
    description: "Real stories and verified experiences from teams around the world.",
    testimonials: DEFAULT_TESTIMONIALS,
    autoplay: true,
    autoplayInterval: 5,
    showArrows: true,
    showDots: true,
    desktopColumns: 2,
    showPhotos: true,
    showRatings: true,
    showDesignation: true,
    showCompany: true,
  };

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getInitials(name) {
    if (!name) return "?";
    var parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function resolveConfig(id) {
    if (id && window.WTO_TESTIMONIAL_CONFIGS && window.WTO_TESTIMONIAL_CONFIGS[id]) {
      return Object.assign({}, DEFAULT_CONFIG, window.WTO_TESTIMONIAL_CONFIGS[id]);
    }
    if (id && window.WTO_DEMO_CONFIG && window.WTO_DEMO_CONFIG[id]) {
      return Object.assign({}, DEFAULT_CONFIG, window.WTO_DEMO_CONFIG[id]);
    }
    try {
      var saved = localStorage.getItem("wto.savedWidgets");
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          var found = parsed.find(function (w) {
            return w.id === id;
          });
          if (found && found.config) {
            return Object.assign({}, DEFAULT_CONFIG, found.config);
          }
        }
      }
    } catch (e) {
      // localStorage not accessible
    }
    return DEFAULT_CONFIG;
  }

  function findHostElement(id) {
    if (id) {
      var el =
        document.querySelector('[data-widget-id="' + id + '"]') ||
        document.querySelector('[data-id="' + id + '"]');
      if (el) return el;
    }
    if (currentScript && currentScript.parentNode) {
      var host = document.createElement("div");
      host.className = "wto-testimonial-slider-embed";
      currentScript.parentNode.insertBefore(host, currentScript);
      return host;
    }
    var fallback = document.createElement("div");
    fallback.className = "wto-testimonial-slider-embed";
    document.body.appendChild(fallback);
    return fallback;
  }

  var CSS_STYLES = `
    :host {
      display: block;
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      color: #0f172a;
      box-sizing: border-box;
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }
    .wto-container {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px;
      position: relative;
    }
    .wto-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .wto-header.compact {
      text-align: left;
      margin-bottom: 16px;
    }
    .wto-title {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
      line-height: 1.25;
    }
    .wto-desc {
      font-size: 14px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .wto-slider-box {
      position: relative;
      overflow: hidden;
      padding: 4px;
    }
    .wto-grid {
      display: grid;
      gap: 16px;
      transition: opacity 0.25s ease-in-out;
    }
    .wto-grid.cols-1 { grid-template-columns: 1fr; }
    .wto-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
    .wto-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }

    @media (max-width: 768px) {
      .wto-grid.cols-2,
      .wto-grid.cols-3 {
        grid-template-columns: 1fr;
      }
    }

    /* Modern Cards */
    .wto-card-modern {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .wto-card-modern:hover {
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
      border-color: #cbd5e1;
    }

    /* Minimal */
    .wto-card-minimal {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #7c3aed;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Elegant */
    .wto-card-elegant {
      background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
      border: 1px solid #fde68a;
      border-radius: 16px;
      padding: 24px;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .wto-card-elegant .wto-quote-text {
      font-style: italic;
      color: #334155;
    }

    /* Dark */
    .wto-card-dark {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 20px;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .wto-card-dark .wto-quote-text { color: #cbd5e1; }
    .wto-card-dark .wto-name { color: #ffffff; }
    .wto-card-dark .wto-sub { color: #94a3b8; }
    .wto-card-dark .wto-footer { border-color: #1e293b; }

    /* Quote Focus */
    .wto-card-quote-focus {
      background: linear-gradient(180deg, #faf5ff 0%, #ffffff 100%);
      border: 1px solid #f3e8ff;
      border-radius: 24px;
      padding: 32px 24px;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }
    .wto-big-quote-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 12px auto;
      background: #f3e8ff;
      color: #7c3aed;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-family: Georgia, serif;
      font-weight: bold;
    }
    .wto-card-quote-focus .wto-quote-text {
      font-size: 18px;
      font-weight: 500;
      color: #1e293b;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .wto-card-quote-focus .wto-footer {
      flex-direction: column;
      justify-content: center;
      border: none;
      padding: 0;
    }

    /* Compact Slider */
    .wto-card-compact {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .wto-card-compact .wto-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .wto-card-compact .wto-quote-text {
      font-size: 12px;
      color: #334155;
      line-height: 1.45;
      margin: 0;
    }

    /* Shared Elements */
    .wto-quote-text {
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
      margin: 0 0 16px 0;
    }
    .wto-footer {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }
    .wto-avatar {
      width: 42px;
      height: 42px;
      border-radius: 9999px;
      overflow: hidden;
      flex-shrink: 0;
      background: #f3e8ff;
      color: #7c3aed;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .wto-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .wto-reviewer-info {
      flex: 1;
      min-width: 0;
    }
    .wto-name {
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wto-sub {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .wto-stars {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-bottom: 10px;
    }
    .wto-star-svg {
      width: 14px;
      height: 14px;
      fill: #f59e0b;
      color: #f59e0b;
    }
    .wto-star-empty {
      width: 14px;
      height: 14px;
      fill: transparent;
      color: #cbd5e1;
    }

    /* Nav Arrows */
    .wto-arrow-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      z-index: 10;
      transition: all 0.2s ease;
    }
    .wto-arrow-btn:hover {
      background: #f8fafc;
      color: #7c3aed;
      border-color: #cbd5e1;
      transform: translateY(-50%) scale(1.05);
    }
    .wto-arrow-btn.prev { left: 0px; }
    .wto-arrow-btn.next { right: 0px; }

    /* Dots */
    .wto-dots {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      margin-top: 20px;
    }
    .wto-dot {
      width: 8px;
      height: 8px;
      border-radius: 9999px;
      background: #cbd5e1;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .wto-dot.active {
      width: 24px;
      background: #7c3aed;
    }
  `;

  function renderStars(rating) {
    var r = Math.max(1, Math.min(5, Math.round(rating || 5)));
    var html = '<div class="wto-stars" aria-label="' + r + ' out of 5 stars">';
    for (var i = 0; i < 5; i++) {
      if (i < r) {
        html +=
          '<svg class="wto-star-svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      } else {
        html +=
          '<svg class="wto-star-empty" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      }
    }
    html += "</div>";
    return html;
  }

  function renderAvatar(item, showPhotos) {
    if (!showPhotos) return "";
    var initials = escapeHtml(getInitials(item.name));
    if (item.photoUrl) {
      return (
        '<div class="wto-avatar"><img src="' +
        escapeHtml(item.photoUrl) +
        '" alt="' +
        escapeHtml(item.name) +
        '" onerror="this.style.display=\'none\'; this.parentElement.innerText=\'' +
        initials +
        '\'" /></div>'
      );
    }
    return '<div class="wto-avatar">' + initials + "</div>";
  }

  function renderCard(item, config) {
    var designId = config.designId;
    var showPhotos = config.showPhotos;
    var showRatings = config.showRatings;
    var showDesignation = config.showDesignation;
    var showCompany = config.showCompany;

    var subParts = [];
    if (showDesignation && item.designation) subParts.push(escapeHtml(item.designation));
    if (showCompany && item.company) subParts.push(escapeHtml(item.company));
    var subtitle = subParts.join(" · ");

    var starsHtml = showRatings ? renderStars(item.rating) : "";
    var avatarHtml = renderAvatar(item, showPhotos);

    if (designId === "minimal") {
      return (
        '<div class="wto-card-minimal">' +
        "<div>" +
        starsHtml +
        '<p class="wto-quote-text">“' +
        escapeHtml(item.review) +
        '”</p>' +
        "</div>" +
        '<div class="wto-footer">' +
        avatarHtml +
        '<div class="wto-reviewer-info">' +
        '<div class="wto-name">' +
        escapeHtml(item.name) +
        "</div>" +
        (subtitle ? '<div class="wto-sub">' + subtitle + "</div>" : "") +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }

    if (designId === "elegant") {
      return (
        '<div class="wto-card-elegant">' +
        "<div>" +
        starsHtml +
        '<p class="wto-quote-text">“' +
        escapeHtml(item.review) +
        '”</p>' +
        "</div>" +
        '<div class="wto-footer">' +
        avatarHtml +
        '<div class="wto-reviewer-info">' +
        '<div class="wto-name" style="font-family:serif;">' +
        escapeHtml(item.name) +
        "</div>" +
        (subtitle ? '<div class="wto-sub">' + subtitle + "</div>" : "") +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }

    if (designId === "dark") {
      return (
        '<div class="wto-card-dark">' +
        "<div>" +
        starsHtml +
        '<p class="wto-quote-text">"' +
        escapeHtml(item.review) +
        '"</p>' +
        "</div>" +
        '<div class="wto-footer">' +
        avatarHtml +
        '<div class="wto-reviewer-info">' +
        '<div class="wto-name">' +
        escapeHtml(item.name) +
        "</div>" +
        (subtitle ? '<div class="wto-sub">' + subtitle + "</div>" : "") +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }

    if (designId === "quote-focus") {
      return (
        '<div class="wto-card-quote-focus">' +
        '<div class="wto-big-quote-icon">“</div>' +
        starsHtml +
        '<p class="wto-quote-text">"' +
        escapeHtml(item.review) +
        '"</p>' +
        '<div class="wto-footer">' +
        avatarHtml +
        '<div class="wto-reviewer-info">' +
        '<div class="wto-name" style="justify-content:center;">' +
        escapeHtml(item.name) +
        "</div>" +
        (subtitle ? '<div class="wto-sub">' + subtitle + "</div>" : "") +
        "</div>" +
        "</div>" +
        "</div>"
      );
    }

    if (designId === "compact") {
      return (
        '<div class="wto-card-compact">' +
        '<div class="wto-top">' +
        avatarHtml +
        '<div class="wto-reviewer-info">' +
        '<div class="wto-name">' +
        escapeHtml(item.name) +
        "</div>" +
        (subtitle ? '<div class="wto-sub">' + subtitle + "</div>" : "") +
        "</div>" +
        starsHtml +
        "</div>" +
        '<p class="wto-quote-text">"' +
        escapeHtml(item.review) +
        '"</p>' +
        "</div>"
      );
    }

    // Default: modern-cards
    return (
      '<div class="wto-card-modern">' +
      "<div>" +
      starsHtml +
      '<p class="wto-quote-text">"' +
      escapeHtml(item.review) +
      '"</p>' +
      "</div>" +
      '<div class="wto-footer">' +
      avatarHtml +
      '<div class="wto-reviewer-info">' +
      '<div class="wto-name">' +
      escapeHtml(item.name) +
      "</div>" +
      (subtitle ? '<div class="wto-sub">' + subtitle + "</div>" : "") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function initSlider(host, config) {
    var shadow = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

    var testimonials = config.testimonials || [];
    var itemsPerSlide = config.designId === "quote-focus" ? 1 : Math.min(3, Math.max(1, config.desktopColumns || 2));
    var pages = [];
    for (var i = 0; i < testimonials.length; i += itemsPerSlide) {
      pages.push(testimonials.slice(i, i + itemsPerSlide));
    }
    var totalPages = pages.length;
    var currentPage = 0;
    var timer = null;

    function render() {
      if (totalPages === 0) {
        shadow.innerHTML =
          "<style>" +
          CSS_STYLES +
          '</style><div class="wto-container" style="text-align:center;padding:32px;color:#64748b;">No testimonials available</div>';
        return;
      }

      var items = pages[currentPage] || [];
      var colsClass = "cols-" + itemsPerSlide;

      var html = "<style>" + CSS_STYLES + "</style>";
      html += '<div class="wto-container">';

      // Header
      if (config.title || config.description) {
        html += '<div class="wto-header' + (config.designId === "compact" ? " compact" : "") + '">';
        if (config.title) html += '<h2 class="wto-title">' + escapeHtml(config.title) + "</h2>";
        if (config.description) html += '<p class="wto-desc">' + escapeHtml(config.description) + "</p>";
        html += "</div>";
      }

      // Slider Box
      html += '<div class="wto-slider-box">';

      // Arrows
      if (config.showArrows && totalPages > 1) {
        html +=
          '<button type="button" class="wto-arrow-btn prev" data-action="prev" aria-label="Previous slide">&#8249;</button>';
        html +=
          '<button type="button" class="wto-arrow-btn next" data-action="next" aria-label="Next slide">&#8250;</button>';
      }

      // Cards Grid
      html += '<div class="wto-grid ' + colsClass + '">';
      for (var j = 0; j < items.length; j++) {
        html += renderCard(items[j], config);
      }
      html += "</div>"; // wto-grid
      html += "</div>"; // wto-slider-box

      // Dots
      if (config.showDots && totalPages > 1) {
        html += '<div class="wto-dots">';
        for (var k = 0; k < totalPages; k++) {
          html +=
            '<button type="button" class="wto-dot' +
            (currentPage === k ? " active" : "") +
            '" data-dot="' +
            k +
            '" aria-label="Go to slide ' +
            (k + 1) +
            '"></button>';
        }
        html += "</div>";
      }

      html += "</div>"; // wto-container

      shadow.innerHTML = html;

      // Event listeners
      var prevBtn = shadow.querySelector('[data-action="prev"]');
      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          currentPage = (currentPage - 1 + totalPages) % totalPages;
          render();
        });
      }

      var nextBtn = shadow.querySelector('[data-action="next"]');
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          currentPage = (currentPage + 1) % totalPages;
          render();
        });
      }

      var dots = shadow.querySelectorAll("[data-dot]");
      for (var d = 0; d < dots.length; d++) {
        (function (index) {
          dots[index].addEventListener("click", function () {
            currentPage = index;
            render();
          });
        })(d);
      }

      var container = shadow.querySelector(".wto-container");
      if (container) {
        container.addEventListener("mouseenter", function () {
          if (timer) clearInterval(timer);
        });
        container.addEventListener("mouseleave", function () {
          startAutoplay();
        });
      }
    }

    function startAutoplay() {
      if (!config.autoplay || totalPages <= 1) return;
      if (timer) clearInterval(timer);
      var ms = Math.max(2, config.autoplayInterval || 5) * 1000;
      timer = setInterval(function () {
        currentPage = (currentPage + 1) % totalPages;
        render();
      }, ms);
    }

    render();
    startAutoplay();
  }

  // Execution entry point
  function boot() {
    var host = findHostElement(widgetId);
    if (!host) return;
    var config = resolveConfig(widgetId);
    initSlider(host, config);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
