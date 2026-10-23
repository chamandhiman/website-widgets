/**
 * WebToolOcean WhatsApp Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 *
 * Usage:
 * <script src="https://YOUR-DOMAIN/embed/whatsapp.js" data-widget-id="WIDGET_ID" async></script>
 */
(function () {
  "use strict";

  // Prevent multiple initializations for the same script instance
  if (window.__WTO_WHATSAPP_LOADED__) return;
  window.__WTO_WHATSAPP_LOADED__ = true;

  // Locate the executing script tag to extract data-widget-id
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

  // Default configuration fallback
  var DEFAULT_CONFIG = {
    phone: "9876543210",
    countryCode: "IN",
    callingCode: "91",
    agentName: "Support Team",
    agentRole: "Customer Care",
    agentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    showAgent: true,
    welcomeMessage: "Hi there! 👋\nHow can we help you today?",
    buttonText: "Chat on WhatsApp",
    prefilledMessage: "Hello, I would like to inquire about your services.",
    position: "bottom-right",
    primaryColor: "#25D366",
    buttonSize: "medium",
    buttonIcon: "whatsapp",
    borderRadius: 16,
    spacing: 20,
    showChatPopup: true,
    autoOpenGreeting: false,
    greetingDelay: 3,
    displayDelay: 0,
    openInNewTab: true,
    zIndex: 99999,
  };

  // Resolve configuration from:
  // 1. window.WTO_WIDGET_CONFIGS[widgetId] (inline script config)
  // 2. data-config attribute on <script>
  // 3. localStorage (if running in local dev / same origin)
  // 4. Fallback default
  function resolveConfig(id, callback) {
    if (window.WTO_WIDGET_CONFIGS && window.WTO_WIDGET_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_WIDGET_CONFIGS[id]));
      return;
    }

    if (currentScript && currentScript.getAttribute("data-config")) {
      try {
        var inlineCfg = JSON.parse(currentScript.getAttribute("data-config"));
        callback(Object.assign({}, DEFAULT_CONFIG, inlineCfg));
        return;
      } catch (e) {
        console.warn("[WebToolOcean] Failed to parse script data-config", e);
      }
    }

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        var localSaved = localStorage.getItem("wto.savedWidgets");
        if (localSaved) {
          var list = JSON.parse(localSaved);
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === id && list[i].config) {
              callback(Object.assign({}, DEFAULT_CONFIG, list[i].config));
              return;
            }
          }
        }
      }
    } catch (e) {
      // LocalStorage access may be restricted in cross-origin iframes
    }

    // Default configuration fallback
    callback(DEFAULT_CONFIG);
  }

  function createWhatsAppWidget(config) {
    var hostDiv = document.createElement("div");
    hostDiv.id = "wto-whatsapp-container-" + (widgetId || "default");
    document.body.appendChild(hostDiv);

    // Attach Shadow DOM for style isolation
    var shadow = hostDiv.attachShadow({ mode: "open" });

    // Styles scoped strictly within the shadow DOM
    var style = document.createElement("style");
    var isLeft = (config.position || "").indexOf("left") !== -1;
    var isTop = (config.position || "").indexOf("top") !== -1;
    var spacing = Math.max(12, Math.min(Number(config.spacing) || 20, 50));
    var radius = Math.max(0, Math.min(Number(config.borderRadius) || 16, 40));
    var zIndex = Number(config.zIndex) || 99999;
    var color = config.primaryColor || "#25D366";

    var fabSizes = {
      small: { fab: "48px", icon: "24px" },
      medium: { fab: "56px", icon: "30px" },
      large: { fab: "64px", icon: "34px" },
    };
    var currentSize = fabSizes[config.buttonSize] || fabSizes.medium;

    style.textContent = [
      ":host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }",
      ".wto-wrap {",
      "  position: fixed !important;",
      "  z-index: " + zIndex + " !important;",
      isTop ? "  top: " + spacing + "px !important;" : "  bottom: " + spacing + "px !important;",
      isLeft ? "  left: " + spacing + "px !important;" : "  right: " + spacing + "px !important;",
      "  display: flex;",
      "  flex-direction: " + (isTop ? "column-reverse" : "column") + ";",
      "  align-items: " + (isLeft ? "flex-start" : "flex-end") + ";",
      "  gap: 12px;",
      "  box-sizing: border-box;",
      "}",
      ".wto-fab {",
      "  width: " + currentSize.fab + ";",
      "  height: " + currentSize.fab + ";",
      "  border-radius: 9999px;",
      "  background: " + color + ";",
      "  color: #ffffff;",
      "  border: none;",
      "  outline: none;",
      "  cursor: pointer;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);",
      "  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;",
      "  position: relative;",
      "}",
      ".wto-fab:hover { transform: scale(1.08); box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3); }",
      ".wto-fab:active { transform: scale(0.95); }",
      ".wto-fab svg { width: " + currentSize.icon + "; height: " + currentSize.icon + "; fill: currentColor; }",
      ".wto-badge {",
      "  position: absolute;",
      "  top: -2px;",
      "  right: -2px;",
      "  width: 18px;",
      "  height: 18px;",
      "  border-radius: 9999px;",
      "  background: #ef4444;",
      "  color: #ffffff;",
      "  font-size: 11px;",
      "  font-weight: 700;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  border: 2px solid #ffffff;",
      "}",
      ".wto-card {",
      "  width: 300px;",
      "  max-width: calc(100vw - 32px);",
      "  background: #ffffff;",
      "  border-radius: " + radius + "px;",
      "  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);",
      "  overflow: hidden;",
      "  display: none;",
      "  flex-direction: column;",
      "  animation: wto-fade-in 0.2s ease-out;",
      "  border: 1px solid rgba(0, 0, 0, 0.08);",
      "}",
      ".wto-card.open { display: flex; }",
      "@keyframes wto-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }",
      ".wto-card-header {",
      "  background: " + color + ";",
      "  color: #ffffff;",
      "  padding: 14px;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "}",
      ".wto-agent-box { display: flex; align-items: center; gap: 10px; overflow: hidden; }",
      ".wto-avatar { width: 38px; height: 38px; border-radius: 9999px; border: 2px solid rgba(255,255,255,0.7); object-fit: cover; }",
      ".wto-agent-name { font-size: 14px; font-weight: 700; margin: 0; line-height: 1.2; }",
      ".wto-agent-role { font-size: 11px; opacity: 0.85; margin: 2px 0 0 0; }",
      ".wto-close-btn { background: none; border: none; color: #ffffff; cursor: pointer; padding: 4px; border-radius: 9999px; line-height: 0; opacity: 0.85; }",
      ".wto-close-btn:hover { opacity: 1; background: rgba(0,0,0,0.15); }",
      ".wto-card-body { background: #efeae2; padding: 14px; display: flex; flex-direction: column; gap: 12px; }",
      ".wto-bubble { background: #ffffff; padding: 10px 12px; border-radius: 12px; border-top-left-radius: 2px; font-size: 13px; color: #1e293b; line-height: 1.4; box-shadow: 0 1px 2px rgba(0,0,0,0.06); word-break: break-word; white-space: pre-line; }",
      ".wto-time { font-size: 10px; color: #94a3b8; text-align: right; margin-top: 4px; }",
      ".wto-action-btn {",
      "  background: " + color + ";",
      "  color: #ffffff;",
      "  padding: 10px 16px;",
      "  border-radius: 9999px;",
      "  text-decoration: none;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  gap: 8px;",
      "  font-size: 13px;",
      "  font-weight: 700;",
      "  box-shadow: 0 2px 6px rgba(0,0,0,0.12);",
      "  transition: filter 0.15s ease;",
      "}",
      ".wto-action-btn:hover { filter: brightness(1.08); }",
      ".wto-action-btn svg { width: 16px; height: 16px; fill: currentColor; }",
    ].join("\n");

    shadow.appendChild(style);

    // Normalize phone number: remove '+' and non-digits
    var cleanPhone = String(config.phone || "").replace(/\D/g, "");
    var callingCode = String(config.callingCode || "91").replace(/\D/g, "");
    if (!cleanPhone.startsWith(callingCode)) {
      cleanPhone = callingCode + cleanPhone;
    }
    var waUrl = "https://wa.me/" + cleanPhone;
    if (config.prefilledMessage) {
      waUrl += "?text=" + encodeURIComponent(config.prefilledMessage.trim());
    }

    var wrap = document.createElement("div");
    wrap.className = "wto-wrap";

    // Card element
    var card = document.createElement("div");
    card.className = "wto-card" + (config.showChatPopup ? " open" : "");

    // WhatsApp SVG icon string
    var waSvg =
      '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

    var closeSvg =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    var avatarHtml = config.agentAvatar
      ? '<img class="wto-avatar" src="' + config.agentAvatar + '" alt="' + (config.agentName || "Agent") + '" />'
      : "";

    var headerContent = config.showAgent
      ? '<div class="wto-agent-box">' +
        avatarHtml +
        '<div><p class="wto-agent-name">' + (config.agentName || "Support") + '</p><p class="wto-agent-role">' + (config.agentRole || "Online") + "</p></div>" +
        "</div>"
      : '<div class="wto-agent-box">' + waSvg + '<p class="wto-agent-name">WhatsApp Chat</p></div>';

    card.innerHTML =
      '<div class="wto-card-header">' +
      headerContent +
      '<button class="wto-close-btn" aria-label="Close">' + closeSvg + "</button>" +
      "</div>" +
      '<div class="wto-card-body">' +
      '<div class="wto-bubble">' + (config.welcomeMessage || "Hello! How can we help you?") + '<div class="wto-time">Just now</div></div>' +
      '<a class="wto-action-btn" href="' + waUrl + '" ' + (config.openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : "") + ">" +
      waSvg + "<span>" + (config.buttonText || "Chat on WhatsApp") + "</span>" +
      "</a>" +
      "</div>";

    // FAB button
    var fab = document.createElement("button");
    fab.className = "wto-fab";
    fab.setAttribute("aria-label", "Open WhatsApp Chat");
    fab.innerHTML = waSvg + (config.showChatPopup ? "" : '<span class="wto-badge">1</span>');

    // Toggle card visibility on FAB click
    fab.addEventListener("click", function () {
      var isOpen = card.classList.toggle("open");
      var badge = fab.querySelector(".wto-badge");
      if (isOpen && badge) badge.remove();
    });

    // Close button event
    card.querySelector(".wto-close-btn").addEventListener("click", function () {
      card.classList.remove("open");
    });

    wrap.appendChild(card);
    wrap.appendChild(fab);

    // Apply display delay if configured
    var displayDelay = Math.max(0, Number(config.displayDelay) || 0) * 1000;
    if (displayDelay > 0) {
      wrap.style.display = "none";
      setTimeout(function () {
        wrap.style.display = "flex";
      }, displayDelay);
    }

    // Auto-open greeting delay if enabled
    var greetingDelay = Math.max(0, Number(config.greetingDelay) || 0) * 1000;
    if (config.autoOpenGreeting && greetingDelay > 0) {
      setTimeout(function () {
        card.classList.add("open");
      }, displayDelay + greetingDelay);
    }

    shadow.appendChild(wrap);
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      resolveConfig(widgetId, createWhatsAppWidget);
    });
  } else {
    resolveConfig(widgetId, createWhatsAppWidget);
  }
})();
