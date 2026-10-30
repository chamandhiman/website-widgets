import { useState, useEffect, useRef, useCallback, type FC } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { LogoCarouselConfig, LogoItem } from "@/lib/logo-carousel/types";
import { getLogoPages, isSafeUrl, getLogoFallbackSvg } from "@/lib/logo-carousel/logoCarouselUtils";
import { cn } from "@/lib/utils";

interface LogoCarouselRendererProps {
  config: LogoCarouselConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  className?: string;
  isEmbed?: boolean;
}

export const LogoCarouselRenderer: FC<LogoCarouselRendererProps> = ({
  config,
  viewport = "desktop",
  className,
  isEmbed = false,
}) => {
  const {
    designId = "classic",
    title,
    description,
    showHeading = true,
    logos = [],
    visibleLogosDesktop = 5,
    logoHeight = 38,
    maxLogoWidth = 150,
    gap = 36,
    gridColumns = 4,
    paddingY = 36,
    containerWidth = "contained",
    autoplay = true,
    speed = 4,
    direction = "left",
    pauseOnHover = true,
    pauseOnFocus = true,
    showArrows = true,
    showDots = true,
    loop = true,
    bgColor = "transparent",
    textColor = "#1E293B",
    logoOpacity = 85,
    grayscale = false,
    hoverColor = true,
    cardRadius = 12,
    showCardBorder = true,
    showCardShadow = false,
  } = config;

  const activeLogos = logos.filter((l) => l.enabled !== false);
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  // Calculate items visible per slide based on viewport
  const itemsPerSlide = isMobile
    ? 2
    : isTablet
    ? Math.min(3, Math.max(2, Math.floor(visibleLogosDesktop * 0.7)))
    : Math.max(1, visibleLogosDesktop);

  const pages = getLogoPages(activeLogos, itemsPerSlide);
  const totalPages = pages.length;

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep currentPage within bounds when items change
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handleNext = useCallback(() => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Autoplay for standard carousel designs
  useEffect(() => {
    const isMarquee = designId === "infinite-marquee";
    const isGrid = designId === "logo-grid";
    if (!autoplay || isPaused || totalPages <= 1 || isMarquee || isGrid) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(1.5, speed || 4) * 1000;
    timerRef.current = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, isPaused, totalPages, speed, designId, handleNext]);

  // Image load error handler
  const handleImageError = (logoId: string) => {
    setFailedImages((prev) => ({ ...prev, [logoId]: true }));
  };

  // Determine styling variations
  const isDarkDesign = designId === "dark-showcase";
  const isCardsDesign = designId === "premium-cards";
  const isGrayscaleDesign = designId === "grayscale-color" || grayscale;
  const isMarqueeDesign = designId === "infinite-marquee";
  const isGridDesign = designId === "logo-grid";
  const isCompactDesign = designId === "compact-strip";

  // Effective Background & Text Color
  const effectiveBg = isDarkDesign
    ? bgColor && bgColor !== "transparent"
      ? bgColor
      : "#0F172A"
    : bgColor;
  const effectiveText = isDarkDesign
    ? textColor && textColor !== "#1E293B"
      ? textColor
      : "#F8FAFC"
    : textColor;

  // Single Logo Item Renderer
  const renderLogoItem = (logo: LogoItem, idx: number, keyPrefix = "item") => {
    const hasValidUrl = logo.websiteUrl && isSafeUrl(logo.websiteUrl);
    const hasFailed = failedImages[logo.id];
    const imgSrc = hasFailed ? getLogoFallbackSvg(logo.name) : logo.imageUrl || getLogoFallbackSvg(logo.name);

    const logoInner = (
      <div
        className={cn(
          "group relative flex items-center justify-center transition-all duration-300 select-none",
          isCardsDesign && "w-full h-full p-3 bg-card dark:bg-slate-800/80",
          isCardsDesign && showCardBorder && "border border-border/80",
          isCardsDesign && showCardShadow && "shadow-xs hover:shadow-md hover:-translate-y-0.5",
          isCardsDesign && "rounded-xl"
        )}
        style={{
          borderRadius: isCardsDesign ? `${cardRadius}px` : undefined,
        }}
      >
        <img
          src={imgSrc}
          alt={logo.altText || logo.name}
          title={logo.name}
          onError={() => handleImageError(logo.id)}
          className={cn(
            "object-contain max-w-full transition-all duration-300",
            isGrayscaleDesign && "filter grayscale contrast-75",
            isGrayscaleDesign && hoverColor && "group-hover:filter-none group-hover:contrast-100 group-hover:scale-105",
            isDarkDesign && "brightness-125 contrast-125 dark:brightness-100",
            !isGrayscaleDesign && "hover:scale-105"
          )}
          style={{
            height: isCompactDesign ? `${Math.max(22, logoHeight * 0.7)}px` : `${logoHeight}px`,
            maxWidth: `${maxLogoWidth}px`,
            opacity: logoOpacity / 100,
          }}
          loading="lazy"
        />
      </div>
    );

    if (hasValidUrl) {
      return (
        <a
          key={`${keyPrefix}-${logo.id}-${idx}`}
          href={logo.websiteUrl}
          target={logo.openInNewTab ? "_blank" : undefined}
          rel={logo.openInNewTab ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg transition-transform focus:scale-105"
          aria-label={`${logo.name} (opens in new window)`}
        >
          {logoInner}
        </a>
      );
    }

    return (
      <div key={`${keyPrefix}-${logo.id}-${idx}`} className="inline-flex items-center justify-center">
        {logoInner}
      </div>
    );
  };

  return (
    <section
      className={cn("w-full relative transition-colors duration-200 overflow-hidden", className)}
      style={{
        backgroundColor: effectiveBg,
        color: effectiveText,
        paddingTop: isCompactDesign ? "12px" : `${paddingY}px`,
        paddingBottom: isCompactDesign ? "12px" : `${paddingY}px`,
      }}
      aria-roledescription="logo-showcase"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onFocus={() => pauseOnFocus && setIsPaused(true)}
      onBlur={() => pauseOnFocus && setIsPaused(false)}
    >
      <div
        className={cn(
          "mx-auto px-4 sm:px-6",
          containerWidth === "contained" ? "max-w-6xl" : "w-full"
        )}
      >
        {/* Optional Heading Section */}
        {showHeading && (title || description) && !isCompactDesign && (
          <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto space-y-1.5">
            {title && (
              <h3
                className={cn(
                  "font-bold tracking-tight text-foreground",
                  designId === "trusted-by" ? "text-lg sm:text-xl font-extrabold uppercase tracking-wider text-muted-foreground/90" : "text-base sm:text-lg"
                )}
                style={{ color: effectiveText }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                style={{ opacity: 0.85 }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* DESIGN VARIANT 1: INFINITE MARQUEE */}
        {/* ============================================================== */}
        {isMarqueeDesign ? (
          <div className="relative w-full overflow-hidden py-1">
            {/* Subtle Gradient Fade Edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-background to-transparent opacity-80" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-background to-transparent opacity-80" />

            <div
              className={cn(
                "flex items-center w-max",
                direction === "right" ? "animate-marquee-reverse" : "animate-marquee",
                pauseOnHover && "hover:[animation-play-state:paused]",
                pauseOnFocus && "focus-within:[animation-play-state:paused]"
              )}
              style={{
                gap: `${gap}px`,
                animationDuration: `${Math.max(10, (activeLogos.length * 35) / Math.max(1, speed))}s`,
              }}
            >
              {/* Primary Sequence */}
              {activeLogos.map((logo, idx) => renderLogoItem(logo, idx, "track-1"))}
              {/* Duplicate Sequence for continuous seamless loop without jump */}
              <div
                className="flex items-center"
                style={{ gap: `${gap}px` }}
                aria-hidden="true"
              >
                {activeLogos.map((logo, idx) => renderLogoItem(logo, idx, "track-2"))}
              </div>
            </div>
          </div>
        ) : isGridDesign ? (
          /* ============================================================== */
          /* DESIGN VARIANT 2: LOGO GRID */
          /* ============================================================== */
          <div
            className="grid w-full items-center justify-items-center"
            style={{
              gap: `${gap}px`,
              gridTemplateColumns: isMobile
                ? "repeat(2, minmax(0, 1fr))"
                : isTablet
                ? `repeat(${Math.min(3, gridColumns)}, minmax(0, 1fr))`
                : `repeat(${gridColumns}, minmax(0, 1fr))`,
            }}
          >
            {activeLogos.map((logo, idx) => renderLogoItem(logo, idx, "grid"))}
          </div>
        ) : (
          /* ============================================================== */
          /* DESIGN VARIANT 3: INTERACTIVE SLIDER (Classic, Trusted By, etc.) */
          /* ============================================================== */
          <div className="relative w-full">
            {/* Logo Slide Container */}
            <div className="relative w-full overflow-hidden">
              <div
                className="flex items-center justify-around w-full transition-all duration-500 ease-out"
                style={{ gap: `${gap}px` }}
              >
                {pages[currentPage]?.map((logo, idx) =>
                  renderLogoItem(logo, idx, `slide-${currentPage}`)
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && totalPages > 1 && (
              <div className="flex items-center justify-between pointer-events-none absolute inset-y-0 -left-2 -right-2 sm:-left-4 sm:-right-4">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm hover:bg-muted transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
                  aria-label="Previous logo slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-sm hover:bg-muted transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500"
                  aria-label="Next logo slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Pagination Dots */}
            {showDots && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {pages.map((_, pIdx) => (
                  <button
                    key={`dot-${pIdx}`}
                    type="button"
                    onClick={() => setCurrentPage(pIdx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      pIdx === currentPage
                        ? "w-5 bg-purple-600"
                        : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    )}
                    aria-label={`Go to slide page ${pIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Embedded CSS Keyframes for Marquee Loop */}
      <style>{`
        @keyframes wto-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wto-marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          display: flex;
          animation: wto-marquee linear infinite;
        }
        .animate-marquee-reverse {
          display: flex;
          animation: wto-marquee-reverse linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee, .animate-marquee-reverse {
            animation: none !important;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
};
