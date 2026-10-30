/**
 * WebToolOcean Countdown Timer Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 * Supports 6 distinct designs: Modern Cards, Minimal, Circular Timer, Flip Clock, Banner, Elegant.
 *
 * Usage:
 * <script src="https://cdn.widgets.webtoolocean.com/embed/countdown.js" data-widget-id="WIDGET_ID" async></script>
 * OR:
 * <div class="wto-widget" data-widget="countdown" data-id="WIDGET_ID"></div>
 * <script src="https://cdn.widgets.webtoolocean.com/embed/countdown.js" async></script>
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

  var globalLoadedKey = "__WTO_COUNTDOWN_" + (widgetId || "default") + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_CONFIG = {
    designId: "cards",
    title: "Limited Time Offer Ends In",
    target: "2027-12-31T23:59",
    timezone: "Local",
    expiryMessage: "This offer has ended.",
    expireAction: "message",
    style: "Boxes",
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    width: 720,
    radius: 16,
    padding: 24,
    accent: "#7c3aed",
    bg: "#ffffff",
    text: "#0f172a",
    boxBg: "#7c3aed",
    boxText: "#ffffff",
    align: "center",
    bannerCtaText: "Claim Offer",
    bannerCtaLink: "https://example.com/deal",
    bannerBadge: "Special Promotion",
  };

  function fetchConfig(id, callback) {
    if (window.WTO_COUNTDOWN_CONFIGS && id && window.WTO_COUNTDOWN_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_COUNTDOWN_CONFIGS[id]));
      return;
    }

    if (window.WTO_DEMO_CONFIG && id && window.WTO_DEMO_CONFIG[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_DEMO_CONFIG[id]));
      return;
    }

    try {
      var raw = localStorage.getItem("wto.savedWidgets");
      if (raw) {
        var list = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === id && list[i].config) {
              callback(Object.assign({}, DEFAULT_CONFIG, list[i].config));
              return;
            }
          }
        }
      }
    } catch (e) {}

    // Check if any WTO_DEMO_CONFIG has single entry if id was not provided
    if (!id && window.WTO_DEMO_CONFIG) {
      var keys = Object.keys(window.WTO_DEMO_CONFIG);
      if (keys.length > 0) {
        callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_DEMO_CONFIG[keys[0]]));
        return;
      }
    }

    callback(DEFAULT_CONFIG);
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function parseTarget(targetStr, timezone) {
    if (!targetStr || typeof targetStr !== "string") return NaN;
    var str = targetStr.trim();
    if (!str) return NaN;

    var isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(str);
    var normalizedStr = isDateOnly ? str + "T23:59:59" : str;

    var isUtc = timezone && String(timezone).toUpperCase() === "UTC";

    if (isUtc) {
      if (!normalizedStr.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(normalizedStr)) {
        var parsed = Date.parse(normalizedStr + "Z");
        if (!isNaN(parsed)) return parsed;
      }
    }

    var timestamp = new Date(normalizedStr).getTime();
    return isNaN(timestamp) ? NaN : timestamp;
  }

  function calculateRemaining(targetTimestamp, now) {
    if (isNaN(targetTimestamp)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isValid: false };
    }

    var diffMs = targetTimestamp - now;
    if (diffMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isValid: true };
    }

    var totalSeconds = Math.floor(diffMs / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      isExpired: false,
      isValid: true,
    };
  }

  function pad(num) {
    return String(num).length < 2 ? "0" + num : String(num);
  }

  function renderWidget(config) {
    var container = null;
    if (widgetId) {
      container =
        document.querySelector('.wto-widget[data-widget="countdown"][data-id="' + widgetId + '"]') ||
        document.getElementById("wto-countdown-" + widgetId);
    }
    if (!container) {
      container = document.querySelector('.wto-widget[data-widget="countdown"]:not([data-rendered])');
    }

    var hostDiv = document.createElement("div");
    hostDiv.className = "wto-countdown-widget-host";
    hostDiv.id = "wto-countdown-host-" + (widgetId || "default");

    if (container) {
      container.setAttribute("data-rendered", "true");
      container.appendChild(hostDiv);
    } else if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.insertBefore(hostDiv, currentScript.nextSibling);
    } else {
      document.body.appendChild(hostDiv);
    }

    var root = hostDiv.attachShadow ? hostDiv.attachShadow({ mode: "open" }) : hostDiv;

    var style = document.createElement("style");
    style.textContent = [
      ":host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: block; box-sizing: border-box; width: 100%; }",
      "*, *::before, *::after { box-sizing: border-box; }",
      ".wto-countdown-card { width: 100%; margin: 0 auto; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05); transition: all 0.2s ease; }",
      ".wto-countdown-title { font-size: 20px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3; }",
      ".wto-countdown-grid { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }",
      ".wto-countdown-item { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 68px; }",
      ".wto-countdown-box { border-radius: 12px; padding: 12px 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }",
      ".wto-countdown-num { font-size: 30px; font-weight: 800; line-height: 1.1; font-variant-numeric: tabular-nums; }",
      ".wto-countdown-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }",
      ".wto-countdown-expired { display: inline-block; padding: 16px 24px; border-radius: 12px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.06); font-size: 18px; font-weight: 700; }",
      ".wto-countdown-invalid { padding: 14px 20px; border-radius: 10px; background: rgba(239,68,68,0.08); color: #dc2626; font-size: 14px; font-weight: 500; }",
      /* Circular */
      ".wto-circular-ring { display: flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 9999px; border: 3px solid; }",
      /* Flip clock */
      ".wto-flip-card { position: relative; min-width: 68px; height: 60px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.25); }",
      ".wto-flip-seam { position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: rgba(0,0,0,0.7); z-index: 10; }",
      /* Banner */
      ".wto-banner-layout { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; width: 100%; }",
      ".wto-banner-btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; text-decoration: none; transition: opacity 0.2s; white-space: nowrap; }",
      ".wto-banner-btn:hover { opacity: 0.9; }",
      /* Elegant */
      ".wto-elegant { font-family: Georgia, Cambria, 'Times New Roman', Times, serif; }",
      "@media (max-width: 600px) {",
      "  .wto-countdown-grid { gap: 8px; justify-content: center !important; }",
      "  .wto-countdown-item { min-width: 54px; }",
      "  .wto-countdown-box { padding: 8px 10px; }",
      "  .wto-countdown-num { font-size: 22px; }",
      "  .wto-countdown-label { font-size: 9px; }",
      "  .wto-circular-ring { width: 56px; height: 56px; }",
      "  .wto-flip-card { min-width: 54px; height: 50px; }",
      "  .wto-banner-layout { flex-direction: column; text-align: center; justify-content: center; }",
      "}",
    ].join("\n");
    root.appendChild(style);

    var wrapper = document.createElement("div");
    root.appendChild(wrapper);

    var targetMs = parseTarget(config.target, config.timezone);
    var timerId = null;

    function update() {
      var now = Date.now();
      var remaining = calculateRemaining(targetMs, now);

      var design = config.designId || (config.style === "Minimal" ? "minimal" : "cards");
      var maxW = Number(config.width) ? config.width + "px" : "100%";
      var rad = Number(config.radius) || 16;
      var padY = Number(config.padding) || 24;
      var bg = config.bg || "#ffffff";
      var textColor = config.text || "#0f172a";
      var accent = config.accent || "#7c3aed";
      var boxBg = config.boxBg || accent;
      var boxTextColor = config.boxText || "#ffffff";
      var align = config.align === "left" ? "left" : "center";

      if (remaining.isExpired && config.expireAction === "hide") {
        wrapper.innerHTML = "";
        if (timerId) { clearInterval(timerId); timerId = null; }
        return;
      }

      var cardClass = "wto-countdown-card" + (design === "elegant" ? " wto-elegant" : "");
      var html = '<div class="' + cardClass + '" style="max-width: ' +
        escapeHtml(maxW) +
        "; border-radius: " +
        rad +
        "px; padding: " +
        padY +
        "px; background-color: " +
        escapeHtml(bg) +
        "; color: " +
        escapeHtml(textColor) +
        "; text-align: " +
        align +
        ';">';

      if (design !== "banner" && config.title && String(config.title).trim()) {
        html += '<h3 class="wto-countdown-title" style="color: ' +
          escapeHtml(textColor) +
          ';">' +
          escapeHtml(config.title) +
          "</h3>";
      }

      if (!remaining.isValid) {
        html += '<div class="wto-countdown-invalid">Please set a valid target date and time.</div>';
      } else if (remaining.isExpired) {
        var msg = config.expiryMessage ? String(config.expiryMessage).trim() : "This offer has ended.";
        html += '<div class="wto-countdown-expired" style="color: ' +
          escapeHtml(accent) +
          '; border-radius: ' +
          Math.min(rad, 16) +
          'px;">' +
          escapeHtml(msg) +
          "</div>";
      } else {
        var units = [];
        if (config.showDays !== false) units.push({ label: "Days", val: remaining.days });
        if (config.showHours !== false) units.push({ label: "Hours", val: remaining.hours });
        if (config.showMinutes !== false) units.push({ label: "Minutes", val: remaining.minutes });
        if (config.showSeconds !== false) units.push({ label: "Seconds", val: remaining.seconds });

        var justify = align === "left" ? "flex-start" : "center";

        if (design === "banner") {
          html += '<div class="wto-banner-layout">';
          html += '<div style="display: flex; align-items: center; gap: 8px; truncate">';
          if (config.bannerBadge) {
            html += '<span style="background-color: ' + escapeHtml(accent) + '; color: ' + escapeHtml(bg) + '; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase;">' + escapeHtml(config.bannerBadge) + '</span>';
          }
          html += '<span style="font-weight: 700; font-size: 14px;">' + escapeHtml(config.title || "Limited Time Offer") + '</span>';
          html += '</div>';

          html += '<div style="display: flex; align-items: center; gap: 6px;">';
          for (var b = 0; b < units.length; b++) {
            html += '<div style="background-color: ' + escapeHtml(boxBg) + '; color: ' + escapeHtml(boxTextColor) + '; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 13px; font-family: monospace;">';
            html += pad(units[b].val) + ' <span style="font-size: 9px; opacity: 0.7;">' + escapeHtml(units[b].label[0]) + '</span>';
            html += '</div>';
          }
          html += '</div>';

          var ctaLink = config.bannerCtaLink || "#";
          var ctaText = config.bannerCtaText || "Claim Offer";
          html += '<a href="' + escapeHtml(ctaLink) + '" class="wto-banner-btn" style="background-color: ' + escapeHtml(accent) + '; color: ' + escapeHtml(bg) + ';">' + escapeHtml(ctaText) + '</a>';
          html += '</div>';
        } else if (design === "circular") {
          html += '<div class="wto-countdown-grid" style="justify-content: ' + justify + '; gap: 16px;">';
          for (var c = 0; c < units.length; c++) {
            html += '<div class="wto-countdown-item">';
            html += '<div class="wto-circular-ring" style="border-color: ' + escapeHtml(accent) + '; background-color: ' + escapeHtml(boxBg) + '; color: ' + escapeHtml(boxTextColor) + ';">';
            html += '<span class="wto-countdown-num" style="font-size: 20px;">' + pad(units[c].val) + '</span>';
            html += '</div>';
            html += '<div class="wto-countdown-label" style="color: ' + escapeHtml(textColor) + '; margin-top: 6px;">' + escapeHtml(units[c].label) + '</div>';
            html += '</div>';
          }
          html += '</div>';
        } else if (design === "flip") {
          html += '<div class="wto-countdown-grid" style="justify-content: ' + justify + '; gap: 10px;">';
          for (var f = 0; f < units.length; f++) {
            html += '<div class="wto-countdown-item">';
            html += '<div class="wto-flip-card" style="background-color: ' + escapeHtml(boxBg) + '; color: ' + escapeHtml(boxTextColor) + ';">';
            html += '<div class="wto-flip-seam"></div>';
            html += '<span class="wto-countdown-num" style="font-family: monospace; font-size: 26px;">' + pad(units[f].val) + '</span>';
            html += '</div>';
            html += '<div class="wto-countdown-label" style="color: ' + escapeHtml(textColor) + '; font-family: monospace; margin-top: 6px;">' + escapeHtml(units[f].label) + '</div>';
            html += '</div>';
          }
          html += '</div>';
        } else if (design === "elegant") {
          html += '<div class="wto-countdown-grid" style="justify-content: ' + justify + '; gap: 24px; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1); padding: 12px 0;">';
          for (var e = 0; e < units.length; e++) {
            html += '<div class="wto-countdown-item">';
            html += '<span class="wto-countdown-num" style="color: ' + escapeHtml(accent) + '; font-size: 32px; font-weight: 400;">' + pad(units[e].val) + '</span>';
            html += '<div class="wto-countdown-label" style="letter-spacing: 0.15em; font-size: 10px; color: ' + escapeHtml(textColor) + ';">' + escapeHtml(units[e].label) + '</div>';
            html += '</div>';
            if (e < units.length - 1) {
              html += '<span style="opacity: 0.3; font-size: 20px;">/</span>';
            }
          }
          html += '</div>';
        } else if (design === "minimal") {
          html += '<div class="wto-countdown-grid" style="justify-content: ' + justify + '; gap: 24px;">';
          for (var m = 0; m < units.length; m++) {
            html += '<div class="wto-countdown-item">';
            html += '<div class="wto-countdown-num" style="color: ' + escapeHtml(accent) + '; font-size: 36px; font-weight: 900;">' + pad(units[m].val) + '</div>';
            html += '<div class="wto-countdown-label" style="opacity: 0.7; color: ' + escapeHtml(textColor) + ';">' + escapeHtml(units[m].label) + '</div>';
            html += '</div>';
          }
          html += '</div>';
        } else {
          // Modern cards default
          html += '<div class="wto-countdown-grid" style="justify-content: ' + justify + '; gap: 12px;">';
          for (var u = 0; u < units.length; u++) {
            var item = units[u];
            var boxStyle = 'style="background-color: ' + escapeHtml(boxBg) + '; color: ' + escapeHtml(boxTextColor) + '; border-radius: ' + Math.max(8, Math.min(rad, 18)) + 'px;"';
            html += '<div class="wto-countdown-item wto-countdown-box" ' + boxStyle + '>';
            html += '<div class="wto-countdown-num">' + pad(item.val) + '</div>';
            html += '<div class="wto-countdown-label" style="opacity: 0.9;">' + escapeHtml(item.label) + '</div>';
            html += '</div>';
            if (u < units.length - 1) {
              html += '<span style="font-size: 20px; font-weight: 700; opacity: 0.4; color: ' + escapeHtml(textColor) + ';">:</span>';
            }
          }
          html += '</div>';
        }
      }

      html += '</div>'; // end card
      wrapper.innerHTML = html;

      if (remaining.isExpired && timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    update();

    var initialCheck = calculateRemaining(targetMs, Date.now());
    if (!initialCheck.isExpired && initialCheck.isValid) {
      timerId = setInterval(update, 1000);
    }
  }

  fetchConfig(widgetId, function (config) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        renderWidget(config);
      });
    } else {
      renderWidget(config);
    }
  });
})();
