import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "@/lib/auth";
import "@/landing.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WebToolOcean Widget Studio – Add Website Widgets with One Snippet" },
      {
        name: "description",
        content:
          "Customizable website widgets: WhatsApp chat, Google reviews, countdown timers, FAQ, popups and more. Try them live, then embed with a single JavaScript snippet.",
      },
      { property: "og:title", content: "WebToolOcean Widget Studio – Add Website Widgets with One Snippet" },
      {
        property: "og:description",
        content:
          "Customizable website widgets: WhatsApp chat, Google reviews, countdown timers, FAQ, popups and more. Try them live, then embed with a single JavaScript snippet.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

/* Raw widget catalog from user's landing page */
const RAW_WIDGETS = `Google Reviews|Show your best Google reviews to build trust.|Reviews|⭐|rev
Facebook Reviews|Display reviews from your Facebook page.|Reviews|👍|rev
Yelp Reviews|Feature your top Yelp reviews.|Reviews|🍽️|rev
Tripadvisor Reviews|Show travellers’ feedback on your site.|Reviews|🧳|rev
Trustpilot Reviews|Bring your Trustpilot ratings to your site.|Reviews|🌟|rev
Testimonials|Highlight quotes from happy customers.|Reviews|❝|tq
Instagram Feed|Embed a stylish grid of your Instagram posts.|Social|📸|feed
Facebook Feed|Display your Facebook page posts on your site.|Social|📘|feed
TikTok Feed|Show your latest TikTok videos.|Social|🎵|feed
X (Twitter) Feed|Embed your posts from X.|Social|✖️|feed
Pinterest Feed|Showcase your pins and boards.|Social|📌|feed
Social Media Feed|Combine all your social channels in one feed.|Social|🔗|feed
Social Share Buttons|Let visitors share your pages in a click.|Social|📤|icons
Social Icons|Link to all your profiles with tidy icons.|Social|💠|icons
YouTube Gallery|Showcase videos from your YouTube channel.|Media|▶️|media
Video Gallery|Display a gallery of your videos.|Media|🎬|media
Audio Player|Play podcasts and music on your page.|Media|🎧|media
Photo Gallery|Show off your photos in a responsive gallery.|Media|🖼️|feed
Image Slider|Slide through your best images.|Media|🎞️|feed
Before & After Slider|Compare two images with a slider.|Media|↔️|feed
WhatsApp Chat|Floating chat button that opens WhatsApp.|Chat|💬|chat
Messenger Chat|Let visitors message you on Messenger.|Chat|🗨️|chat
Telegram Chat|Floating Telegram contact button.|Chat|✈️|chat
All-in-One Chat|Offer several chat channels in one button.|Chat|📲|chat
AI Chatbot|Answer visitor questions automatically.|Chat|🤖|chat
Announcement Bar|Slim top bar for news and promotions.|Promotion|📣|bar
Popup Widget|Create eye-catching popups that engage visitors.|Promotion|🪟|popup
Countdown Timer|Create urgency with a live countdown.|Promotion|⏱️|cd
Sales Notifications|Show recent-activity notifications.|Promotion|🔔|bar
Newsletter Signup|Grow your email list with a signup form.|Promotion|📬|form
Contact Form|Collect leads with a simple contact form.|Forms|✉️|form
Form Builder|Build custom forms with the fields you need.|Forms|📝|form
Poll|Ask visitors a question and show results.|Forms|📊|list
Quiz|Engage visitors with an interactive quiz.|Forms|🧠|list
Appointment Booking|Let customers pick a date and time.|Forms|🗓️|cal
FAQ Accordion|Answer common questions in a tidy accordion.|Content|❓|faq
Event Calendar|List upcoming events in a clean calendar.|Content|📅|cal
Team Members|Introduce the people behind your business.|Content|👥|list
Logo Showcase|Display client or partner logos.|Content|🏷️|icons
Pricing Table|Compare your plans side by side.|Content|💳|price
Menu & Price List|Present services or dishes with prices.|Content|📋|list
Business Hours|Show when you’re open.|Content|🕒|list
PDF Embed|Display PDF documents on your page.|Content|📄|list
Language Switcher|Floating menu to switch site language.|Utility|🌐|tog
Accessibility Widget|Let visitors adjust contrast and text size.|Utility|♿|tog
Cookie Consent|Show a cookie notice and collect consent.|Utility|🍪|tog
Google Maps|Embed a map with your location.|Utility|🗺️|map
Store Locator|Help customers find your nearest location.|Utility|📍|map
Back to Top Button|Floating button to return to the top.|Utility|⬆️|btn
Weather|Show live-style weather for any city.|Utility|⛅|list
Custom HTML|Drop in any custom HTML snippet.|Utility|</>|list`;

const BG = [
  "#dcfce7",
  "#f3e8ff",
  "#fce7f3",
  "#fef3c7",
  "#ffe4e6",
  "#dbeafe",
  "#d1fae5",
  "#ffedd5",
  "#ede9fe",
  "#e0e7ff",
  "#e0f2fe",
  "#fae8ff",
];

interface WidgetDef {
  id: string;
  name: string;
  desc: string;
  cat: string;
  icon: string;
  bg: string;
  type: string;
}

const WIDGETS: WidgetDef[] = RAW_WIDGETS.split("\n").map((line, i) => {
  const [name = "", desc = "", cat = "", icon = "", type = ""] = line.split("|");
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    desc,
    cat,
    icon,
    bg: BG[i % BG.length]!,
    type,
  };
});

