/**
 * WebToolOcean FAQ Accordion Widget Embed Runtime
 * Production-ready, framework-independent, isolated via Shadow DOM.
 *
 * Usage:
 * <script src="https://YOUR-DOMAIN/embed/faq.js" data-widget-id="WIDGET_ID" async></script>
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

  var globalLoadedKey = "__WTO_FAQ_" + (widgetId || "default") + "_LOADED__";
  if (window[globalLoadedKey]) return;
  window[globalLoadedKey] = true;

  var DEFAULT_CONFIG = {
    template: "classic",
    showHeading: true,
    heading: "Frequently Asked Questions",
    subtitle: "Everything you need to know about our products and services.",
    introText: "",
    headingAlignment: "left",
    items: [
      {
        id: "faq_1",
        question: "How long does shipping take?",
        answer: "Most domestic orders arrive within 3–5 business days. International shipping takes 7–14 business days.",
        category: "Shipping",
        badge: "Popular"
      },
      {
        id: "faq_2",
        question: "What is your return and refund policy?",
        answer: "We offer a 30-day money-back guarantee on all undamaged items in original packaging.",
        category: "Orders"
      },
      {
        id: "faq_3",
        question: "Do you ship internationally?",
        answer: "Yes, we ship to over 60 countries worldwide. International shipping rates are calculated at checkout.",
        category: "Shipping"
      },
      {
        id: "faq_4",
        question: "How do I contact customer support?",
        answer: "Contact our team at support@example.com or via live chat Monday through Friday, 9am–6pm EST.",
        category: "Support"
      }
    ],
    categories: ["All", "Shipping", "Orders", "Support"],
    enableSearch: false,
    searchPlaceholder: "Search questions or keywords...",
    caseInsensitiveSearch: true,
    showCategoryFilters: false,
    defaultCategory: "All",
    bgColor: "#ffffff",
    cardBgColor: "#ffffff",
    questionColor: "#0f172a",
    answerColor: "#475569",
    accentColor: "#7c3aed",
    borderColor: "#e2e8f0",
    iconColor: "#7c3aed",
    headingColor: "#0f172a",
    fontFamily: "inherit",
    fontSizeQuestion: 16,
    fontSizeAnswer: 14,
    fontSizeHeading: 28,
    fontWeightQuestion: "semibold",
    borderRadius: 12,
    borderWidth: 1,
    shadow: "none",
    iconStyle: "chevron",
    paddingY: 16,
    itemGap: 0,
    columns: 1,
    maxWidth: 820,
    alignment: "center",
    density: "comfortable",
    showContainerBg: true,
    showOuterBorder: true,
    accordionMode: "single",
    openFirstByDefault: true,
    collapsible: true
  };

  function fetchConfig(id, callback) {
    if (window.WTO_FAQ_CONFIGS && window.WTO_FAQ_CONFIGS[id]) {
      callback(Object.assign({}, DEFAULT_CONFIG, window.WTO_FAQ_CONFIGS[id]));
      return;
    }

    if (window.WTO_DEMO_CONFIG && window.WTO_DEMO_CONFIG[id]) {
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

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeFormatAnswer(text, accentColor) {
    var paragraphs = String(text || "").split("\n\n");
    var html = "";

    for (var i = 0; i < paragraphs.length; i++) {
      var p = paragraphs[i].trim();
      if (!p) continue;

      var lines = p.split("\n");
      var isBullet = lines.every(function (l) {
        var t = l.trim();
        return t.indexOf("•") === 0 || t.indexOf("- ") === 0;
      });

      if (isBullet) {
        html += '<ul style="margin: 0 0 8px 18px; padding: 0;">';
        for (var j = 0; j < lines.length; j++) {
          var lineContent = lines[j].replace(/^[•-]\s*/, "");
          html += '<li style="margin-bottom: 4px;">' + parseLinks(escapeHtml(lineContent), accentColor) + "</li>";
        }
        html += "</ul>";
      } else {
        html += '<p style="margin: 0 0 8px 0; line-height: 1.6;">';
        for (var k = 0; k < lines.length; k++) {
          html += (k > 0 ? "<br/>" : "") + parseLinks(escapeHtml(lines[k]), accentColor);
        }
        html += "</p>";
      }
    }
    return html;
  }

  function parseLinks(text, accentColor) {
    return text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: ' +
        accentColor +
        '; font-weight: 600; text-decoration: underline;">$1</a>'
    );
  }

  function renderWidget(config) {
    var hostDiv = document.createElement("div");
    hostDiv.id = "wto-faq-root-" + (widgetId || "default");
    hostDiv.className = "wto-faq-widget-host";

    if (currentScript && currentScript.parentNode) {
      currentScript.parentNode.insertBefore(hostDiv, currentScript.nextSibling);
    } else {
      document.body.appendChild(hostDiv);
    }

    var shadow = hostDiv.attachShadow({ mode: "open" });

    // Stylesheet
    var style = document.createElement("style");
    var shadowBox =
      config.shadow === "subtle"
        ? "0 4px 14px rgba(0,0,0,0.06)"
        : config.shadow === "medium"
        ? "0 10px 25px rgba(0,0,0,0.12)"
        : "none";

    style.textContent = [
      ":host { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: block; box-sizing: border-box; }",
      "*, *::before, *::after { box-sizing: border-box; }",
      ".wto-faq-container { width: 100%; margin: 0 auto; transition: all 0.2s ease; }",
      ".wto-faq-heading { margin: 0 0 6px 0; font-weight: 800; line-height: 1.25; }",
      ".wto-faq-sub { margin: 0 0 4px 0; line-height: 1.5; }",
      ".wto-faq-search-wrap { position: relative; margin-bottom: 20px; }",
      ".wto-faq-search-input { width: 100%; height: 40px; padding: 0 16px 0 38px; border-radius: 10px; border: 1px solid; font-size: 14px; outline: none; transition: border 0.15s; }",
      ".wto-faq-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; pointer-events: none; }",
      ".wto-faq-cat-bar { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 20px; padding-bottom: 4px; }",
      ".wto-faq-cat-btn { padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid; transition: all 0.15s; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; }",
      ".wto-faq-grid { display: grid; width: 100%; }",
      ".wto-faq-grid.two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }",
      "@media (max-width: 680px) { .wto-faq-grid.two-col { grid-template-columns: 1fr; } }",
      ".wto-faq-item { transition: all 0.2s ease; overflow: hidden; }",
      ".wto-faq-q-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: none; background: transparent; cursor: pointer; text-align: left; padding: 0; outline: none; }",
      ".wto-faq-q-text { flex: 1; margin: 0; line-height: 1.4; display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; }",
      ".wto-faq-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }",
      ".wto-faq-icon { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; transition: transform 0.2s ease; flex-shrink: 0; }",
      ".wto-faq-answer { overflow: hidden; animation: wtoFade 0.2s ease; }",
      "@keyframes wtoFade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }"
    ].join("\n");
    shadow.appendChild(style);

    // State
    var activeCategory = config.defaultCategory || "All";
    var searchQuery = "";
    var openIds = config.openFirstByDefault && config.items[0] ? [config.items[0].id] : [];

    var wrapper = document.createElement("div");
    shadow.appendChild(wrapper);

    function updateView() {
      var isTwoCol = config.columns === 2;
      var isCard = config.template === "card" || config.template === "bordered";
      var isHighlighted = config.template === "highlighted";

      var containerStyle = [
        "max-width: " + config.maxWidth + "px;",
        config.showContainerBg ? "background-color: " + config.bgColor + ";" : "background-color: transparent;",
        config.showContainerBg ? "padding: 24px;" : "padding: 0;",
        "border-radius: " + config.borderRadius + "px;",
        config.showOuterBorder ? "border: " + config.borderWidth + "px solid " + config.borderColor + ";" : "border: none;",
        "box-shadow: " + shadowBox + ";",
        config.alignment === "center" ? "margin: 0 auto;" : config.alignment === "right" ? "margin-left: auto;" : "margin-right: auto;"
      ].join(" ");

      var html = '<div class="wto-faq-container" style="' + containerStyle + '">';

      // Heading
      if (config.showHeading) {
        html += '<div style="text-align: ' + config.headingAlignment + '; margin-bottom: 24px;">';
        html +=
          '<h2 class="wto-faq-heading" style="color: ' +
          config.headingColor +
          "; font-size: " +
          config.fontSizeHeading +
          'px;">' +
          escapeHtml(config.heading) +
          "</h2>";
        if (config.subtitle) {
          html +=
            '<p class="wto-faq-sub" style="color: ' +
            config.answerColor +
            '; font-size: 14px; opacity: 0.85;">' +
            escapeHtml(config.subtitle) +
            "</p>";
        }
        if (config.introText) {
          html +=
            '<p style="color: ' +
            config.answerColor +
            '; font-size: 12px; opacity: 0.75; margin-top: 4px;">' +
            escapeHtml(config.introText) +
            "</p>";
        }
        html += "</div>";
      }

      // Search Bar
      if (config.enableSearch) {
        html += '<div class="wto-faq-search-wrap">';
        html +=
          '<svg class="wto-faq-search-icon" viewBox="0 0 24 24" fill="none" stroke="' +
          config.accentColor +
          '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
        html +=
          '<input type="text" class="wto-faq-search-input" id="wto-search" placeholder="' +
          escapeHtml(config.searchPlaceholder) +
          '" value="' +
          escapeHtml(searchQuery) +
          '" style="background: ' +
          config.cardBgColor +
          "; border-color: " +
          config.borderColor +
          "; color: " +
          config.questionColor +
          ';">';
        html += "</div>";
      }

      // Category filter pills
      if (config.showCategoryFilters && config.categories && config.categories.length > 1) {
        html += '<div class="wto-faq-cat-bar">';
        for (var c = 0; c < config.categories.length; c++) {
          var catName = config.categories[c];
          var isActive = activeCategory === catName;
          var count =
            catName === "All"
              ? config.items.length
              : config.items.filter(function (it) {
                  return it.category === catName;
                }).length;

          html +=
            '<button type="button" class="wto-faq-cat-btn" data-cat="' +
            escapeHtml(catName) +
            '" style="background: ' +
            (isActive ? config.accentColor : config.cardBgColor) +
            "; color: " +
            (isActive ? "#ffffff" : config.questionColor) +
            "; border-color: " +
            (isActive ? config.accentColor : config.borderColor) +
            ';">';
          html += "<span>" + escapeHtml(catName) + "</span>";
          html +=
            '<span style="background: ' +
            (isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)") +
            "; border-radius: 99px; padding: 1px 6px; font-size: 10px;\">" +
            count +
            "</span>";
          html += "</button>";
        }
        html += "</div>";
      }

      // Filter items
      var filtered = config.items.filter(function (it) {
        if (config.showCategoryFilters && activeCategory !== "All") {
          if (it.category !== activeCategory) return false;
        }
        if (config.enableSearch && searchQuery.trim()) {
          var q = config.caseInsensitiveSearch
            ? searchQuery.trim().toLowerCase()
            : searchQuery.trim();
          var qt = config.caseInsensitiveSearch ? it.question.toLowerCase() : it.question;
          var at = config.caseInsensitiveSearch ? it.answer.toLowerCase() : it.answer;
          return qt.indexOf(q) !== -1 || at.indexOf(q) !== -1;
        }
        return true;
      });

      // Question items grid
      html +=
        '<div class="wto-faq-grid ' +
        (isTwoCol ? "two-col" : "") +
        '" style="gap: ' +
        (config.itemGap > 0 ? config.itemGap + "px" : "0px") +
        ';">';

      if (filtered.length === 0) {
        html +=
          '<div style="padding: 32px; text-align: center; color: ' +
          config.answerColor +
          '; font-size: 14px;">No matching questions found.</div>';
      } else {
        for (var i = 0; i < filtered.length; i++) {
          var item = filtered[i];
          var isOpen = openIds.indexOf(item.id) !== -1;

          var itemStyle = [
            "background-color: " + config.cardBgColor + ";",
            "border-radius: " + config.borderRadius + "px;",
            isCard || config.itemGap > 0
              ? "border: " + config.borderWidth + "px solid " + config.borderColor + ";"
              : "border-bottom: " + config.borderWidth + "px solid " + config.borderColor + ";",
            isCard ? "padding: 4px 14px;" : "padding: 0 4px;",
            isHighlighted && isOpen ? "border-left: 4px solid " + config.accentColor + ";" : ""
          ].join(" ");

          html += '<div class="wto-faq-item" style="' + itemStyle + '">';

          // Button
          html +=
            '<button type="button" class="wto-faq-q-btn" data-id="' +
            escapeHtml(item.id) +
            '" aria-expanded="' +
            (isOpen ? "true" : "false") +
            '" style="padding-top: ' +
            config.paddingY +
            "px; padding-bottom: " +
            config.paddingY +
            'px;">';

          html +=
            '<span class="wto-faq-q-text" style="color: ' +
            config.questionColor +
            "; font-size: " +
            config.fontSizeQuestion +
            "px; font-weight: " +
            (config.fontWeightQuestion === "bold" ? "700" : config.fontWeightQuestion === "semibold" ? "600" : "500") +
            ';">';
          html += escapeHtml(item.question);
          if (item.badge) {
            html +=
              '<span class="wto-faq-badge" style="background: ' +
              config.accentColor +
              "18; color: " +
              config.accentColor +
              ';">' +
              escapeHtml(item.badge) +
              "</span>";
          }
          html += "</span>";

          // Icon
          html += '<span class="wto-faq-icon" style="color: ' + config.iconColor + ';">';
          if (config.iconStyle === "plus-minus") {
            html +=
              '<span style="font-size: 18px; font-weight: bold; line-height: 1;">' +
              (isOpen ? "−" : "+") +
              "</span>";
          } else if (config.iconStyle === "arrow") {
            html +=
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; transform: ' +
              (isOpen ? "rotate(90deg)" : "rotate(0deg)") +
              '; transition: transform 0.2s;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
          } else {
            html +=
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; transform: ' +
              (isOpen ? "rotate(180deg)" : "rotate(0deg)") +
              '; transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>';
          }
          html += "</span>";

          html += "</button>";

          // Answer
          if (isOpen) {
            html +=
              '<div class="wto-faq-answer" role="region" style="padding-bottom: ' +
              config.paddingY +
              "px; color: " +
              config.answerColor +
              "; font-size: " +
              config.fontSizeAnswer +
              'px;">';
            html += safeFormatAnswer(item.answer, config.accentColor);
            html += "</div>";
          }

          html += "</div>";
        }
      }

      html += "</div>"; // end grid
      html += "</div>"; // end container

      wrapper.innerHTML = html;
      bindEvents();
    }

    function bindEvents() {
      // Toggle questions
      var qBtns = wrapper.querySelectorAll(".wto-faq-q-btn");
      for (var b = 0; b < qBtns.length; b++) {
        qBtns[b].addEventListener("click", function () {
          var id = this.getAttribute("data-id");
          var idx = openIds.indexOf(id);
          if (idx !== -1) {
            if (config.collapsible) {
              openIds = openIds.filter(function (itId) {
                return itId !== id;
              });
            }
          } else {
            if (config.accordionMode === "single") {
              openIds = [id];
            } else {
              openIds.push(id);
            }
          }
          updateView();
        });
      }

      // Search input
      var searchInput = wrapper.querySelector("#wto-search");
      if (searchInput) {
        searchInput.addEventListener("input", function (e) {
          searchQuery = e.target.value;
          updateView();
          // Restore focus to input
          var newInput = wrapper.querySelector("#wto-search");
          if (newInput) {
            newInput.focus();
            newInput.selectionStart = newInput.selectionEnd = newInput.value.length;
          }
        });
      }

      // Category filter buttons
      var catBtns = wrapper.querySelectorAll(".wto-faq-cat-btn");
      for (var c = 0; c < catBtns.length; c++) {
        catBtns[c].addEventListener("click", function () {
          activeCategory = this.getAttribute("data-cat");
          updateView();
        });
      }
    }

    updateView();
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
