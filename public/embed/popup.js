/**
 * WebToolOcean Popup Widget Embed Runtime
 * Isolated via Shadow DOM, zero dependencies, framework-agnostic.
 *
 * Usage:
 * <script src="https://YOUR-DOMAIN/embed/popup.js" data-widget-id="WIDGET_ID" async></script>
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

  var widgetId = currentScript ? currentScript.getAttribute("data-widget-id") : "default";

  // Prevent multiple duplicate initializations of the same popup
  var globalLoadedKey = "__WTO_POPUP_" + widgetId + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_CONFIG = {
    title: "Special Offer! 🎉",
    description: "Get 20% off on your first order. Use code WELCOME20 at checkout.",
    imageUrl: "",
    primaryButtonText: "Shop Now",
    primaryButtonUrl: "#",
    openInNewTab: true,
    hasSecondaryButton: false,
    secondaryButtonText: "No Thanks",
    showCloseButton: true,
    closeOnOverlayClick: true,
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

    // 2. Check data-config attribute on script
    if (currentScript && currentScript.getAttribute("data-config")) {
      try {
        var parsed = JSON.parse(currentScript.getAttribute("data-config"));
        callback(Object.assign({}, DEFAULT_CONFIG, parsed));
        return;
      } catch (e) {
        console.warn("[WebToolOcean] Failed to parse script data-config", e);
      }
    }

    // 3. Fallback: try remote fetch endpoint if available, otherwise default
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
    // 1. Device Visibility
    var width = window.innerWidth;
    var isMobile = width < 640;
    var isTablet = width >= 640 && width < 1024;
    var isDesktop = width >= 1024;

    if (isMobile && cfg.showMobile === false) return false;
    if (isTablet && cfg.showTablet === false) return false;
    if (isDesktop && cfg.showDesktop === false) return false;

    // 2. Page Targeting
    var pathname = window.location.pathname || "/";
    if (cfg.pageTarget === "homepage" && pathname !== "/" && pathname !== "") {
      return false;
    }
    if (cfg.pageTarget === "custom") {
      if (cfg.excludedPaths) {
        var exList = cfg.excludedPaths.split(",").map(function (s) {
          return s.trim();
        });
        for (var i = 0; i < exList.length; i++) {
          if (exList[i] && pathname.indexOf(exList[i].replace("*", "")) !== -1) {
            return false;
          }
        }
      }
      if (cfg.includedPaths) {
        var inList = cfg.includedPaths.split(",").map(function (s) {
          return s.trim();
        });
        var matched = false;
        for (var j = 0; j < inList.length; j++) {
          if (inList[j] && pathname.indexOf(inList[j].replace("*", "")) !== -1) {
            matched = true;
            break;
          }
        }
        if (!matched) return false;
      }
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
      .overlay-dark { background: rgba(0, 0, 0, 0.6); }
      .overlay-light { background: rgba(255, 255, 255, 0.6); }
      .overlay-blur { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
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
        padding: ${cfg.padding || 24}px;
        text-align: ${cfg.textAlign || "center"};
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: ${cfg.width || 520}px;
        box-sizing: border-box;
        transform: scale(0.95);
        transition: transform ${(cfg.animationDuration || 300) / 1000}s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .wto-overlay.visible .wto-modal {
        transform: scale(1);
      }
      .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0,0,0,0.06);
        border: none;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: inherit;
        opacity: 0.8;
      }
      .close-btn:hover { opacity: 1; background: rgba(0,0,0,0.12); }
      .modal-img {
        width: 100%;
        max-height: 220px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 14px;
      }
      .modal-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }
      .modal-desc {
        font-size: 14px;
        line-height: 1.5;
        opacity: 0.9;
        margin: 0 0 18px 0;
      }
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

    // Image
    if (cfg.imageUrl) {
      var img = document.createElement("img");
      img.className = "modal-img";
      img.src = cfg.imageUrl;
      img.alt = cfg.title || "Popup banner";
      modal.appendChild(img);
    }

    // Title
    if (cfg.title) {
      var title = document.createElement("h2");
      title.className = "modal-title";
      title.textContent = cfg.title;
      modal.appendChild(title);
    }

    // Description
    if (cfg.description) {
      var desc = document.createElement("p");
      desc.className = "modal-desc";
      desc.textContent = cfg.description;
      modal.appendChild(desc);
    }

    // CTA Button
    if (cfg.primaryButtonText) {
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

    // Setup Trigger
    var trigger = cfg.triggerType || "load";
    var delayMs = (cfg.delaySeconds || 1) * 1000;

    if (trigger === "load" || trigger === "delay") {
      setTimeout(show, delayMs);
    } else if (trigger === "time-on-page") {
      setTimeout(show, (cfg.timeOnPageSeconds || 5) * 1000);
    } else if (trigger === "scroll") {
      var onScroll = function () {
        var h = document.documentElement;
        var b = document.body;
        var st = "scrollTop";
        var sh = "scrollHeight";
        var percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
        if (percent >= (cfg.scrollPercentage || 50)) {
          show();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll);
    } else if (trigger === "click") {
      if (cfg.clickSelector) {
        document.addEventListener("click", function (e) {
          if (e.target && e.target.closest(cfg.clickSelector)) {
            e.preventDefault();
            show();
          }
        });
      }
    } else if (trigger === "exit-intent") {
      var onMouseLeave = function (e) {
        if (e.clientY <= 0) {
          show();
          document.removeEventListener("mouseleave", onMouseLeave);
        }
      };
      document.addEventListener("mouseleave", onMouseLeave);
    }
  }

  resolveConfig(widgetId, initPopup);
})();