const CATEGORIES = ["All", ...Array.from(new Set(WIDGETS.map((w) => w.cat)))];

const BRAND_COLORS = [
  { label: "Purple", color: "#7c3aed" },
  { label: "Green", color: "#16a34a" },
  { label: "Pink", color: "#e11d74" },
  { label: "Orange", color: "#f97316" },
  { label: "Blue", color: "#0ea5e9" },
];

const TRUST_POINTS = [
  { icon: "🔒", title: "Previews run in your browser", desc: "The demos on this page run locally. This page doesn’t collect your information." },
  { icon: "🧩", title: "You choose what’s embedded", desc: "Add only the widgets you want. Your stack and snippet are generated for you." },
  { icon: "✅", title: "Everything shown works", desc: "Every widget listed here is ready to install and previewable right now." },
  { icon: "🔑", title: "Sign in only to save", desc: "Explore freely. Create an account when you’re ready to save widgets and get your embed code." },
];

function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Countdown timer state
  const [countdown, setCountdown] = useState("02:14:09");

  // Configurator / Demo mock site state
  const [activeWidgets, setActiveWidgets] = useState({
    ann: true,
    cd: true,
    rev: true,
    wa: true,
    pop: false,
  });
  const [brandColor, setBrandColor] = useState("#7c3aed");
  const [waChatOpen, setWaChatOpen] = useState(false);

  // Widget Explorer state
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stack, setStack] = useState<Set<string>>(new Set());

  // Live preview modal state
  const [previewWidget, setPreviewWidget] = useState<WidgetDef | null>(null);

  // Standalone popup modal preview state
  const [popupModalOpen, setPopupModalOpen] = useState(false);

  // Copy code feedback
  const [copyText, setCopyText] = useState("Copy");

  // Live countdown ticker effect
  useEffect(() => {
    let end = Date.now() + 2 * 3600e3 + 14 * 60e3 + 9e3;
    const pad = (n: number) => String(n).padStart(2, "0");

    const timer = setInterval(() => {
      let s = Math.max(0, Math.floor((end - Date.now()) / 1e3));
      if (!s) {
        end = Date.now() + 3 * 3600e3;
        s = 10800;
      }
      setCountdown(`${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter widgets for explorer
  const filteredWidgets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WIDGETS.filter((w) => {
      const matchCat = selectedCat === "All" || w.cat === selectedCat;
      const matchQuery = !q || `${w.name} ${w.desc} ${w.cat}`.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  // Toggle widget in stack
  const toggleStack = (id: string) => {
    setStack((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Copy embed snippet handler
  const handleCopySnippet = async () => {
    const code = `<script src="https://cdn.widgets.webtoolocean.com/embed.js"\n        data-widget="whatsapp-chat"></script>`;
    try {
      await navigator.clipboard.writeText(code);
      setCopyText("Copied ✓");
    } catch {
      setCopyText("Press Ctrl+C");
    }
    setTimeout(() => setCopyText("Copy"), 1800);
  };

  const dashboardTarget = user ? "/dashboard" : "/login";

  return (
    <div className="landing-page">
      {/* ===================== HEADER ===================== */}
      <header className="hd">
        <a className="logo" href="#top">
          <span className="logo-mark">≋</span>
          <b>WebToolOcean</b>
          <small>Widget Studio</small>
        </a>
        <nav aria-label="Main">
          <a href="#try">Try it live</a>
          <a href="#library">Widgets</a>
          <a href="#how">How it works</a>
          <a href="#trust">Trust</a>
          <a href="#embed">Embed</a>
        </nav>
        <div className="hr">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => signOut()}
                className="btn ghost text-xs py-2 px-3 text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
              <Link to="/dashboard" className="btn pri">
                Open Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn ghost">
                Sign In
              </Link>
              <Link to="/login" className="btn pri">
                Open Dashboard
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ===================== MAIN ===================== */}
      <main id="top">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hgfx" aria-hidden="true">
            <i className="orb o1" />
            <i className="orb o2" />
            <i className="orb o3" />
            <i className="gridbg" />
            <div className="fc c1">
              <b className="star">★★★★★</b>
              <span>4.9 · Google Reviews</span>
            </div>
            <div className="fc c2">
              <span className="wab">💬</span>
              <span>Hi 👋 Need help?</span>
            </div>
            <div className="fc c3">
              <small>SALE ENDS IN</small>
              <b className="tick">{countdown}</b>
            </div>
            <div className="fc c4">
              <span>🎉 Summer menu is live</span>
            </div>
            <div className="fc c5">
              <b>Get 10% off</b>
              <small>Join our list</small>
              <u>Claim offer</u>
            </div>
            <div className="fc c6">
              <span>❓ How do I install?</span>
              <small>Paste one snippet.</small>
            </div>
          </div>

          <div className="wrap">
            <p className="pill">✨ Fast, zero-code widgets</p>
            <h1>
              Add <span className="g">powerful widgets</span> to any website in minutes
            </h1>
            <p className="lead">
              WhatsApp chat, Google reviews, countdown timers, FAQs and popups. Customize them visually and embed with a single JavaScript snippet. Everything below is live: click it.
            </p>
            <div className="row">
              <Link to={dashboardTarget} className="btn pri lg">
                Create Your First Widget →
              </Link>
              <a className="btn ghost lg" href="#try">
                Try widgets live
              </a>
            </div>

            {/* Marquee */}
            <div className="mq" aria-hidden="true">
              <div className="mqt">
                {WIDGETS.concat(WIDGETS).map((w, idx) => (
                  <span key={idx}>
                    {w.icon} {w.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="stats">
              <div>
                <b>{WIDGETS.length}</b>ready-to-install widgets
              </div>
              <div>
                <b>0</b>code to write
              </div>
              <div>
                <b>1</b>snippet to embed
              </div>
            </div>

            {/* INTERACTIVE DEMO STACK BUILDER */}
            <div className="demo" id="try">
              <div className="ctrl">
                <h2>Build your site’s widget stack</h2>
                <p>Toggle widgets and pick a brand colour. Watch the sample site change.</p>

                {/* Toggles */}
                <div className="tg">
                  <button
                    type="button"
                    aria-pressed={activeWidgets.ann}
                    onClick={() => setActiveWidgets((s) => ({ ...s, ann: !s.ann }))}
                  >
                    Announcement
                  </button>
                  <button
                    type="button"
                    aria-pressed={activeWidgets.cd}
                    onClick={() => setActiveWidgets((s) => ({ ...s, cd: !s.cd }))}
                  >
                    Countdown
                  </button>
                  <button
                    type="button"
                    aria-pressed={activeWidgets.rev}
                    onClick={() => setActiveWidgets((s) => ({ ...s, rev: !s.rev }))}
                  >
                    Google Reviews
                  </button>
                  <button
                    type="button"
                    aria-pressed={activeWidgets.wa}
                    onClick={() => setActiveWidgets((s) => ({ ...s, wa: !s.wa }))}
                  >
                    WhatsApp Chat
                  </button>
                  <button
                    type="button"
                    aria-pressed={activeWidgets.pop}
                    onClick={() => setActiveWidgets((s) => ({ ...s, pop: !s.pop }))}
                  >
                    Popup
                  </button>
                </div>

                {/* Brand colour switcher */}
                <div className="sw" role="group" aria-label="Brand colour">
                  {BRAND_COLORS.map((bc) => (
                    <button
                      key={bc.color}
                      type="button"
                      style={{ ["--c" as string]: bc.color }}
                      aria-label={bc.label}
                      aria-pressed={brandColor === bc.color}
                      onClick={() => setBrandColor(bc.color)}
                    />
                  ))}
                </div>
              </div>

              {/* Sample site window */}
              <div className="win">
                <div className="wb">
                  <i />
                  <i />
                  <i />
                  <span>cedar-bakery.example</span>
                </div>
                <div className="site" id="site" style={{ ["--wc" as string]: brandColor }}>
                  {/* Announcement Bar */}
                  {activeWidgets.ann && (
                    <div className="wann">
                      🥐 Free delivery on orders over $30 today{" "}
                      <button
                        type="button"
                        aria-label="Dismiss"
                        onClick={() => setActiveWidgets((s) => ({ ...s, ann: false }))}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Nav */}
                  <nav className="sn">
                    <b>Cedar &amp; Co.</b>
                    <span>Menu</span>
                    <span>Visit</span>
                    <span>Contact</span>
                  </nav>

                  {/* Body */}
                  <div className="sbody">
                    <div>
                      <h3>Fresh bread, baked every morning</h3>
                      <p>Sample website showing widgets in place.</p>
                      <span className="sbtn">Order now</span>

                      {/* Countdown */}
                      {activeWidgets.cd && (
                        <div className="wcd">
                          ⏳ Sale ends in <b className="tick">{countdown}</b>
                        </div>
                      )}

                      {/* Reviews */}
                      {activeWidgets.rev && (
                        <div className="wrev">
                          ★★★★★ <span>4.9 on Google Reviews</span>
                        </div>
                      )}
                    </div>
                    <div className="loaf" aria-hidden="true" />
                  </div>

                  {/* Popup Modal */}
                  {activeWidgets.pop && (
                    <div className="wpop">
                      <button
                        type="button"
                        aria-label="Close popup"
                        onClick={() => setActiveWidgets((s) => ({ ...s, pop: false }))}
                      >
                        ✕
                      </button>
                      <b>Get 10% off</b>
                      <p>Join our list for your first order.</p>
                      <span className="sbtn">Claim offer</span>
                    </div>
                  )}

                  {/* WhatsApp Floating Chat */}
                  {activeWidgets.wa && (
                    <div className="wa">
                      {waChatOpen && (
                        <div className="chatbox">
                          <b>Cedar &amp; Co.</b>
                          <p>Hi 👋 How can we help?</p>
                          <span>Chat on WhatsApp</span>
                        </div>
                      )}
                      <button
                        type="button"
                        className="fab"
                        aria-label="Open chat"
                        aria-expanded={waChatOpen}
                        onClick={() => setWaChatOpen((o) => !o)}
                      >
                        💬
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WIDGET EXPLORER LIBRARY */}
        <section className="sec" id="library">
          <div className="wrap">
            <h2 className="h">Explore every widget. Build your stack.</h2>
            <p className="sub">
              Preview each widget live, add the ones you like, and sign in to save them and get your embed code.
            </p>

            <div className="bar2">
              <div className="pills" role="group" aria-label="Categories">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={selectedCat === c}
                    onClick={() => setSelectedCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <form className="srch" role="search" onSubmit={(e) => e.preventDefault()}>
                <label className="sr" htmlFor="wq">
                  Search widgets
                </label>
                <input
                  id="wq"
                  type="search"
                  placeholder="Search widgets…"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <p className="cnt" role="status">
              Showing {filteredWidgets.length} of {WIDGETS.length} ready-to-install widgets
            </p>

            {filteredWidgets.length === 0 ? (
              <p className="none">No widgets match. Try “chat” or “reviews”.</p>
            ) : (
              <div className="wgrid">
                {filteredWidgets.map((w) => {
                  const isInStack = stack.has(w.id);
                  return (
                    <article key={w.id} className={`wc rdy ${isInStack ? "in" : ""}`}>
                      <span className="st r">Ready</span>
                      <span className="wi" style={{ ["--bg" as string]: w.bg }} aria-hidden="true">
                        {w.icon}
                      </span>
                      <h3>{w.name}</h3>
                      <p>{w.desc}</p>
                      <div className="wb2">
                        <button
                          type="button"
                          className="btn ghost"
                          onClick={() => setPreviewWidget(w)}
                        >
                          Live preview
                        </button>
                        <button
                          type="button"
                          className="btn pri"
                          aria-pressed={isInStack}
                          onClick={() => toggleStack(w.id)}
                        >
                          {isInStack ? "✓ Added" : "+ Add to my stack"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="sec tint" id="trust">
          <div className="wrap">
            <h2 className="h">Built to be trusted</h2>
            <p className="sub">Clear about what works today, and what doesn’t yet.</p>
            <div className="tr">
              {TRUST_POINTS.map((tp) => (
                <div key={tp.title}>
                  <span aria-hidden="true">{tp.icon}</span>
                  <h3>{tp.title}</h3>
                  <p>{tp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="sec tint" id="how">
          <div className="wrap">
            <h2 className="h">Live in three steps</h2>
            <ol className="steps">
              <li>
                <b>1</b>
                <h3>Pick a widget</h3>
                <p>Choose from the library in your dashboard.</p>
              </li>
              <li>
                <b>2</b>
                <h3>Customize it</h3>
                <p>Set colours, text and behaviour, and preview instantly.</p>
              </li>
              <li>
                <b>3</b>
                <h3>Paste one snippet</h3>
                <p>Add the JavaScript snippet to your site. Done.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* EMBED SNIPPET */}
        <section className="sec" id="embed">
          <div className="wrap two">
            <div>
              <h2 className="h">One snippet. Any website.</h2>
              <p className="sub">
                Works with any site where you can add a script tag, including WordPress, Shopify, Webflow or plain HTML.
              </p>
              <Link to={dashboardTarget} className="btn pri lg">
                Get Started Free →
              </Link>
            </div>
            <div className="code">
              <pre id="code">{`<script src="https://cdn.widgets.webtoolocean.com/embed.js"\n        data-widget="whatsapp-chat"></script>`}</pre>
              <button type="button" className="btn ghost" id="copy" onClick={handleCopySnippet}>
                {copyText}
              </button>
              <small>Illustrative example. Your real snippet is generated in the dashboard.</small>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="cta">
          <div className="wrap">
            <h2>Ready to make your website work smarter?</h2>
            <p>Sign in to build and save your widgets.</p>
            <div className="row c">
              <Link to={dashboardTarget} className="btn wh lg">
                Open Dashboard →
              </Link>
              {!user && (
                <Link to="/login" className="btn ol lg">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="ft">
        <div className="wrap">
          <p>© {new Date().getFullYear()} WebToolOcean Widget Studio</p>
          <p>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="https://webtoolocean.com/">WebToolOcean.com</a>
          </p>
        </div>
      </footer>

      {/* ===================== FLOATING STACK TRAY ===================== */}
      {stack.size > 0 && (
        <aside className="tray" aria-label="Your widget stack">
          <div className="tl">
            <b id="tcount">
              {stack.size} widget{stack.size === 1 ? "" : "s"} in your stack
            </b>
            <div className="tchips">
              {Array.from(stack).map((id) => {
                const w = WIDGETS.find((x) => x.id === id);
                return <span key={id}>{w ? w.name : id}</span>;
              })}
            </div>
          </div>
          <div className="tcode">
            <code>
              {`<script src="https://cdn.widgets.webtoolocean.com/embed.js" data-widgets="${Array.from(stack).join(",")}"></script>`}
            </code>
            <span className="lock">
              {user ? "✓ Stack ready" : "🔒 Sign in to unlock"}
            </span>
          </div>
          <Link to={dashboardTarget} className="btn pri">
            Save &amp; Get Embed Code →
          </Link>
        </aside>
      )}

      {/* ===================== LIVE PREVIEW MODAL ===================== */}
      {previewWidget && (
        <div className="ov" onClick={(e) => e.target === e.currentTarget && setPreviewWidget(null)}>
          <div className="mod pvm" role="dialog" aria-modal="true" aria-labelledby="pvt">
            <button type="button" aria-label="Close" onClick={() => setPreviewWidget(null)}>
              ✕
            </button>
            <h3 id="pvt">{previewWidget.name} · live preview</h3>
            <div className="stagew">
              {previewWidget.type === "chat" && (
                <div className="mwa">
                  <span>Hi 👋 Need help?</span>
                  <button type="button" aria-label="Chat">
                    {previewWidget.icon}
                  </button>
                </div>
              )}
              {previewWidget.type === "bar" && (
                <div className="wann">🎉 {previewWidget.name}: a sample promotional message</div>
              )}
              {previewWidget.type === "cd" && (
                <div className="cdw">
                  <b className="tick big">{countdown}</b>
                  <small>until the special offer ends</small>
                </div>
              )}
              {previewWidget.type === "rev" && (
                <div>
                  <span style={{ color: "#f5a000", fontSize: "1.2rem" }}>★★★★★</span>
                  <p style={{ marginTop: "6px" }}>“Fast and friendly service!”</p>
                  <small style={{ color: "var(--mute)" }}>Sample review · {previewWidget.name}</small>
                </div>
              )}
              {previewWidget.type === "faq" && (
                <div className="faq">
                  <details open>
                    <summary>How do I install a widget?</summary>
                    Paste one JavaScript snippet on your site.
                  </details>
                  <details>
                    <summary>Do I need to code?</summary>
                    No coding required.
                  </details>
                </div>
              )}
              {previewWidget.type === "popup" && (
                <div style={{ textAlign: "center" }}>
                  <b style={{ fontSize: "1.4rem", color: "var(--p)" }}>Get 10% off</b>
                  <p style={{ color: "var(--mute)", margin: "6px 0 12px", fontSize: "0.9rem" }}>
                    Join our list for your first order.
                  </p>
                  <span className="sbtn">Claim offer</span>
                </div>
              )}
              {["feed", "media", "form", "cal", "list", "icons", "price", "map", "tog", "btn", "tq"].includes(
                previewWidget.type
              ) && (
                <div className="lr">
                  <b>{previewWidget.name}</b>
                  <span>Interactive demonstration preview</span>
                </div>
              )}
            </div>
            <div className="row">
              <button
                type="button"
                className="btn pri"
                onClick={() => {
                  toggleStack(previewWidget.id);
                }}
              >
                {stack.has(previewWidget.id) ? "✓ In my stack (remove)" : "+ Add to my stack"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
