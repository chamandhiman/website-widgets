import { useState, useMemo, type FC } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Search,
  ChevronDown,
  Plus,
  Minus,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type { FaqWidgetConfig, FaqItem } from "@/lib/faq/types";
import { cn } from "@/lib/utils";

interface FaqLivePreviewProps {
  config: FaqWidgetConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void;
}

export const FaqLivePreview: FC<FaqLivePreviewProps> = ({
  config,
  viewport: externalViewport,
  onViewportChange,
}) => {
  const [internalViewport, setInternalViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const activeViewport = externalViewport || internalViewport;

  const handleViewportChange = (vp: "desktop" | "tablet" | "mobile") => {
    if (onViewportChange) {
      onViewportChange(vp);
    } else {
      setInternalViewport(vp);
    }
  };

  // Live Filter & Expand State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(config.defaultCategory || "All");
  const [openItemIds, setOpenItemIds] = useState<string[]>(() =>
    config.openFirstByDefault && config.items[0] ? [config.items[0].id] : []
  );

  // Reset / Refresh handler
  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory(config.defaultCategory || "All");
    setOpenItemIds(config.openFirstByDefault && config.items[0] ? [config.items[0].id] : []);
  };

  // Toggle item expansion
  const toggleItem = (id: string) => {
    const isOpen = openItemIds.includes(id);

    if (isOpen) {
      if (config.collapsible) {
        setOpenItemIds((prev) => prev.filter((item) => item !== id));
      }
    } else {
      if (config.accordionMode === "single") {
        setOpenItemIds([id]);
      } else {
        setOpenItemIds((prev) => [...prev, id]);
      }
    }
  };

  // Filter items by category & search
  const filteredItems = useMemo(() => {
    return config.items.filter((item) => {
      // Category filter
      if (config.showCategoryFilters && activeCategory !== "All") {
        if (item.category !== activeCategory) {
          return false;
        }
      }

      // Search filter
      if (config.enableSearch && searchQuery.trim()) {
        const q = config.caseInsensitiveSearch
          ? searchQuery.trim().toLowerCase()
          : searchQuery.trim();
        const questionText = config.caseInsensitiveSearch
          ? item.question.toLowerCase()
          : item.question;
        const answerText = config.caseInsensitiveSearch
          ? item.answer.toLowerCase()
          : item.answer;

        return questionText.includes(q) || answerText.includes(q);
      }

      return true;
    });
  }, [config, activeCategory, searchQuery]);

  // Two-column layout is active on desktop when configured
  const isTwoColumn = config.columns === 2 && activeViewport === "desktop";

  return (
    <div className="flex flex-col space-y-3">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            Live Preview
          </span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            · Real-time interactive widget
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Responsive Viewport Switcher */}
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => handleViewportChange("desktop")}
              aria-label="Desktop Preview"
              title="Desktop (100%)"
              className={cn(
                "rounded-md p-1.5 transition-colors",
                activeViewport === "desktop"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleViewportChange("tablet")}
              aria-label="Tablet Preview"
              title="Tablet (768px)"
              className={cn(
                "rounded-md p-1.5 transition-colors",
                activeViewport === "tablet"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleViewportChange("mobile")}
              aria-label="Mobile Preview"
              title="Mobile (375px)"
              className={cn(
                "rounded-md p-1.5 transition-colors",
                activeViewport === "mobile"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset / Refresh Preview */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset Preview"
            aria-label="Reset Preview"
            className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Live Preview Area - Shows ONLY the FAQ Widget */}
      <div className="relative flex justify-center overflow-y-auto rounded-2xl border border-border/80 bg-slate-50/70 dark:bg-slate-950/40 p-4 md:p-8 min-h-[580px]">
        <div
          className={cn(
            "w-full transition-all duration-300 flex justify-center items-start",
            activeViewport === "mobile"
              ? "max-w-[375px]"
              : activeViewport === "tablet"
              ? "max-w-[768px]"
              : "w-full"
          )}
        >
          {/* ================= ACTUAL FAQ WIDGET COMPONENT ================= */}
          <div
              style={{
                maxWidth: `${config.maxWidth}px`,
                backgroundColor: config.showContainerBg ? config.bgColor : "transparent",
                borderRadius: `${config.borderRadius}px`,
                border: config.showOuterBorder
                  ? `${config.borderWidth}px solid ${config.borderColor}`
                  : "none",
                boxShadow:
                  config.shadow === "subtle"
                    ? "0 4px 14px rgba(0, 0, 0, 0.05)"
                    : config.shadow === "medium"
                    ? "0 10px 25px rgba(0, 0, 0, 0.12)"
                    : "none",
                fontFamily: config.fontFamily !== "inherit" ? config.fontFamily : undefined,
              }}
              className={cn(
                "w-full transition-all duration-200",
                config.showContainerBg && "p-4 sm:p-7",
                config.alignment === "center"
                  ? "mx-auto"
                  : config.alignment === "right"
                  ? "ml-auto"
                  : "mr-auto"
              )}
            >
              {/* FAQ Widget Heading Section */}
              {config.showHeading && (
                <div
                  className="mb-7 space-y-1.5"
                  style={{
                    textAlign: config.headingAlignment,
                  }}
                >
                  <h3
                    style={{
                      fontSize: `${Math.max(config.fontSizeHeading, 28)}px`,
                      color: config.headingColor || "#0f172a",
                    }}
                    className="font-black tracking-tight leading-tight text-slate-950 dark:text-white"
                  >
                    {config.heading}
                  </h3>
                  {config.subtitle && (
                    <p
                      style={{ color: config.answerColor || "#1e293b" }}
                      className="text-sm sm:text-base font-bold leading-relaxed text-slate-800 dark:text-slate-100"
                    >
                      {config.subtitle}
                    </p>
                  )}
                  {config.introText && (
                    <p
                      style={{ color: config.answerColor || "#1e293b" }}
                      className="text-xs sm:text-sm font-semibold pt-1 leading-relaxed text-slate-700 dark:text-slate-200"
                    >
                      {config.introText}
                    </p>
                  )}
                </div>
              )}

              {/* Live Search Input (if enabled) */}
              {config.enableSearch && (
                <div className="relative mb-5">
                  <Search
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
                    style={{ color: config.accentColor }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={config.searchPlaceholder}
                    style={{
                      borderColor: config.borderColor,
                      color: config.questionColor,
                      backgroundColor: config.cardBgColor,
                    }}
                    className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border focus:outline-hidden focus:ring-2 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {/* Category Filter Pills (if enabled) */}
              {config.showCategoryFilters && config.categories.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
                  {config.categories.map((cat) => {
                    const isCatActive = activeCategory === cat;
                    const catCount =
                      cat === "All"
                        ? config.items.length
                        : config.items.filter((it) => it.category === cat).length;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        style={{
                          backgroundColor: isCatActive ? config.accentColor : config.cardBgColor,
                          color: isCatActive ? "#ffffff" : config.questionColor,
                          borderColor: isCatActive ? config.accentColor : config.borderColor,
                        }}
                        className="shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all duration-150 shadow-2xs"
                      >
                        <span>{cat}</span>
                        <span
                          style={{
                            backgroundColor: isCatActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                            color: isCatActive ? "#ffffff" : config.answerColor,
                          }}
                          className="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
                        >
                          {catCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* FAQ Questions List */}
              {filteredItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-foreground text-sm">No matching questions found</p>
                  <p className="mt-1">
                    Try searching with another keyword or resetting the category filter.
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-y-0",
                    isTwoColumn ? "grid-cols-2 gap-x-4 items-start" : "grid-cols-1"
                  )}
                  style={{ gap: config.itemGap > 0 ? `${config.itemGap}px` : undefined }}
                >
                  {filteredItems.map((item, idx) => {
                    const isOpen = openItemIds.includes(item.id);
                    const isHighlightedTemplate = config.template === "highlighted";
                    const isCardTemplate = config.template === "card" || config.template === "bordered";

                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: config.cardBgColor,
                          borderRadius: `${config.borderRadius}px`,
                          borderColor: config.borderColor,
                          borderWidth: isCardTemplate || config.itemGap > 0 ? `${config.borderWidth}px` : undefined,
                          borderBottomWidth:
                            config.itemGap === 0 && !isCardTemplate
                              ? `${config.borderWidth}px`
                              : undefined,
                          boxShadow:
                            config.shadow === "subtle" && isCardTemplate
                              ? "0 2px 8px rgba(0,0,0,0.04)"
                              : undefined,
                          borderLeftWidth: isHighlightedTemplate ? "4px" : undefined,
                          borderLeftColor: isHighlightedTemplate && isOpen ? config.accentColor : undefined,
                        }}
                        className={cn(
                          "transition-all duration-200 overflow-hidden",
                          isCardTemplate && "border p-1",
                          config.itemGap === 0 && !isCardTemplate && "border-b last:border-b-0"
                        )}
                      >
                        {/* Question Header Button */}
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${item.id}`}
                          id={`faq-question-${item.id}`}
                          style={{
                            paddingTop: `${config.paddingY}px`,
                            paddingBottom: `${config.paddingY}px`,
                            paddingLeft: isCardTemplate ? "14px" : "4px",
                            paddingRight: isCardTemplate ? "14px" : "4px",
                          }}
                          className="w-full flex items-center justify-between gap-3 text-left focus:outline-hidden group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              style={{
                                fontSize: `${Math.max(config.fontSizeQuestion, 16)}px`,
                                color: config.questionColor || "#0f172a",
                                fontWeight: config.fontWeightQuestion === "normal" ? 500 : 700,
                              }}
                              className="leading-snug tracking-tight font-bold text-slate-950 dark:text-white"
                            >
                              {item.question}
                            </span>
                            {item.badge && (
                              <span
                                style={{
                                  backgroundColor: `${config.accentColor}18`,
                                  color: config.accentColor,
                                }}
                                className="rounded px-1.5 py-0.5 text-[10px] font-bold shrink-0"
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {/* Expand Icon */}
                          <div
                            style={{ color: config.iconColor }}
                            className="shrink-0 transition-transform duration-200 grid place-items-center"
                          >
                            {config.iconStyle === "chevron" ? (
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform duration-200",
                                  isOpen && "rotate-180"
                                )}
                              />
                            ) : config.iconStyle === "plus-minus" ? (
                              isOpen ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )
                            ) : (
                              <ArrowRight
                                className={cn(
                                  "h-4 w-4 transition-transform duration-200",
                                  isOpen && "rotate-90"
                                )}
                              />
                            )}
                          </div>
                        </button>

                        {/* Expandable Answer Content Panel */}
                        {isOpen && (
                          <div
                            id={`faq-answer-${item.id}`}
                            role="region"
                            aria-labelledby={`faq-question-${item.id}`}
                            style={{
                              paddingLeft: isCardTemplate ? "14px" : "4px",
                              paddingRight: isCardTemplate ? "14px" : "4px",
                              paddingBottom: `${config.paddingY}px`,
                            }}
                            className="animate-in fade-in-50 duration-150"
                          >
                            <AnswerRenderer
                              content={item.answer}
                              fontSize={config.fontSizeAnswer}
                              color={config.answerColor}
                              accentColor={config.accentColor}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Safely renders paragraphs, bullet points, and links without unsafe innerHTML.
 */
function AnswerRenderer({
  content,
  fontSize,
  color,
  accentColor,
}: {
  content: string;
  fontSize: number;
  color: string;
  accentColor: string;
}) {
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <div
      style={{ fontSize: `${Math.max(fontSize, 15)}px`, color: color || "#1e293b" }}
      className="space-y-2.5 leading-relaxed font-semibold text-slate-900 dark:text-slate-100"
    >
      {paragraphs.map((p, pIdx) => {
        const lines = p.split("\n").filter(Boolean);

        // Check if list
        const isBulletList = lines.every((l) => l.trim().startsWith("•") || l.trim().startsWith("- "));
        const isNumberedList = lines.every((l) => /^\d+\.\s/.test(l.trim()));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1">
              {lines.map((l, lIdx) => (
                <li key={lIdx}>{renderFormattedLine(l.replace(/^[•-]\s*/, ""), accentColor)}</li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol key={pIdx} className="list-decimal pl-5 space-y-1">
              {lines.map((l, lIdx) => (
                <li key={lIdx}>{renderFormattedLine(l.replace(/^\d+\.\s*/, ""), accentColor)}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={pIdx}>
            {lines.map((l, lIdx) => (
              <span key={lIdx} className="block">
                {renderFormattedLine(l, accentColor)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Safe markdown link parsing: converts [text](url) to clickable <a> elements securely.
 */
function renderFormattedLine(text: string, accentColor: string) {
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: accentColor }}
        className="font-semibold underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5"
      >
        {linkText}
        <ExternalLink className="h-2.5 w-2.5 inline" />
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
