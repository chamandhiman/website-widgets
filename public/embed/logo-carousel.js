/**
 * WebToolOcean Logo Carousel Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 * Supports 8 distinct designs:
 * 1. Classic Logo Carousel
 * 2. Trusted By
 * 3. Infinite Marquee
 * 4. Grayscale to Color
 * 5. Logo Grid
 * 6. Premium Cards
 * 7. Dark Showcase
 * 8. Compact Partner Strip
 *
 * Usage:
 * <script src="https://cdn.widgets.webtoolocean.com/embed/logo-carousel.js" data-widget-id="WIDGET_ID" async></script>
 * OR:
 * <div class="wto-widget" data-widget="logo-carousel" data-id="WIDGET_ID"></div>
 * <script src="https://cdn.widgets.webtoolocean.com/embed/logo-carousel.js" async></script>
 */
(function () {
  "use strict";

  // Locate the executing script tag or container element
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].getAttribute("data-widget-id")) return scripts[i];
      }
      return scripts[scripts.length - 1];
    })();

  // Resolve widgetId from script tag or DOM marker
  function getWidgetId() {
    if (currentScript && currentScript.getAttribute("data-widget-id")) {
      return currentScript.getAttribute("data-widget-id");
    }
    var container =
      document.querySelector('[data-widget="logo-carousel"][data-id]') ||
      document.querySelector('[data-widget="logo-carousel"][data-widget-id]') ||
      document.querySelector('.wto-widget[data-widget="logo-carousel"]');
    if (container) {
      return container.getAttribute("data-id") || container.getAttribute("data-widget-id");
    }
    return "default";
  }

  var widgetId = getWidgetId();

  // Prevent duplicate initialization
  var globalLoadedKey = "__WTO_LOGO_CAROUSEL_" + widgetId + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_LOGOS = [
    {
      id: "logo-1",
      name: "Apex Cloud",
      altText: "Apex Cloud logo",
      websiteUrl: "https://example.com/apex-cloud",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><path d="M14 34L28 10L42 34H33L28 24L23 34H14Z" fill="%237C3AED"/><circle cx="28" cy="18" r="3.5" fill="%23A78BFA"/><text x="50" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Apex<tspan fill="%237C3AED">Cloud</tspan></text></svg>',
    },
    {
      id: "logo-2",
      name: "Nova Pulse",
      altText: "Nova Pulse logo",
      websiteUrl: "https://example.com/nova-pulse",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><circle cx="26" cy="22" r="12" stroke="%2306B6D4" stroke-width="3"/><path d="M20 22H24L26 16L28 28L30 22H34" stroke="%230284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Nova<tspan fill="%230284C7">Pulse</tspan></text></svg>',
    },
    {
      id: "logo-3",
      name: "Vertex Labs",
      altText: "Vertex Labs logo",
      websiteUrl: "https://example.com/vertex-labs",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><rect x="14" y="10" width="24" height="24" rx="6" fill="%23F59E0B"/><path d="M21 27L26 17L31 27H21Z" fill="white"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Vertex<tspan fill="%23D97706">Labs</tspan></text></svg>',
    },
    {
      id: "logo-4",
      name: "Hyperion AI",
      altText: "Hyperion AI logo",
      websiteUrl: "https://example.com/hyperion-ai",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><circle cx="26" cy="22" r="11" fill="%232563EB"/><path d="M26 15V29M19 22H33" stroke="white" stroke-width="2.5" stroke-linecap="round"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Hyperion<tspan fill="%232563EB">AI</tspan></text></svg>',
    },
    {
      id: "logo-5",
      name: "Starlight Data",
      altText: "Starlight Data logo",
      websiteUrl: "https://example.com/starlight",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 44" fill="none"><path d="M26 10L29 19L38 22L29 25L26 34L23 25L14 22L23 19L26 10Z" fill="%23EC4899"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Starlight<tspan fill="%23DB2777">Data</tspan></text></svg>',
    },
    {
      id: "logo-6",
      name: "Solaria Bio",
      altText: "Solaria Bio logo",
      websiteUrl: "https://example.com/solaria-bio",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none"><circle cx="26" cy="22" r="12" fill="%2310B981"/><circle cx="26" cy="22" r="6" fill="%23059669"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Solaria<tspan fill="%23059669">Bio</tspan></text></svg>',
    },
    {
      id: "logo-7",
      name: "Quantum Sync",
      altText: "Quantum Sync logo",
      websiteUrl: "https://example.com/quantum-sync",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 44" fill="none"><circle cx="20" cy="18" r="5" fill="%236366F1"/><circle cx="32" cy="26" r="5" fill="%238B5CF6"/><line x1="20" y1="18" x2="32" y2="26" stroke="%236366F1" stroke-width="2.5"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Quantum<tspan fill="%236366F1">Sync</tspan></text></svg>',
    },
    {
      id: "logo-8",
      name: "Cipher Guard",
      altText: "Cipher Guard logo",
      websiteUrl: "https://example.com/cipher-guard",
      openInNewTab: true,
      enabled: true,
      imageUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 44" fill="none"><path d="M26 11L36 15V23C36 29 26 34 26 34C26 34 16 29 16 23V15L26 11Z" fill="%230F172A"/><path d="M24 21L26 23L30 19" stroke="%2338BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="48" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="%231E293B">Cipher<tspan fill="%230284C7">Guard</tspan></text></svg>',
    },
  ];

  var DEFAULT_CONFIG = {
    designId: "classic",
    title: "Trusted by 10,000+ Fast-Growing Companies",
    description: "Powering innovative engineering and marketing teams around the globe.",
    showHeading: true,
    logos: DEFAULT_LOGOS,
    visibleLogosDesktop: 5,
    logoHeight: 38,
    maxLogoWidth: 150,
    gap: 36,
    gridColumns: 4,
    paddingY: 36,
    containerWidth: "contained",
    autoplay: true,
    speed: 4,
    direction: "left",
    pauseOnHover: true,
    pauseOnFocus: true,
    showArrows: true,
    showDots: true,
    loop: true,
    bgColor: "transparent",
    textColor: "#1E293B",
    logoOpacity: 85,
    grayscale: false,
    hoverColor: true,
    cardRadius: 12,
    showCardBorder: true,
    showCardShadow: false,
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

  function isSafeUrl(url) {
    if (!url || !url.trim()) return true;
    var trimmed = url.trim();
    if (trimmed === "#") return true;
    return /^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed);
  }

  function getFallbackSvg(name) {
    var safeName = (name || "Partner").trim();
    var initials = safeName
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) {
        return w.charAt(0).toUpperCase();
      })
      .join("");
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 44" fill="none">' +
      '<rect x="2" y="4" width="36" height="36" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>' +
      '<text x="20" y="27" font-family="sans-serif" font-size="14" font-weight="700" fill="#64748B" text-anchor="middle">' +
      escapeHtml(initials) +
      "</text>" +
      '<text x="48" y="27" font-family="sans-serif" font-size="14" font-weight="600" fill="#334155">' +
      escapeHtml(safeName) +
      "</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function resolveConfig(id, callback) {
    // 1. window.WTO_LOGO_CAROUSEL_CONFIGS
    if (id && window.WTO_LOGO_CAROUSEL_CONFIGS && window.WTO_LOGO_CAROUSEL_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_LOGO_CAROUSEL_CONFIGS[id]));
      return;
    }
    // 2. window.WTO_DEMO_CONFIG
    if (id && window.WTO_DEMO_CONFIG && window.WTO_DEMO_CONFIG[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_DEMO_CONFIG[id]));
      return;
    }
    // 3. Script data-config attribute
    if (currentScript && currentScript.getAttribute("data-config")) {
      try {
        var parsed = JSON.parse(currentScript.getAttribute("data-config"));
        callback(Object.assign({}, DEFAULT_CONFIG, parsed));
        return;
      } catch (e) {
        console.warn("[WebToolOcean] Failed to parse script data-config", e);
      }
    }
    // 4. LocalStorage
    try {
      var saved = localStorage.getItem("wto.savedWidgets");
      if (saved) {
        var parsedList = JSON.parse(saved);
        if (Array.isArray(parsedList)) {
          var found = parsedList.find(function (w) {
            return w.id === id;
          });
          if (found && found.config) {
            callback(Object.assign({}, DEFAULT_CONFIG, found.config));
            return;
          }
        }
      }
    } catch (e) {
      // localStorage restricted
    }
    // 5. Fallback endpoint if available
    if (id && id !== "default") {
      fetch("/api/widgets/" + encodeURIComponent(id))
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          var cfg = data.config || data;
          callback(Object.assign({}, DEFAULT_CONFIG, cfg));
        })
        .catch(function () {
          callback(DEFAULT_CONFIG);
        });
      return;
    }
    callback(DEFAULT_CONFIG);
  }

  function findHostElement(id) {
    if (id) {
      var el =
        document.querySelector('[data-widget="logo-carousel"][data-id="' + id + '"]') ||
        document.querySelector('[data-widget="logo-carousel"][data-widget-id="' + id + '"]') ||
        document.querySelector('[data-id="' + id + '"]') ||
        document.querySelector('[data-widget-id="' + id + '"]');
      if (el) return el;
    }
    // Fallback: create container next to executing script
    var container = document.createElement("div");
    container.className = "wto-logo-carousel-container";
    if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.insertBefore(container, currentScript);
    } else {
      document.body.appendChild(container);
    }
    return container;
  }

  function init() {
    var id = getWidgetId();
    resolveConfig(id, function (config) {
      var host = findHostElement(id);
      if (!host) return;

      var shadow = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

      var designId = config.designId || "classic";
      var isDark = designId === "dark-showcase";
      var isCards = designId === "premium-cards";
      var isGrayscale = designId === "grayscale-color" || config.grayscale;
      var isMarquee = designId === "infinite-marquee";
      var isGrid = designId === "logo-grid";
      var isCompact = designId === "compact-strip";

      var effectiveBg = isDark
        ? config.bgColor && config.bgColor !== "transparent"
          ? config.bgColor
          : "#0F172A"
        : config.bgColor || "transparent";

      var effectiveText = isDark
        ? config.textColor && config.textColor !== "#1E293B"
          ? config.textColor
          : "#F8FAFC"
        : config.textColor || "#1E293B";

      var activeLogos = (config.logos || DEFAULT_LOGOS).filter(function (l) {
        return l.enabled !== false;
      });

      var logoHeight = isCompact
        ? Math.max(22, Math.floor((config.logoHeight || 38) * 0.7))
        : config.logoHeight || 38;
      var maxLogoWidth = config.maxLogoWidth || 150;
      var gap = config.gap || 36;
      var paddingY = isCompact ? 12 : config.paddingY || 36;
      var cardRadius = config.cardRadius || 12;

      // Render styles
      var style = document.createElement("style");
      style.textContent = [
        ":host { display: block; width: 100%; box-sizing: border-box; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
        "*, *::before, *::after { box-sizing: border-box; }",
        ".wto-root { width: 100%; background-color: " +
          effectiveBg +
          "; color: " +
          effectiveText +
          "; padding: " +
          paddingY +
          "px 16px; overflow: hidden; position: relative; }",
        ".wto-container { max-width: " +
          (config.containerWidth === "full" ? "100%" : "1200px") +
          "; margin: 0 auto; width: 100%; }",
        ".wto-header { text-align: center; margin-bottom: 24px; }",
        ".wto-title { font-size: " +
          (designId === "trusted-by" ? "18px" : "20px") +
          "; font-weight: 800; margin: 0 0 6px 0; " +
          (designId === "trusted-by" ? "text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85;" : "") +
          " }",
        ".wto-desc { font-size: 13px; opacity: 0.8; margin: 0; line-height: 1.5; }",
        ".wto-logo-item { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: inherit; transition: all 0.3s ease; }",
        ".wto-logo-inner { display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }",
        isCards
          ? ".wto-logo-inner { width: 100%; height: 100%; padding: 12px; background: " +
            (isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF") +
            "; border-radius: " +
            cardRadius +
            "px; " +
            (config.showCardBorder ? "border: 1px solid " + (isDark ? "rgba(255,255,255,0.12)" : "#E2E8F0") + ";" : "") +
            (config.showCardShadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.06);" : "") +
            " }"
          : "",
        isCards
          ? ".wto-logo-item:hover .wto-logo-inner { transform: translateY(-2px); " +
            (config.showCardShadow ? "box-shadow: 0 6px 16px rgba(0,0,0,0.12);" : "") +
            " }"
          : "",
        ".wto-logo-img { height: " +
          logoHeight +
          "px; max-width: " +
          maxLogoWidth +
          "px; object-fit: contain; opacity: " +
          (config.logoOpacity || 85) / 100 +
          "; transition: all 0.3s ease; }",
        isGrayscale
          ? ".wto-logo-img { filter: grayscale(100%) contrast(75%); }"
          : "",
        isGrayscale && config.hoverColor
          ? ".wto-logo-item:hover .wto-logo-img, .wto-logo-item:focus .wto-logo-img { filter: none !important; opacity: 1 !important; transform: scale(1.05); }"
          : "",
        isDark
          ? ".wto-logo-img { filter: brightness(1.25) contrast(1.25); }"
          : "",
        !isGrayscale
          ? ".wto-logo-item:hover .wto-logo-img { transform: scale(1.05); opacity: 1; }"
          : "",
        ".wto-logo-item:focus-visible { outline: 2px solid #8B5CF6; border-radius: 8px; }",
        /* Marquee Styles */
        "@keyframes wtoMarqueeScroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }",
        "@keyframes wtoMarqueeScrollReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }",
        ".wto-marquee-wrapper { position: relative; width: 100%; overflow: hidden; padding: 4px 0; }",
        ".wto-marquee-track { display: flex; align-items: center; width: max-content; gap: " +
          gap +
          "px; animation: " +
          (config.direction === "right" ? "wtoMarqueeScrollReverse" : "wtoMarqueeScroll") +
          " " +
          Math.max(10, (activeLogos.length * 35) / Math.max(1, config.speed || 4)) +
          "s linear infinite; }",
        config.pauseOnHover
          ? ".wto-marquee-wrapper:hover .wto-marquee-track { animation-play-state: paused !important; }"
          : "",
        config.pauseOnFocus
          ? ".wto-marquee-wrapper:focus-within .wto-marquee-track { animation-play-state: paused !important; }"
          : "",
        "@media (prefers-reduced-motion: reduce) { .wto-marquee-track { animation: none !important; overflow-x: auto; } }",
        /* Grid Styles */
        ".wto-grid { display: grid; gap: " +
          gap +
          "px; justify-items: center; align-items: center; grid-template-columns: repeat(" +
          (config.gridColumns || 4) +
          ", minmax(0, 1fr)); }",
        "@media (max-width: 640px) { .wto-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }",
        /* Slider Styles */
        ".wto-slider-viewport { width: 100%; overflow: hidden; position: relative; }",
        ".wto-slider-row { display: flex; align-items: center; justify-content: space-around; width: 100%; gap: " +
          gap +
          "px; transition: opacity 0.3s ease; }",
        ".wto-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border-radius: 99px; border: 1px solid rgba(0,0,0,0.12); background: " +
          (isDark ? "#1E293B" : "#FFFFFF") +
          "; color: " +
          effectiveText +
          "; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.08); transition: background 0.2s; z-index: 10; padding: 0; }",
        ".wto-arrow:hover { background: " + (isDark ? "#334155" : "#F1F5F9") + "; }",
        ".wto-arrow-prev { left: -12px; }",
        ".wto-arrow-next { right: -12px; }",
        ".wto-dots { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 18px; }",
        ".wto-dot { height: 6px; border-radius: 99px; border: none; padding: 0; cursor: pointer; transition: all 0.3s; background: rgba(148, 163, 184, 0.4); width: 6px; }",
        ".wto-dot.active { width: 20px; background: #8B5CF6; }",
      ].join("\n");

      shadow.appendChild(style);

      var root = document.createElement("div");
      root.className = "wto-root";

      var container = document.createElement("div");
      container.className = "wto-container";

      // Heading Section
      if (config.showHeading !== false && (config.title || config.description) && !isCompact) {
        var header = document.createElement("div");
        header.className = "wto-header";
        if (config.title) {
          var h = document.createElement("h3");
          h.className = "wto-title";
          h.textContent = config.title;
          header.appendChild(h);
        }
        if (config.description) {
          var d = document.createElement("p");
          d.className = "wto-desc";
          d.textContent = config.description;
          header.appendChild(d);
        }
        container.appendChild(header);
      }

      function createLogoElement(logo) {
        var hasValidUrl = logo.websiteUrl && isSafeUrl(logo.websiteUrl);
        var el = document.createElement(hasValidUrl ? "a" : "div");
        el.className = "wto-logo-item";
        if (hasValidUrl) {
          el.href = logo.websiteUrl;
          if (logo.openInNewTab) {
            el.target = "_blank";
            el.rel = "noopener noreferrer";
          }
          el.setAttribute("aria-label", (logo.name || "Partner") + " website");
        }

        var inner = document.createElement("div");
        inner.className = "wto-logo-inner";

        var img = document.createElement("img");
        img.className = "wto-logo-img";
        img.src = logo.imageUrl || getFallbackSvg(logo.name);
        img.alt = logo.altText || logo.name || "Partner logo";
        img.title = logo.name || "Partner";
        img.loading = "lazy";
        img.onerror = function () {
          img.src = getFallbackSvg(logo.name);
        };

        inner.appendChild(img);
        el.appendChild(inner);
        return el;
      }

      // Render based on design
      if (isMarquee) {
        var marqueeWrapper = document.createElement("div");
        marqueeWrapper.className = "wto-marquee-wrapper";

        var track = document.createElement("div");
        track.className = "wto-marquee-track";

        activeLogos.forEach(function (l) {
          track.appendChild(createLogoElement(l));
        });

        // Duplicate sequence for seamless loop
        activeLogos.forEach(function (l) {
          var dup = createLogoElement(l);
          dup.setAttribute("aria-hidden", "true");
          track.appendChild(dup);
        });

        marqueeWrapper.appendChild(track);
        container.appendChild(marqueeWrapper);
      } else if (isGrid) {
        var grid = document.createElement("div");
        grid.className = "wto-grid";
        activeLogos.forEach(function (l) {
          grid.appendChild(createLogoElement(l));
        });
        container.appendChild(grid);
      } else {
        // Standard interactive slider
        var sliderWrapper = document.createElement("div");
        sliderWrapper.className = "wto-slider-viewport";

        var visibleCount = Math.max(1, config.visibleLogosDesktop || 5);
        if (window.innerWidth < 640) visibleCount = 2;
        else if (window.innerWidth < 1024) visibleCount = Math.min(3, visibleCount);

        var pages = [];
        for (var i = 0; i < activeLogos.length; i += visibleCount) {
          pages.push(activeLogos.slice(i, i + visibleCount));
        }
        if (pages.length === 0) pages.push([]);

        var currentPage = 0;
        var sliderRow = document.createElement("div");
        sliderRow.className = "wto-slider-row";

        function renderSlidePage(pageIndex) {
          sliderRow.innerHTML = "";
          var pageItems = pages[pageIndex] || [];
          pageItems.forEach(function (l) {
            sliderRow.appendChild(createLogoElement(l));
          });
        }

        renderSlidePage(0);
        sliderWrapper.appendChild(sliderRow);

        // Arrows & Dots
        if (config.showArrows && pages.length > 1) {
          var prevBtn = document.createElement("button");
          prevBtn.className = "wto-arrow wto-arrow-prev";
          prevBtn.innerHTML = "&#10094;";
          prevBtn.setAttribute("aria-label", "Previous logos");
          prevBtn.onclick = function () {
            currentPage = (currentPage - 1 + pages.length) % pages.length;
            renderSlidePage(currentPage);
            updateDots();
          };

          var nextBtn = document.createElement("button");
          nextBtn.className = "wto-arrow wto-arrow-next";
          nextBtn.innerHTML = "&#10095;";
          nextBtn.setAttribute("aria-label", "Next logos");
          nextBtn.onclick = function () {
            currentPage = (currentPage + 1) % pages.length;
            renderSlidePage(currentPage);
            updateDots();
          };

          sliderWrapper.appendChild(prevBtn);
          sliderWrapper.appendChild(nextBtn);
        }

        var dotsContainer = null;
        if (config.showDots && pages.length > 1) {
          dotsContainer = document.createElement("div");
          dotsContainer.className = "wto-dots";
          pages.forEach(function (_, pIdx) {
            var dot = document.createElement("button");
            dot.className = "wto-dot" + (pIdx === 0 ? " active" : "");
            dot.setAttribute("aria-label", "Page " + (pIdx + 1));
            dot.onclick = function () {
              currentPage = pIdx;
              renderSlidePage(currentPage);
              updateDots();
            };
            dotsContainer.appendChild(dot);
          });
        }

        function updateDots() {
          if (!dotsContainer) return;
          var dots = dotsContainer.querySelectorAll(".wto-dot");
          dots.forEach(function (d, idx) {
            if (idx === currentPage) d.classList.add("active");
            else d.classList.remove("active");
          });
        }

        // Autoplay loop
        if (config.autoplay && pages.length > 1) {
          var autoplayTimer = null;
          var startAutoplay = function () {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = setInterval(function () {
              currentPage = (currentPage + 1) % pages.length;
              renderSlidePage(currentPage);
              updateDots();
            }, Math.max(2, config.speed || 4) * 1000);
          };
          var stopAutoplay = function () {
            if (autoplayTimer) clearInterval(autoplayTimer);
          };

          startAutoplay();
          if (config.pauseOnHover) {
            root.addEventListener("mouseenter", stopAutoplay);
            root.addEventListener("mouseleave", startAutoplay);
          }
          if (config.pauseOnFocus) {
            root.addEventListener("focusin", stopAutoplay);
            root.addEventListener("focusout", startAutoplay);
          }
        }

        container.appendChild(sliderWrapper);
        if (dotsContainer) container.appendChild(dotsContainer);
      }

      root.appendChild(container);
      shadow.appendChild(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
