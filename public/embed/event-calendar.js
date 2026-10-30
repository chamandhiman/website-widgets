/**
 * WebToolOcean Event Calendar Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 * Supports 6 distinct designs: Minimal List, Modern Cards, Monthly Calendar, Agenda, Compact, Featured Events.
 *
 * Usage:
 * <script src="https://cdn.widgets.webtoolocean.com/embed/event-calendar.js" data-widget-id="WIDGET_ID" async></script>
 * OR:
 * <div class="wto-widget" data-widget="event-calendar" data-id="WIDGET_ID"></div>
 * <script src="https://cdn.widgets.webtoolocean.com/embed/event-calendar.js" async></script>
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

  var globalLoadedKey = "__WTO_EVENT_CALENDAR_" + (widgetId || "default") + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_EVENTS = [
    {
      id: "ev-1",
      title: "Global Web & AI Developers Summit 2027",
      date: "2027-04-15",
      startTime: "09:30",
      endTime: "17:00",
      location: "Main Convention Center & Virtual Stream",
      description: "Join leading web engineers, designers, and creators for frontend innovation and AI networking.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      destinationUrl: "https://example.com/summit",
    },
    {
      id: "ev-2",
      title: "Product Design & UX Masterclass",
      date: "2027-04-22",
      startTime: "14:00",
      endTime: "16:30",
      location: "Design Studio Room B (San Francisco)",
      description: "Interactive workshop on design tokens, micro-animations, and conversion-optimized component patterns.",
      imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
      destinationUrl: "https://example.com/ux-masterclass",
    },
    {
      id: "ev-3",
      title: "Cloud Infrastructure & Edge Functions Workshop",
      date: "2027-05-04",
      startTime: "10:00",
      endTime: "13:00",
      location: "Online Zoom Webinar",
      description: "Deep dive into edge routing, distributed caching, and automated zero-downtime Cloudflare deployment pipelines.",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
      destinationUrl: "https://example.com/cloud-workshop",
    },
    {
      id: "ev-4",
      title: "Community Hackathon & Project Showcase",
      date: "2027-05-20",
      startTime: "09:00",
      endTime: "20:00",
      location: "Tech Innovation Hub, Austin TX",
      description: "Build, launch, and demo your project with mentor guidance, free food, and exciting prizes.",
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      destinationUrl: "https://example.com/hackathon",
    },
  ];

  var DEFAULT_CONFIG = {
    designId: "modern-cards",
    title: "Upcoming Events",
    description: "Browse our upcoming workshops, live webinars, and community meetups.",
    events: DEFAULT_EVENTS,
    upcomingOnly: true,
    maxEvents: 10,
    showDescriptions: true,
    showLocations: true,
    showImages: true,
    dateFormat: "MMM D, YYYY",
    timeFormat: "12h",
    emptyStateMessage: "No upcoming events scheduled at this moment. Please check back soon!",
    accent: "#7c3aed",
    bg: "#ffffff",
    text: "#0f172a",
    radius: 16,
  };

  var MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTH_NAMES_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatDate(dateStr, format) {
    if (!dateStr) return "";
    var parts = dateStr.split("-");
    if (parts.length !== 3) return escapeHtml(dateStr);
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return escapeHtml(dateStr);

    var mIdx = Math.max(0, Math.min(11, m - 1));
    var mShort = MONTH_NAMES_SHORT[mIdx];
    var mm = String(m).padStart(2, "0");
    var dd = String(d).padStart(2, "0");

    if (format === "MM/DD/YYYY") return mm + "/" + dd + "/" + y;
    if (format === "DD/MM/YYYY") return dd + "/" + mm + "/" + y;
    if (format === "YYYY-MM-DD") return y + "-" + mm + "-" + dd;
    return mShort + " " + d + ", " + y;
  }

  function getDateBadge(dateStr) {
    if (!dateStr) return { monthShort: "TBD", day: 1, year: 2027, weekday: "" };
    var parts = dateStr.split("-");
    var y = parseInt(parts[0], 10) || 2027;
    var m = parseInt(parts[1], 10) || 1;
    var d = parseInt(parts[2], 10) || 1;
    var mIdx = Math.max(0, Math.min(11, m - 1));
    var dateObj = new Date(y, mIdx, d);
    return {
      monthShort: MONTH_NAMES_SHORT[mIdx],
      day: d,
      year: y,
      weekday: DAY_NAMES[dateObj.getDay()] || "",
    };
  }

  function formatTime(timeStr, format) {
    if (!timeStr) return "";
    var parts = timeStr.trim().split(":");
    if (parts.length < 2) return escapeHtml(timeStr);
    var h = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return escapeHtml(timeStr);
    if (format === "24h") {
      return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
    }
    var ampm = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + String(m).padStart(2, "0") + " " + ampm;
  }

  function formatTimeRange(start, end, format) {
    if (!start && !end) return "";
    var s = formatTime(start, format);
    var e = formatTime(end, format);
    if (s && e) return s + " – " + e;
    return s || e;
  }

  function fetchConfig(id, callback) {
    if (window.WTO_EVENT_CALENDAR_CONFIGS && id && window.WTO_EVENT_CALENDAR_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_EVENT_CALENDAR_CONFIGS[id]));
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
    callback(DEFAULT_CONFIG);
  }

  function renderWidget(config) {
    var targetContainer = null;
    if (widgetId) {
      targetContainer =
        document.querySelector('.wto-widget[data-widget="event-calendar"][data-id="' + widgetId + '"]') ||
        document.querySelector('.wto-widget[data-id="' + widgetId + '"]');
    }

    if (!targetContainer) {
      targetContainer = document.createElement("div");
      targetContainer.className = "wto-event-calendar-container";
      if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(targetContainer, currentScript.nextSibling);
      } else {
        document.body.appendChild(targetContainer);
      }
    }

    var shadow = targetContainer.shadowRoot || targetContainer.attachShadow({ mode: "open" });
    var wrapper = document.createElement("div");
    wrapper.className = "wto-calendar-root";
    shadow.appendChild(wrapper);

    // Current active month navigation state for Monthly Grid
    var activeMonth = 3; // April
    var activeYear = 2027;
    if (config.events && config.events.length > 0 && config.events[0].date) {
      var p = config.events[0].date.split("-");
      if (p.length >= 2) {
        activeYear = parseInt(p[0], 10) || 2027;
        activeMonth = (parseInt(p[1], 10) || 4) - 1;
      }
    }

    var styles = [
      ":host { display: block; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }",
      "* { box-sizing: border-box; margin: 0; padding: 0; }",
      ".wto-calendar-root { width: 100%; max-width: 100%; color: #0f172a; }",
      ".wto-header { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }",
      ".wto-title { font-size: 24px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px; }",
      ".wto-desc { font-size: 14px; color: #64748b; line-height: 1.5; }",
      ".wto-empty { text-align: center; padding: 48px 20px; border: 2px dashed #cbd5e1; border-radius: 16px; background: #f8fafc; color: #64748b; }",
      ".wto-list { display: flex; flex-direction: column; gap: 12px; }",
      ".wto-item-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 16px; background: #fff; transition: all 0.2s; }",
      ".wto-item-row:hover { border-color: #c084fc; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.06); }",
      ".wto-date-badge { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 60px; padding: 8px 4px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; text-align: center; flex-shrink: 0; }",
      ".wto-badge-m { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #7c3aed; }",
      ".wto-badge-d { font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1; margin-top: 2px; }",
      ".wto-item-content { flex: 1; min-width: 0; }",
      ".wto-item-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }",
      ".wto-item-desc { font-size: 13px; color: #64748b; margin-bottom: 6px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }",
      ".wto-item-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #64748b; }",
      ".wto-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }",
      ".wto-card { border: 1px solid #e2e8f0; border-radius: 16px; background: #fff; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: all 0.2s; }",
      ".wto-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.07); }",
      ".wto-card-img { width: 100%; height: 160px; object-fit: cover; background: #f1f5f9; }",
      ".wto-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }",
      ".wto-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; }",
      ".wto-btn-primary { background: #7c3aed; color: #fff; border: none; }",
      ".wto-btn-primary:hover { background: #6d28d9; }",
      ".wto-btn-outline { background: transparent; color: #0f172a; border: 1px solid #cbd5e1; }",
      ".wto-btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }",
      ".wto-month-nav { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px 16px 0 0; }",
      ".wto-nav-btn { background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; width: 32px; height: 32px; display: grid; place-items: center; cursor: pointer; }",
      ".wto-grid-table { width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; overflow: hidden; table-layout: fixed; }",
      ".wto-grid-table th { background: #f1f5f9; padding: 10px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; text-align: center; }",
      ".wto-grid-table td { height: 75px; vertical-align: top; padding: 6px; border: 1px solid #e2e8f0; background: #fff; font-size: 11px; }",
      ".wto-grid-tag { background: #ede9fe; color: #6d28d9; padding: 2px 4px; border-radius: 4px; font-weight: 700; font-size: 10px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
    ].join("\n");

    function renderContent() {
      var events = (config.events || []).slice();
      var todayStr = new Date().toISOString().slice(0, 10);
      if (config.upcomingOnly) {
        events = events.filter(function (e) {
          return (e.date || "") >= todayStr;
        });
      }
      events.sort(function (a, b) {
        var tA = (a.date || "") + "T" + (a.startTime || "00:00");
        var tB = (b.date || "") + "T" + (b.startTime || "00:00");
        return tA.localeCompare(tB);
      });
      if (config.maxEvents > 0) {
        events = events.slice(0, config.maxEvents);
      }

      var html = '<style>' + styles + '</style>';
      html += '<div class="wto-header">';
      html += '<div class="wto-title">📅 ' + escapeHtml(config.title || "Upcoming Events") + '</div>';
      if (config.description) {
        html += '<div class="wto-desc">' + escapeHtml(config.description) + '</div>';
      }
      html += '</div>';

      if (events.length === 0 && config.designId !== "monthly-grid") {
        html += '<div class="wto-empty">' + escapeHtml(config.emptyStateMessage || "No upcoming events found.") + '</div>';
        wrapper.innerHTML = html;
        return;
      }

      var design = config.designId || "modern-cards";

      if (design === "monthly-grid") {
        html += '<div class="wto-month-nav">';
        html += '<div style="font-weight: 800; font-size: 16px;">' + MONTH_NAMES_FULL[activeMonth] + ' ' + activeYear + '</div>';
        html += '<div style="display: flex; gap: 6px;">';
        html += '<button type="button" class="wto-nav-btn" id="wto-prev-m">&larr;</button>';
        html += '<button type="button" class="wto-nav-btn" id="wto-next-m">&rarr;</button>';
        html += '</div></div>';

        html += '<table class="wto-grid-table"><thead><tr>';
        var dNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (var d = 0; d < dNames.length; d++) {
          html += '<th>' + dNames[d] + '</th>';
        }
        html += '</tr></thead><tbody>';

        var firstDay = new Date(activeYear, activeMonth, 1).getDay();
        var numDays = new Date(activeYear, activeMonth + 1, 0).getDate();
        var dayCounter = 1;

        for (var row = 0; row < 6; row++) {
          if (dayCounter > numDays) break;
          html += '<tr>';
          for (var col = 0; col < 7; col++) {
            if ((row === 0 && col < firstDay) || dayCounter > numDays) {
              html += '<td style="background: #fafafa; opacity: 0.4;"></td>';
            } else {
              var currDateStr = activeYear + '-' + String(activeMonth + 1).padStart(2, '0') + '-' + String(dayCounter).padStart(2, '0');
              var dayEvs = (config.events || []).filter(function (e) { return e.date === currDateStr; });
              html += '<td>';
              html += '<div style="font-weight: 700; color: #334155;">' + dayCounter + '</div>';
              for (var de = 0; de < dayEvs.length && de < 2; de++) {
                html += '<div class="wto-grid-tag">' + escapeHtml(dayEvs[de].title) + '</div>';
              }
              html += '</td>';
              dayCounter++;
            }
          }
          html += '</tr>';
        }
        html += '</tbody></table>';

      } else if (design === "modern-cards" || design === "featured") {
        html += '<div class="wto-cards-grid">';
        for (var i = 0; i < events.length; i++) {
          var ev = events[i];
          var badge = getDateBadge(ev.date);
          var timeStr = formatTimeRange(ev.startTime, ev.endTime, config.timeFormat);
          html += '<div class="wto-card">';
          if (config.showImages && ev.imageUrl) {
            html += '<img class="wto-card-img" src="' + escapeHtml(ev.imageUrl) + '" alt="' + escapeHtml(ev.title) + '" />';
          }
          html += '<div class="wto-card-body">';
          html += '<div>';
          html += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">';
          html += '<span style="background: #faf5ff; border: 1px solid #e9d5ff; color: #7c3aed; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">' + badge.monthShort + ' ' + badge.day + ', ' + badge.year + '</span>';
          html += '</div>';
          html += '<div class="wto-item-title">' + escapeHtml(ev.title) + '</div>';
          if (config.showDescriptions && ev.description) {
            html += '<div class="wto-item-desc">' + escapeHtml(ev.description) + '</div>';
          }
          html += '</div>';

          html += '<div>';
          html += '<div class="wto-item-meta" style="margin-bottom: 12px;">';
          if (timeStr) html += '<span>🕒 ' + escapeHtml(timeStr) + '</span>';
          if (config.showLocations && ev.location) html += '<span>📍 ' + escapeHtml(ev.location) + '</span>';
          html += '</div>';

          if (ev.destinationUrl) {
            html += '<a href="' + escapeHtml(ev.destinationUrl) + '" target="_blank" rel="noreferrer" class="wto-btn wto-btn-primary" style="width: 100%;">View Details &rarr;</a>';
          }
          html += '</div></div></div>';
        }
        html += '</div>';

      } else {
        // minimal-list, agenda, compact
        html += '<div class="wto-list">';
        for (var j = 0; j < events.length; j++) {
          var eItem = events[j];
          var b = getDateBadge(eItem.date);
          var tStr = formatTimeRange(eItem.startTime, eItem.endTime, config.timeFormat);
          html += '<div class="wto-item-row">';
          html += '<div style="display: flex; align-items: center; gap: 14px; min-width: 0;">';
          html += '<div class="wto-date-badge"><span class="wto-badge-m">' + b.monthShort + '</span><span class="wto-badge-d">' + b.day + '</span></div>';
          html += '<div class="wto-item-content">';
          html += '<div class="wto-item-title">' + escapeHtml(eItem.title) + '</div>';
          if (config.showDescriptions && eItem.description && design !== "compact") {
            html += '<div class="wto-item-desc">' + escapeHtml(eItem.description) + '</div>';
          }
          html += '<div class="wto-item-meta">';
          if (tStr) html += '<span>🕒 ' + escapeHtml(tStr) + '</span>';
          if (config.showLocations && eItem.location) html += '<span>📍 ' + escapeHtml(eItem.location) + '</span>';
          html += '</div></div></div>';

          if (eItem.destinationUrl) {
            html += '<a href="' + escapeHtml(eItem.destinationUrl) + '" target="_blank" rel="noreferrer" class="wto-btn wto-btn-outline" style="flex-shrink: 0;">Details &rarr;</a>';
          }
          html += '</div>';
        }
        html += '</div>';
      }

      wrapper.innerHTML = html;

      // Attach navigation listeners for month grid
      var prevBtn = shadow.getElementById("wto-prev-m");
      var nextBtn = shadow.getElementById("wto-next-m");
      if (prevBtn) {
        prevBtn.onclick = function () {
          if (activeMonth === 0) {
            activeMonth = 11;
            activeYear--;
          } else {
            activeMonth--;
          }
          renderContent();
        };
      }
      if (nextBtn) {
        nextBtn.onclick = function () {
          if (activeMonth === 11) {
            activeMonth = 0;
            activeYear++;
          } else {
            activeMonth++;
          }
          renderContent();
        };
      }
    }

    renderContent();
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
