/**
 * WebToolOcean Popup Widget Embed Runtime
 * Isolated via Shadow DOM, zero dependencies, framework-agnostic.
 * Supports 8+ distinct designs: Classic Center Modal, Image Hero Popup, Split Image & Content,
 * Discount Offer, Minimal Elegant, Newsletter Signup, Side Slide-In, Announcement Popup, etc.
 *
 * Usage:
 * <script src="https://cdn.widgets.webtoolocean.com/embed/popup.js" data-widget-id="WIDGET_ID" async></script>
 * OR:
 * <div class="wto-widget" data-widget="popup" data-id="WIDGET_ID"></div>
 * <script src="https://cdn.widgets.webtoolocean.com/embed/popup.js" async></script>
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
      document.querySelector('[data-widget="popup"][data-id]') ||
      document.querySelector('[data-widget-id]') ||
      document.querySelector('.wto-widget[data-widget="popup"]');
    if (container) {
      return container.getAttribute("data-id") || container.getAttribute("data-widget-id");
    }
    return "default";
  }

  var widgetId = getWidgetId();

  // Prevent multiple duplicate initializations of the same popup
  var globalLoadedKey = "__WTO_POPUP_" + widgetId + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_CONFIG = {
    templateId: "classic",
    title: "Special Offer! 🎉",
    description: "Get 20% off on your first order. Use code WELCOME20 at checkout.",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    imageAlt: "Special gift offer",
    imagePosition: "top",
    primaryButtonText: "Shop Now",
    primaryButtonUrl: "#",
    openInNewTab: true,
    hasSecondaryButton: false,
    secondaryButtonText: "No Thanks",
    secondaryButtonUrl: "#",
    showCloseButton: true,
    closeOnOverlayClick: true,
    couponCode: "WELCOME20",
    discountBadge: "20% OFF",
    disclaimerText: "*Valid for new customers on orders over $50",
    footerText: "*Valid for new customers on orders over $50",
    emailPlaceholder: "Enter your email address...",
    newsletterButtonText: "Subscribe Now",
    successMessage: "Thank you for subscribing! Check your inbox.",
    position: "center",
    size: "medium",
    width: 520,
    borderRadius: 16,
    padding: 24,
    bgColor: "#FFFFFF",
    textColor: "#111827",
    primaryButtonBg: "#8B5CF6",
    primaryButtonTextColor: "#FFFFFF",
    secondaryButtonBg: "#F3F4F6",
    secondaryButtonTextColor: "#374151",
    textAlign: "center",
    overlayStyle: "dark",
    triggerType: "load",
    delaySeconds: 1,
    scrollPercentage: 50,
    clickSelector: ".open-popup-btn",
    timeOnPageSeconds: 5,
    pageTarget: "all",
    showDesktop: true,
    showTablet: true,
    showMobile: true,
    frequency: "always",
    enableScheduling: false,
    entryAnimation: "zoom",
    animationDuration: 300,
    zIndex: 99999,
  };

  function resolveConfig(id, callback) {
    // 1. Check window.WTO_POPUP_CONFIGS
    if (window.WTO_POPUP_CONFIGS && window.WTO_POPUP_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_POPUP_CONFIGS[id]));
      return;
    }

    // 2. Check window.WTO_DEMO_CONFIG
    if (window.WTO_DEMO_CONFIG && window.WTO_DEMO_CONFIG[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_DEMO_CONFIG[id]));
      return;
    }

    // 3. Check data-config attribute on script
    if (currentScript && currentScript.getAttribute("data-config")) {
      try {
        var parsed = JSON.parse(currentScript.getAttribute("data-config"));
        callback(Object.assign({}, DEFAULT_CONFIG, parsed));
        return;
      } catch (e) {
        console.warn("[WebToolOcean] Failed to parse script data-config", e);
      }
    }

    // 4. Check localStorage saved widgets
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
      // localStorage unavailable or restricted
    }

    // 5. Fallback: try remote fetch endpoint if available
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

  function shouldDisplay(cfg) {
    // 1. Device Targeting
    var width = window.innerWidth;
    var isMobile = width < 640;
    var isTablet = width >= 640 && width < 1024;
    var isDesktop = width >= 1024;

    if (isMobile && cfg.showMobile === false) return false;
    if (isTablet && cfg.showTablet === false) return false;
    if (isDesktop && cfg.showDesktop === false) return false;

    // 2. Page Targeting
    if (cfg.pageTarget === "homepage") {
      var path = window.location.pathname;
      if (path !== "/" && path !== "") return false;
    }

    // 3. Frequency Rules
    var storageKey = "wto_popup_" + widgetId;
    if (cfg.frequency === "session") {
      if (sessionStorage.getItem(storageKey + "_session")) return false;
    } else if (cfg.frequency === "daily") {
      var lastDaily = localStorage.getItem(storageKey + "_daily");
      if (lastDaily && Date.now() - parseInt(lastDaily, 10) < 24 * 60 * 60 * 1000) {
        return false;
      }
    } else if (cfg.frequency === "weekly") {
      var lastWeekly = localStorage.getItem(storageKey + "_weekly");
      if (lastWeekly && Date.now() - parseInt(lastWeekly, 10) < 7 * 24 * 60 * 60 * 1000) {
        return false;
      }
    } else if (cfg.frequency === "once") {
      if (localStorage.getItem(storageKey + "_once")) return false;
    }

    // 4. Scheduling
    if (cfg.enableScheduling) {
      var now = Date.now();
      if (cfg.startDate && now < new Date(cfg.startDate).getTime()) return false;
      if (cfg.endDate && now > new Date(cfg.endDate).getTime()) return false;
    }

    return true;
  }

  function markDismissed(cfg) {
    var storageKey = "wto_popup_" + widgetId;
    if (cfg.frequency === "session") {
      sessionStorage.setItem(storageKey + "_session", "1");
    } else if (cfg.frequency === "daily") {
      localStorage.setItem(storageKey + "_daily", Date.now().toString());
    } else if (cfg.frequency === "weekly") {
      localStorage.setItem(storageKey + "_weekly", Date.now().toString());
    } else if (cfg.frequency === "once") {
      localStorage.setItem(storageKey + "_once", "1");
    }
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initPopup(cfg) {
    if (!shouldDisplay(cfg)) return;

    var host = document.createElement("div");
    host.id = "wto-popup-host-" + widgetId;
    document.body.appendChild(host);

    var shadow = host.attachShadow({ mode: "open" });

    // Stylesheet inside Shadow DOM
    var style = document.createElement("style");
    style.textContent = `
      :host {
        all: initial;
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        color: #0f172a;
        box-sizing: border-box;
      }
      *, *::before, *::after {
        box-sizing: inherit;
      }
      .wto-overlay {
        position: fixed;
        inset: 0;
        z-index: ${cfg.zIndex || 99999};
        display: flex;
        opacity: 0;
        pointer-events: none;
        transition: opacity ${(cfg.animationDuration || 300) / 1000}s ease;
      }
      .wto-overlay.visible {
        opacity: 1;
        pointer-events: auto;
      }
      .overlay-dark { background: rgba(0, 0, 0, 0.65); }
      .overlay-light { background: rgba(255, 255, 255, 0.7); }
      .overlay-blur { background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      .overlay-none { background: transparent; pointer-events: none; }

      .pos-center { align-items: center; justify-content: center; padding: 16px; }
      .pos-top { align-items: flex-start; justify-content: center; padding: 24px 16px; }
      .pos-bottom { align-items: flex-end; justify-content: center; padding: 24px 16px; }
      .pos-left { align-items: center; justify-content: flex-start; padding: 16px 24px; }
      .pos-right { align-items: center; justify-content: flex-end; padding: 16px 24px; }
      .pos-bottom-right { align-items: flex-end; justify-content: flex-end; padding: 20px; }
      .pos-bottom-left { align-items: flex-end; justify-content: flex-start; padding: 20px; }

      .wto-modal {
        pointer-events: auto;
        position: relative;
        background: ${cfg.bgColor || "#FFFFFF"};
        color: ${cfg.textColor || "#111827"};
        border-radius: ${cfg.borderRadius || 16}px;
        padding: ${cfg.padding || 28}px;
        text-align: ${cfg.textAlign || "center"};
        box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.25), 0 10px 15px -5px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: ${cfg.width || 520}px;
        box-sizing: border-box;
        transform: scale(0.95);
        transition: transform ${(cfg.animationDuration || 300) / 1000}s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      .wto-overlay.visible .wto-modal {
        transform: scale(1);
      }

      /* Slide-In Animation override */
      .pos-bottom-right .wto-modal,
      .pos-bottom-left .wto-modal {
        transform: translateY(20px);
      }
      .wto-overlay.visible .pos-bottom-right .wto-modal,
      .wto-overlay.visible .pos-bottom-left .wto-modal {
        transform: translateY(0);
      }

      .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0,0,0,0.06);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: inherit;
        opacity: 0.8;
        z-index: 30;
        font-size: 14px;
        line-height: 1;
        transition: all 0.15s ease;
      }
      .close-btn:hover {
        opacity: 1;
        background: rgba(0,0,0,0.12);
        transform: scale(1.05);
      }

      /* Default Modal Banner Image */
      .modal-img {
        display: block;
        width: 100%;
        max-height: 220px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 16px;
      }

      /* Hero Image Style (full-bleed top) */
      .hero-img {
        display: block;
        width: calc(100% + ${((cfg.padding || 28) * 2)}px);
        margin: -${cfg.padding || 28}px -${cfg.padding || 28}px 18px -${cfg.padding || 28}px;
        max-height: 240px;
        object-fit: cover;
        border-top-left-radius: ${cfg.borderRadius || 16}px;
        border-top-right-radius: ${cfg.borderRadius || 16}px;
      }

      /* Split Layout (Two columns on desktop) */
      .split-container {
        display: flex;
        gap: 20px;
        text-align: left;
      }
      .split-img-box {
        flex: 1;
        min-width: 45%;
        margin: -${cfg.padding || 24}px 0 -${cfg.padding || 24}px -${cfg.padding || 24}px;
      }
      .split-img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 260px;
        object-fit: cover;
        border-top-left-radius: ${cfg.borderRadius || 18}px;
        border-bottom-left-radius: ${cfg.borderRadius || 18}px;
      }
      .split-content {
        flex: 1.2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 8px 0;
      }
      @media (max-width: 640px) {
        .split-container {
          flex-direction: column;
          text-align: center;
        }
        .split-img-box {
          margin: -${cfg.padding || 24}px -${cfg.padding || 24}px 16px -${cfg.padding || 24}px;
          min-width: 100%;
        }
        .split-img {
          height: 180px;
          border-bottom-left-radius: 0;
          border-top-right-radius: ${cfg.borderRadius || 18}px;
        }
      }

      /* Typography */
      .modal-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }
      .modal-desc {
        font-size: 14px;
        line-height: 1.55;
        opacity: 0.9;
        margin: 0 0 18px 0;
      }

      /* Discount Badge & Coupon Box */
      .discount-badge {
        display: inline-block;
        padding: 4px 12px;
        background: #fef3c7;
        color: #b45309;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 9999px;
        margin-bottom: 12px;
        border: 1px solid #fde68a;
      }
      .coupon-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f8fafc;
        border: 1px dashed #cbd5e1;
        border-radius: 10px;
        padding: 10px 14px;
        margin: 0 0 16px 0;
      }
      .coupon-code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        font-size: 14px;
        color: #0f172a;
        letter-spacing: 0.06em;
      }
      .coupon-copy-btn {
        background: #7c3aed;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .coupon-copy-btn:hover {
        background: #6d28d9;
      }

      /* Buttons */
      .cta-btn {
        display: inline-block;
        width: 100%;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        background: ${cfg.primaryButtonBg || "#8B5CF6"};
        color: ${cfg.primaryButtonTextColor || "#FFFFFF"};
        box-sizing: border-box;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      .cta-btn:hover {
        opacity: 0.92;
        transform: translateY(-1px);
      }
      .secondary-btn {
        display: inline-block;
        width: 100%;
        padding: 10px 16px;
        margin-top: 8px;
        font-size: 13px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        cursor: pointer;
        background: ${cfg.secondaryButtonBg || "#F3F4F6"};
        color: ${cfg.secondaryButtonTextColor || "#374151"};
        box-sizing: border-box;
      }
      .secondary-btn:hover {
        background: #e2e8f0;
      }

      /* Newsletter Form */
      .newsletter-form {
        display: flex;
        gap: 8px;
        margin: 0 0 12px 0;
      }
      .newsletter-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 13px;
        outline: none;
      }
      .newsletter-input:focus {
        border-color: #7c3aed;
      }
      .newsletter-btn {
        padding: 10px 18px;
        background: ${cfg.primaryButtonBg || "#8B5CF6"};
        color: ${cfg.primaryButtonTextColor || "#FFFFFF"};
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
      }
      .newsletter-success {
        padding: 10px;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 12px;
      }

      /* Footer disclaimer */
      .modal-footer-text {
        font-size: 11px;
        color: #64748b;
        margin: 12px 0 0 0;
        opacity: 0.8;
      }

      ${cfg.customCss || ""}
    `;
    shadow.appendChild(style);

    var overlay = document.createElement("div");
    overlay.className =
      "wto-overlay overlay-" +
      (cfg.overlayStyle || "dark") +
      " pos-" +
      (cfg.position || "center");

    var modal = document.createElement("div");
    modal.className = "wto-modal " + (cfg.customClass || "");

    // Close button
    if (cfg.showCloseButton !== false) {
      var closeBtn = document.createElement("button");
      closeBtn.className = "close-btn";
      closeBtn.innerHTML = "✕";
      closeBtn.setAttribute("aria-label", "Close popup");
      closeBtn.onclick = function (e) {
        e.stopPropagation();
        dismiss();
      };
      modal.appendChild(closeBtn);
    }

    var tmpl = cfg.templateId || "classic";

    // ─────────────────────────────────────────────────────────────
    // RENDER ACCORDING TO DESIGN TEMPLATE
    // ─────────────────────────────────────────────────────────────
    if (tmpl === "split") {
      var splitWrap = document.createElement("div");
      splitWrap.className = "split-container";

      // Left column: Image
      if (cfg.imageUrl) {
        var imgBox = document.createElement("div");
        imgBox.className = "split-img-box";
        var splitImg = document.createElement("img");
        splitImg.className = "split-img";
        splitImg.src = cfg.imageUrl;
        splitImg.alt = cfg.imageAlt || cfg.title || "Offer image";
        imgBox.appendChild(splitImg);
        splitWrap.appendChild(imgBox);
      }

      // Right column: Content
      var splitContent = document.createElement("div");
      splitContent.className = "split-content";

      if (cfg.discountBadge) {
        var badge = document.createElement("span");
        badge.className = "discount-badge";
        badge.textContent = cfg.discountBadge;
        splitContent.appendChild(badge);
      }

      if (cfg.title) {
        var sTitle = document.createElement("h2");
        sTitle.className = "modal-title";
        sTitle.textContent = cfg.title;
        splitContent.appendChild(sTitle);
      }

      if (cfg.description) {
        var sDesc = document.createElement("p");
        sDesc.className = "modal-desc";
        sDesc.textContent = cfg.description;
        splitContent.appendChild(sDesc);
      }

      if (cfg.primaryButtonText) {
        var sBtn = document.createElement("a");
        sBtn.className = "cta-btn";
        sBtn.textContent = cfg.primaryButtonText;
        sBtn.href = cfg.primaryButtonUrl || "#";
        if (cfg.openInNewTab) sBtn.target = "_blank";
        sBtn.onclick = function () { dismiss(); };
        splitContent.appendChild(sBtn);
      }

      splitWrap.appendChild(splitContent);
      modal.appendChild(splitWrap);
    } else {
      // Non-split designs: Hero, Discount, Minimal, Newsletter, Slide-in, Announcement, Classic

      // 1. Image
      if (cfg.imageUrl && tmpl !== "custom-html") {
        var img = document.createElement("img");
        img.className = tmpl === "hero-image" ? "hero-img" : "modal-img";
        img.src = cfg.imageUrl;
        img.alt = cfg.imageAlt || cfg.title || "Popup image";
        img.onerror = function () {
          img.style.display = "none";
        };
        modal.appendChild(img);
      }

      // 2. Discount Badge (if discount offer or configured)
      if (cfg.discountBadge && (tmpl === "discount" || tmpl === "classic")) {
        var dBadge = document.createElement("span");
        dBadge.className = "discount-badge";
        dBadge.textContent = cfg.discountBadge;
        modal.appendChild(dBadge);
      }

      // 3. Title
      if (cfg.title && tmpl !== "custom-html") {
        var title = document.createElement("h2");
        title.className = "modal-title";
        title.textContent = cfg.title;
        modal.appendChild(title);
      }

      // 4. Description
      if (cfg.description && tmpl !== "custom-html") {
        var desc = document.createElement("p");
        desc.className = "modal-desc";
        desc.textContent = cfg.description;
        modal.appendChild(desc);
      }

      // 5. Coupon Code Box (Discount Offer design)
      if (cfg.couponCode && (tmpl === "discount" || tmpl === "classic")) {
        var couponBox = document.createElement("div");
        couponBox.className = "coupon-box";

        var codeSpan = document.createElement("span");
        codeSpan.className = "coupon-code";
        codeSpan.textContent = cfg.couponCode;
        couponBox.appendChild(codeSpan);

        var copyBtn = document.createElement("button");
        copyBtn.className = "coupon-copy-btn";
        copyBtn.textContent = "COPY";
        copyBtn.type = "button";
        copyBtn.onclick = function (e) {
          e.stopPropagation();
          try {
            navigator.clipboard.writeText(cfg.couponCode || "");
            copyBtn.textContent = "COPIED!";
            setTimeout(function () { copyBtn.textContent = "COPY"; }, 2000);
          } catch (err) {
            copyBtn.textContent = "COPIED!";
          }
        };
        couponBox.appendChild(copyBtn);
        modal.appendChild(couponBox);
      }

      // 6. Newsletter Email Capture
      if (tmpl === "newsletter") {
        var form = document.createElement("form");
        form.className = "newsletter-form";
        form.onsubmit = function (e) {
          e.preventDefault();
          var input = form.querySelector(".newsletter-input");
          if (!input || !input.value || input.value.indexOf("@") === -1) return;
          var succ = document.createElement("div");
          succ.className = "newsletter-success";
          succ.textContent = "✓ " + (cfg.successMessage || "Subscribed successfully!");
          form.parentNode.insertBefore(succ, form);
          form.style.display = "none";
        };

        var emailInput = document.createElement("input");
        emailInput.className = "newsletter-input";
        emailInput.type = "email";
        emailInput.placeholder = cfg.emailPlaceholder || "Enter your email...";
        emailInput.required = true;
        form.appendChild(emailInput);

        var subBtn = document.createElement("button");
        subBtn.className = "newsletter-btn";
        subBtn.type = "submit";
        subBtn.textContent = cfg.newsletterButtonText || "Subscribe";
        form.appendChild(subBtn);

        modal.appendChild(form);
      }

      // 7. Primary CTA Button
      if (cfg.primaryButtonText && tmpl !== "newsletter") {
        var btn = document.createElement("a");
        btn.className = "cta-btn";
        btn.textContent = cfg.primaryButtonText;
        btn.href = cfg.primaryButtonUrl || "#";
        if (cfg.openInNewTab) {
          btn.target = "_blank";
          btn.rel = "noopener noreferrer";
        }
        btn.onclick = function () {
          dismiss();
        };
        modal.appendChild(btn);
      }

      // 8. Secondary Button (if enabled)
      if (cfg.hasSecondaryButton && cfg.secondaryButtonText) {
        var secBtn = document.createElement("a");
        secBtn.className = "secondary-btn";
        secBtn.textContent = cfg.secondaryButtonText;
        secBtn.href = cfg.secondaryButtonUrl || "#";
        secBtn.onclick = function (e) {
          e.preventDefault();
          dismiss();
        };
        modal.appendChild(secBtn);
      }

      // 9. Disclaimer / Footer Text
      var footer = cfg.disclaimerText || cfg.footerText;
      if (footer && tmpl !== "custom-html") {
        var foot = document.createElement("p");
        foot.className = "modal-footer-text";
        foot.textContent = footer;
        modal.appendChild(foot);
      }
    }

    overlay.appendChild(modal);

    if (cfg.closeOnOverlayClick) {
      overlay.onclick = function (e) {
        if (e.target === overlay) dismiss();
      };
    }

    shadow.appendChild(overlay);

    function show() {
      overlay.classList.add("visible");
    }

    function dismiss() {
      overlay.classList.remove("visible");
      markDismissed(cfg);
      setTimeout(function () {
        if (host.parentNode) host.parentNode.removeChild(host);
      }, (cfg.animationDuration || 300) + 100);
    }

    // ─────────────────────────────────────────────────────────────
    // DISPLAY TRIGGERS
    // ─────────────────────────────────────────────────────────────
    if (cfg.triggerType === "load") {
      setTimeout(show, (cfg.delaySeconds || 0) * 1000);
    } else if (cfg.triggerType === "delay") {
      setTimeout(show, (cfg.delaySeconds || 2) * 1000);
    } else if (cfg.triggerType === "scroll") {
      var triggered = false;
      var onScroll = function () {
        if (triggered) return;
        var scrollPos = window.scrollY || window.pageYOffset;
        var docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          var pct = (scrollPos / docHeight) * 100;
          if (pct >= (cfg.scrollPercentage || 50)) {
            triggered = true;
            window.removeEventListener("scroll", onScroll);
            show();
          }
        }
      };
      window.addEventListener("scroll", onScroll);
    } else if (cfg.triggerType === "exit-intent") {
      var exitTriggered = false;
      var onMouseLeave = function (e) {
        if (exitTriggered) return;
        if (e.clientY <= 10) {
          exitTriggered = true;
          document.removeEventListener("mouseleave", onMouseLeave);
          show();
        }
      };
      document.addEventListener("mouseleave", onMouseLeave);
    } else if (cfg.triggerType === "click") {
      if (cfg.clickSelector) {
        document.addEventListener("click", function (e) {
          var target = e.target;
          if (target && target.matches && target.matches(cfg.clickSelector)) {
            e.preventDefault();
            show();
          }
        });
      }
    } else {
      setTimeout(show, 1000);
    }
  }

  // Execution entry point
  function boot() {
    resolveConfig(widgetId, function (cfg) {
      initPopup(cfg);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
