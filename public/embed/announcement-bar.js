/**
 * WebToolOcean Announcement Bar Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 *
 * Usage:
 * <script src="https://YOUR-DOMAIN/embed/announcement-bar.js" data-widget-id="WIDGET_ID" async></script>
 */
(function () {
  "use strict";

  if (window.__WTO_ANNOUNCEMENT_LOADED__) return;
  window.__WTO_ANNOUNCEMENT_LOADED__ = true;

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

  var DEFAULT_CONFIG = {
    text: "2027 Winter and Spring Schedules are now open for enrollment!",
    icon: "megaphone",
    hasButton: false,
    buttonText: "Learn More",
    buttonLink: "#",
    hasLink: false,
    linkText: "Learn More",
    linkUrl: "#",
    openInNewTab: true,
    bgColor: "#0F172A",
    textColor: "#FFFFFF",
    buttonBgColor: "#FACC15",
    buttonTextColor: "#0F172A",
    fontSize: "14px",
    fontWeight: "medium",
    textAlign: "center",
    padding: 12,
    position: "top",
    isSticky: true,
    pageTarget: "all",
    showDesktop: true,
    showTablet: true,
    showMobile: true,
    showCloseButton: true,
    allowDismiss: true,
    dismissDays: 7,
    animateSlideDown: true,
    displayDelay: 0,
    hasCountdown: false,
    countdownTarget: "2027-04-30T23:59:59",
    countdownExpireMessage: "Registration has closed.",
  };

  function resolveConfig(id, callback) {
    // 1. Check window.WTO_ANNOUNCEMENT_CONFIGS (standalone inline snippet)
    if (window.WTO_ANNOUNCEMENT_CONFIGS && window.WTO_ANNOUNCEMENT_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_ANNOUNCEMENT_CONFIGS[id]));
      return;
    }

    // 2. Check data-config attribute on currentScript
    if (currentScript && currentScript.getAttribute("data-config")) {
      try {
        var scriptCfg = JSON.parse(currentScript.getAttribute("data-config"));
        callback(Object.assign({}, DEFAULT_CONFIG, scriptCfg));
        return;
      } catch (e) {
        console.warn("[WebToolOcean] Failed to parse script data-config", e);
      }
    }

    // 3. Check data-config on container element (e.g. data-wto-announcement or data-widget-id)
    if (id) {
      try {
        var container =
          document.querySelector('[data-wto-announcement="' + id + '"]') ||
          document.querySelector('[data-widget-id="' + id + '"]');
        if (container && container.getAttribute("data-config")) {
          var containerCfg = JSON.parse(container.getAttribute("data-config"));
          callback(Object.assign({}, DEFAULT_CONFIG, containerCfg));
          return;
        }
      } catch (e) {}
    }

    // 4. Fallback to localStorage (only available if running on same origin)
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
      // Cross-origin or sandboxed iframe storage access restriction
    }

    callback(DEFAULT_CONFIG);
  }

  function checkDeviceVisibility(config) {
    var width = window.innerWidth;
    var isMobile = width < 640;
    var isTablet = width >= 640 && width < 1024;
    var isDesktop = width >= 1024;

    if (isMobile && !config.showMobile) return false;
    if (isTablet && !config.showTablet) return false;
    if (isDesktop && !config.showDesktop) return false;
    return true;
  }

  function checkPageTarget(config) {
    var path = window.location.pathname || "/";
    if (config.pageTarget === "homepage") {
      return path === "/" || path === "/index.html" || path === "";
    }
    if (config.pageTarget === "custom" && config.customPaths) {
      var patterns = config.customPaths.split(",").map(function (p) {
        return p.trim();
      });
      return patterns.some(function (p) {
        return path.indexOf(p) !== -1;
      });
    }
    return true;
  }

  function checkDismissal(id, days) {
    if (!days || days <= 0) return false;
    try {
      var key = "wto_dismissed_" + (id || "announcement");
      var timestamp = localStorage.getItem(key);
      if (timestamp) {
        var elapsedDays = (Date.now() - Number(timestamp)) / (1000 * 60 * 60 * 24);
        if (elapsedDays < days) return true;
      }
    } catch (e) {}
    return false;
  }

  function saveDismissal(id) {
    try {
      var key = "wto_dismissed_" + (id || "announcement");
      localStorage.setItem(key, String(Date.now()));
    } catch (e) {}
  }

  function createAnnouncementBar(config) {
    if (!checkDeviceVisibility(config) || !checkPageTarget(config)) return;
    if (config.allowDismiss && checkDismissal(widgetId, config.dismissDays)) return;

    var hostDiv = document.createElement("div");
    hostDiv.id = "wto-announcement-container-" + (widgetId || "default");
    document.body.appendChild(hostDiv);

    var shadow = hostDiv.attachShadow({ mode: "open" });

    var style = document.createElement("style");
    var isBottom = config.position === "bottom";
    var isSticky = Boolean(config.isSticky);
    var positionCss = isSticky
      ? "position: fixed; " + (isBottom ? "bottom: 0;" : "top: 0;") + " left: 0; right: 0; z-index: 99999;"
      : "position: relative; width: 100%; z-index: 1000;";

    style.textContent = [
      ":host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: block; }",
      ".wto-bar {",
      positionCss,
      "  background: " + config.bgColor + ";",
      "  color: " + config.textColor + ";",
      "  font-size: " + (config.fontSize || "14px") + ";",
      "  font-weight: " + (config.fontWeight === "bold" ? "700" : config.fontWeight === "semibold" ? "600" : "500") + ";",
      "  padding: " + (Number(config.padding) || 12) + "px 16px;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  gap: 12px;",
      "  flex-wrap: wrap;",
      "  box-sizing: border-box;",
      "  text-align: " + (config.textAlign || "center") + ";",
      "  box-shadow: 0 1px 4px rgba(0,0,0,0.12);",
      "  transition: transform 0.3s ease, opacity 0.3s ease;",
      "}",
      config.animateSlideDown
        ? isBottom
          ? "@keyframes wto-slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .wto-bar { animation: wto-slide-up 0.3s ease-out; }"
          : "@keyframes wto-slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .wto-bar { animation: wto-slide-down 0.3s ease-out; }"
        : "",
      ".wto-content { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }",
      ".wto-btn {",
      "  background: " + (config.buttonBgColor || "#FACC15") + ";",
      "  color: " + (config.buttonTextColor || "#0F172A") + ";",
      "  padding: 6px 14px;",
      "  border-radius: 8px;",
      "  font-size: 12px;",
      "  font-weight: 700;",
      "  text-decoration: none;",
      "  box-shadow: 0 1px 3px rgba(0,0,0,0.15);",
      "  transition: opacity 0.15s ease;",
      "  cursor: pointer;",
      "  white-space: nowrap;",
      "}",
      ".wto-btn:hover { opacity: 0.9; }",
      ".wto-link { color: inherit; text-decoration: underline; font-size: 13px; font-weight: 600; cursor: pointer; }",
      ".wto-link:hover { opacity: 0.85; }",
      ".wto-close {",
      "  position: absolute;",
      "  right: 12px;",
      "  top: 50%;",
      "  transform: translateY(-50%);",
      "  background: none;",
      "  border: none;",
      "  color: inherit;",
      "  opacity: 0.7;",
      "  cursor: pointer;",
      "  padding: 4px;",
      "  border-radius: 9999px;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "}",
      ".wto-close:hover { opacity: 1; background: rgba(0,0,0,0.1); }",
      ".wto-timer { display: flex; align-items: center; gap: 4px; font-family: monospace; font-size: 12px; font-weight: 700; }",
      ".wto-timer-box { background: rgba(0,0,0,0.25); padding: 2px 6px; border-radius: 4px; }",
    ].join("\n");

    shadow.appendChild(style);

    var bar = document.createElement("div");
    bar.className = "wto-bar";

    var contentHtml = '<div class="wto-content">';
    if (config.headline) {
      contentHtml += "<strong>" + config.headline + "</strong> ";
    }
    contentHtml += "<span>" + (config.text || "") + "</span>";
    if (config.secondaryText) {
      contentHtml += ' <span style="opacity: 0.8; font-size: 12px;">' + config.secondaryText + "</span>";
    }
    contentHtml += "</div>";

    var timerHtml = "";
    if (config.hasCountdown) {
      timerHtml = '<div class="wto-timer" id="wto-countdown-timer"></div>';
    }

    var btnHtml = "";
    if (config.hasButton && config.buttonText) {
      btnHtml =
        '<a class="wto-btn" href="' +
        (config.buttonLink || "#") +
        '" ' +
        (config.openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : "") +
        ">" +
        config.buttonText +
        "</a>";
    }

    var linkHtml = "";
    if (config.hasLink && config.linkText) {
      linkHtml =
        '<a class="wto-link" href="' +
        (config.linkUrl || "#") +
        '" ' +
        (config.openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : "") +
        ">" +
        config.linkText +
        "</a>";
    }

    var closeHtml = "";
    if (config.showCloseButton) {
      closeHtml =
        '<button class="wto-close" aria-label="Close Announcement">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
        "</button>";
    }

    bar.innerHTML = contentHtml + timerHtml + linkHtml + btnHtml + closeHtml;

    // Close button dismiss behavior
    if (config.showCloseButton) {
      var closeBtn = bar.querySelector(".wto-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          bar.style.opacity = "0";
          bar.style.transform = isBottom ? "translateY(100%)" : "translateY(-100%)";
          setTimeout(function () {
            hostDiv.remove();
          }, 300);
          if (config.allowDismiss) {
            saveDismissal(widgetId);
          }
        });
      }
    }

    // Countdown timer tick logic
    if (config.hasCountdown && config.countdownTarget) {
      var timerEl = bar.querySelector("#wto-countdown-timer");
      var updateTimer = function () {
        var target = new Date(config.countdownTarget).getTime();
        var diff = target - Date.now();
        if (diff <= 0) {
          if (config.countdownExpireAction === "hide") {
            hostDiv.remove();
          } else {
            timerEl.innerHTML =
              '<span class="wto-timer-box">' +
              (config.countdownExpireMessage || "Expired") +
              "</span>";
          }
          return;
        }
        var totalSec = Math.floor(diff / 1000);
        var d = Math.floor(totalSec / 86400);
        var h = Math.floor((totalSec % 86400) / 3600);
        var m = Math.floor((totalSec % 3600) / 60);
        var s = totalSec % 60;

        timerEl.innerHTML =
          '<span class="wto-timer-box">' + String(d).padStart(2, "0") + "d</span>" +
          '<span class="wto-timer-box">' + String(h).padStart(2, "0") + "h</span>" +
          '<span class="wto-timer-box">' + String(m).padStart(2, "0") + "m</span>" +
          '<span class="wto-timer-box">' + String(s).padStart(2, "0") + "s</span>";
      };

      updateTimer();
      var timerInterval = setInterval(updateTimer, 1000);
    }

    var displayDelay = (Number(config.displayDelay) || 0) * 1000;
    if (displayDelay > 0) {
      bar.style.display = "none";
      setTimeout(function () {
        bar.style.display = "flex";
      }, displayDelay);
    }

    shadow.appendChild(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      resolveConfig(widgetId, createAnnouncementBar);
    });
  } else {
    resolveConfig(widgetId, createAnnouncementBar);
  }
})();
