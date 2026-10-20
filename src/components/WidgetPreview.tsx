import { useEffect, useState } from "react";
import { Star, X, MessageCircle, ChevronDown } from "lucide-react";


// Widget previews render the user's chosen colors, so inline styles from config are intentional.
const REVIEWS = [
  { name: "Olivia M.", text: "Fantastic service and very friendly staff. Highly recommend!", rating: 5, ago: "2 days ago" },
  { name: "James T.", text: "Quick turnaround and great quality. Will come back again.", rating: 5, ago: "1 week ago" },
  { name: "Sofia L.", text: "Really good experience overall, small wait but worth it.", rating: 4, ago: "3 weeks ago" },
];

function pairs(s: unknown) {
  return String(s ?? "").split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p[0]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WidgetPreview({ type, c, mobile }: { type: string; c: any; mobile: boolean }) {
  const box = {
    background: String(c.bg), color: String(c.text), borderRadius: Number(c.radius),
    padding: Number(c.padding), maxWidth: Number(c.width) || undefined, width: "100%", margin: "0 auto",
  } as const;
  const cols = mobile ? 1 : Number(c.columns) || 1;

  if (type === "google-reviews") {
    return (
      <div style={{ ...box, border: "1px solid #e5e7eb" }}>
        {c.showHeader && <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{String(c.title)}</h3>}
        {c.showRating && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14 }}>
            <b style={{ fontSize: 22 }}>4.8</b>
            <Stars n={5} color={String(c.starColor)} /> <span style={{ opacity: 0.6 }}>Based on 127 Google reviews</span>
          </div>
        )}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: c.layout === "List" ? "1fr" : `repeat(${cols}, minmax(0,1fr))` }}>
          {REVIEWS.map((r) => (
            <div key={r.name} style={{ border: "1px solid #e5e7eb", borderRadius: Math.max(0, Number(c.radius) - 4), padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: 99, background: String(c.accent), color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{r.name[0]}</div>
                <div style={{ fontSize: 13 }}><b>{r.name}</b><div style={{ opacity: 0.55, fontSize: 11 }}>{r.ago}</div></div>
              </div>
              <Stars n={r.rating} color={String(c.starColor)} />
              <p style={{ fontSize: 13, marginTop: 6, opacity: 0.85 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "whatsapp-chat") return <WhatsApp c={c} />;

  if (type === "faq") return <Faq c={c} box={box} />;

  if (type === "countdown") return <Countdown c={c} box={box} />;

  if (type === "testimonials") {
    return (
      <div style={box}>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>{String(c.title)}</h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {pairs(c.items).map(([n, q]) => (
            <figure key={n} style={{ borderLeft: `3px solid ${c.accent}`, padding: "10px 14px", background: "rgba(0,0,0,0.03)", borderRadius: 8 }}>
              <blockquote style={{ fontSize: 14, fontStyle: "italic" }}>“{q}”</blockquote>
              <figcaption style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 13, fontWeight: 600 }}>
                {c.showAvatars && <span style={{ width: 24, height: 24, borderRadius: 99, background: String(c.accent), color: "#fff", display: "grid", placeItems: "center", fontSize: 11 }}>{n?.[0]}</span>}
                {n}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  if (type === "announcement-bar") return <Bar c={c} box={box} />;
  return null;
}

function Stars({ n, color }: { n: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < n ? color : "transparent"} color={color} />
      ))}
    </span>
  );
}

function WhatsApp({ c }: { c: any }) {
  const [open, setOpen] = useState(Boolean(c.startOpen));
  useEffect(() => setOpen(Boolean(c.startOpen)), [c.startOpen]);
  const side = c.position === "Bottom left" ? { left: 16 } : { right: 16 };
  return (
    <div style={{ position: "absolute", bottom: 16, ...side, display: "flex", flexDirection: "column", alignItems: c.position === "Bottom left" ? "flex-start" : "flex-end", gap: 10 }}>
      {open && (
        <div style={{ width: 260, background: String(c.bg), color: String(c.text), borderRadius: Number(c.radius), overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,.15)" }}>
          <div style={{ background: String(c.buttonColor), color: "#fff", padding: 12, fontSize: 14, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            {String(c.agent)} <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={16} /></button>
          </div>
          <div style={{ padding: Number(c.padding) / 1.5, fontSize: 13 }}>
            <div style={{ background: "rgba(0,0,0,.05)", padding: 10, borderRadius: 10 }}>{String(c.welcome)}</div>
            <a href={`https://wa.me/${String(c.phone).replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              style={{ display: "block", textAlign: "center", marginTop: 10, background: String(c.buttonColor), color: "#fff", padding: 8, borderRadius: 99, fontWeight: 600 }}>
              {String(c.buttonText)}
            </a>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label="Toggle WhatsApp chat"
        style={{ width: 56, height: 56, borderRadius: 99, background: String(c.buttonColor), color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 6px 20px rgba(0,0,0,.2)" }}>
        <MessageCircle size={26} />
      </button>
    </div>
  );
}

function Faq({ c, box }: { c: any; box: React.CSSProperties }) {
  const items = pairs(c.items);
  const [open, setOpen] = useState<number | null>(c.openFirst ? 0 : null);
  useEffect(() => setOpen(c.openFirst ? 0 : null), [c.openFirst]);
  return (
    <div style={box}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{String(c.title)}</h3>
      {items.map(([q, a], i) => (
        <div key={i} style={{ borderBottom: "1px solid rgba(0,0,0,.1)" }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 600, fontSize: 14, textAlign: "left" }}>
            {q}<ChevronDown size={18} color={String(c.accent)} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
          {open === i && <p style={{ fontSize: 14, opacity: 0.75, paddingBottom: 12 }}>{a}</p>}
        </div>
      ))}
    </div>
  );
}

function Countdown({ c, box }: { c: any; box: React.CSSProperties }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const end = new Date(String(c.target)).getTime();
  const diff = Math.max(0, (isNaN(end) ? 0 : end) - now) / 1000;
  const parts: [string, number][] = [["Days", Math.floor(diff / 86400)], ["Hours", Math.floor(diff / 3600) % 24], ["Min", Math.floor(diff / 60) % 60]];
  if (c.showSeconds) parts.push(["Sec", Math.floor(diff) % 60]);
  return (
    <div style={{ ...box, textAlign: "center" }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>{String(c.title)}</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
        {parts.map(([l, v]) => (
          <div key={l} style={c.style === "Boxes" ? { background: String(c.accent), color: "#fff", borderRadius: 12, padding: "10px 14px", minWidth: 64 } : { minWidth: 56 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.style === "Boxes" ? "#fff" : String(c.accent) }}>{String(v).padStart(2, "0")}</div>
            <div style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.8 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ c, box }: { c: any; box: React.CSSProperties }) {
  const [shown, setShown] = useState(true);
  useEffect(() => setShown(true), [c]);
  if (!shown) return <button onClick={() => setShown(true)} style={{ fontSize: 12, textDecoration: "underline", opacity: 0.6 }}>Show bar again</button>;
  return (
    <div style={{ ...box, display: "flex", alignItems: "center", gap: 12, justifyContent: c.align === "Left" ? "flex-start" : "center", fontSize: 14, position: "relative" }}>
      <span>{String(c.message)}</span>
      {c.linkText && <a href="#" onClick={(e) => e.preventDefault()} style={{ color: String(c.accent), fontWeight: 700, textDecoration: "underline" }}>{String(c.linkText)}</a>}
      {c.closable && <button onClick={() => setShown(false)} aria-label="Close" style={{ position: "absolute", right: 12 }}><X size={16} /></button>}
    </div>
  );
}
