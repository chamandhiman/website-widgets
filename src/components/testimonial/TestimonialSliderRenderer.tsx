import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  ExternalLink,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import {
  type TestimonialSliderConfig,
  type TestimonialItem,
} from "@/lib/testimonial/types";
import {
  getInitials,
  normalizeRating,
  getTestimonialPages,
} from "@/lib/testimonial/testimonialUtils";
import { cn } from "@/lib/utils";

interface TestimonialSliderRendererProps {
  config: TestimonialSliderConfig;
  viewport?: "desktop" | "tablet" | "mobile";
  className?: string;
}

export function TestimonialSliderRenderer({
  config,
  viewport = "desktop",
  className,
}: TestimonialSliderRendererProps) {
  const {
    designId,
    title,
    description,
    testimonials = [],
    autoplay,
    autoplayInterval,
    showArrows,
    showDots,
    desktopColumns,
    showPhotos,
    showRatings,
    showDesignation,
    showCompany,
  } = config;

  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  // Calculate items visible per slide
  // Single-item designs: Quote Focus is always 1 item per slide
  // Compact design is 1 on mobile/tablet, max 2 on desktop
  const itemsPerSlide =
    designId === "quote-focus"
      ? 1
      : isMobile
      ? 1
      : isTablet
      ? Math.min(2, desktopColumns)
      : Math.min(3, Math.max(1, desktopColumns));

  const pages = getTestimonialPages(testimonials, itemsPerSlide);
  const totalPages = pages.length;

  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep currentPage within bounds when testimonials change
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

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || isPaused || totalPages <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(2, autoplayInterval || 5) * 1000;
    timerRef.current = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, autoplayInterval, isPaused, totalPages, handleNext]);

  // Empty state
  if (testimonials.length === 0) {
    return (
      <div
        className={cn(
          "w-full rounded-2xl border border-dashed border-slate-200 bg-white/80 p-12 text-center text-slate-500",
          designId === "dark" && "bg-slate-900 border-slate-800 text-slate-400",
          className
        )}
      >
        <MessageSquareQuote className="mx-auto h-10 w-10 text-slate-400 mb-3 opacity-60" />
        <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No Testimonials Added Yet
        </h4>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Add your first testimonial in the Content tab to see it live here.
        </p>
      </div>
    );
  }

  const currentItems = pages[currentPage] || [];

  return (
    <div
      className={cn(
        "w-full font-sans transition-all duration-300",
        designId === "dark" ? "text-slate-100" : "text-slate-900",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header section */}
      {(title || description) && (
        <div
          className={cn(
            "mb-6 text-center max-w-2xl mx-auto px-4",
            designId === "elegant" && "font-serif",
            designId === "compact" && "mb-4 text-left"
          )}
        >
          {title && (
            <h3
              className={cn(
                "font-bold tracking-tight",
                designId === "elegant" ? "text-2xl md:text-3xl font-serif text-amber-950 dark:text-amber-100" : "text-xl md:text-2xl",
                designId === "dark" && "text-white",
                designId === "minimal" && "font-medium text-slate-800",
                designId === "compact" && "text-lg font-semibold"
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              className={cn(
                "mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2",
                designId === "dark" && "text-slate-400",
                designId === "elegant" && "italic text-amber-800/80 dark:text-amber-200/70"
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Slider Viewport Container */}
      <div className="relative group px-1">
        {/* Navigation Arrows */}
        {showArrows && totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial slide"
              className={cn(
                "absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95",
                designId === "dark"
                  ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                  : designId === "elegant"
                  ? "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-purple-600"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial slide"
              className={cn(
                "absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95",
                designId === "dark"
                  ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                  : designId === "elegant"
                  ? "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-purple-600"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Testimonial Cards Layout */}
        <div
          className={cn(
            "grid gap-4 sm:gap-5 transition-all duration-300",
            itemsPerSlide === 1 && "grid-cols-1",
            itemsPerSlide === 2 && "grid-cols-1 sm:grid-cols-2",
            itemsPerSlide === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {currentItems.map((item) => (
            <TestimonialCard
              key={item.id}
              item={item}
              designId={designId}
              showPhotos={showPhotos}
              showRatings={showRatings}
              showDesignation={showDesignation}
              showCompany={showCompany}
            />
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {showDots && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5" role="tablist">
          {pages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentPage(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-selected={currentPage === idx}
              role="tab"
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                currentPage === idx
                  ? designId === "dark"
                    ? "w-6 bg-purple-400"
                    : designId === "elegant"
                    ? "w-6 bg-amber-700"
                    : "w-6 bg-purple-600"
                  : designId === "dark"
                  ? "w-2 bg-slate-700 hover:bg-slate-600"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Individual Card Renderer for the 6 Distinct Designs
// -------------------------------------------------------------

interface TestimonialCardProps {
  item: TestimonialItem;
  designId: TestimonialSliderConfig["designId"];
  showPhotos: boolean;
  showRatings: boolean;
  showDesignation: boolean;
  showCompany: boolean;
}

function TestimonialCard({
  item,
  designId,
  showPhotos,
  showRatings,
  showDesignation,
  showCompany,
}: TestimonialCardProps) {
  const rating = normalizeRating(item.rating);
  const initials = getInitials(item.name);
  const subtitle = [
    showDesignation && item.designation,
    showCompany && item.company,
  ]
    .filter(Boolean)
    .join(" · ");

  // Render Stars Component
  const renderStars = (starColorClass = "text-amber-400 fill-amber-400") => {
    if (!showRatings) return null;
    return (
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < rating ? starColorClass : "text-slate-200 fill-transparent dark:text-slate-700"
            )}
          />
        ))}
      </div>
    );
  };

  // Avatar / Photo Element
  const renderAvatar = (sizeClasses = "h-11 w-11") => {
    if (!showPhotos) return null;
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-slate-200/80 bg-slate-100 dark:border-slate-700 dark:bg-slate-800",
          sizeClasses
        )}
      >
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to initials on broken image URL
              (e.currentTarget as HTMLElement).style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerText = initials;
                parent.className +=
                  " flex items-center justify-center font-bold text-xs text-purple-700 bg-purple-100";
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-bold text-xs text-purple-700 bg-purple-100 dark:bg-purple-950 dark:text-purple-300">
            {initials}
          </div>
        )}
      </div>
    );
  };

  // -----------------------------------------------------------
  // DESIGN 1: Modern Cards
  // Elevated white card with subtle shadows, rounded borders, clean details
  // -----------------------------------------------------------
  if (designId === "modern-cards") {
    return (
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            {renderStars("text-amber-400 fill-amber-400")}
            <Quote className="h-5 w-5 text-purple-200 shrink-0" />
          </div>
          <p className="text-sm leading-relaxed text-slate-700 mb-5">
            "{item.review}"
          </p>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          {renderAvatar("h-11 w-11")}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-900 truncate">
                {item.name}
              </span>
              {item.websiteUrl && (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-purple-600 transition-colors"
                  aria-label={`Visit ${item.name}'s link`}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // DESIGN 2: Minimal
  // Clean typography, minimal borders, subtle dividers, focus on text
  // -----------------------------------------------------------
  if (designId === "minimal") {
    return (
      <div className="flex flex-col justify-between rounded-xl border-l-2 border-l-purple-600 border-t border-r border-b border-slate-200/60 bg-slate-50/50 p-5 sm:p-6 transition-all duration-200">
        <div>
          {renderStars("text-amber-500 fill-amber-500")}
          <blockquote className="mt-3 text-sm sm:text-base leading-relaxed text-slate-800 font-normal">
            “{item.review}”
          </blockquote>
        </div>

        <div className="flex items-center gap-3 mt-5 pt-3 border-t border-slate-200/60">
          {renderAvatar("h-9 w-9")}
          <div className="min-w-0 flex-1">
            <span className="font-medium text-sm text-slate-900 block truncate">
              {item.name}
            </span>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // DESIGN 3: Elegant
  // Serif typography, luxury warm palette, refined spacing & borders
  // -----------------------------------------------------------
  if (designId === "elegant") {
    return (
      <div className="flex flex-col justify-between rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50/40 to-white p-6 shadow-2xs transition-all duration-200 font-serif">
        <div>
          <div className="flex items-center justify-between mb-4">
            {renderStars("text-amber-500 fill-amber-500")}
            <span className="text-xs font-sans tracking-widest uppercase text-amber-700/70 font-semibold">
              Verified
            </span>
          </div>
          <p className="text-sm sm:text-base italic leading-relaxed text-slate-800 mb-6 font-serif">
            “{item.review}”
          </p>
        </div>

        <div className="flex items-center gap-3.5 pt-4 border-t border-amber-100 font-sans">
          {renderAvatar("h-11 w-11 ring-2 ring-amber-300/60")}
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-sm text-slate-900 block font-serif truncate">
              {item.name}
            </span>
            {subtitle && (
              <p className="text-xs text-amber-900/70 font-sans truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // DESIGN 4: Dark
  // Dark slate-900 canvas, glowing subtle border, high contrast text
  // -----------------------------------------------------------
  if (designId === "dark") {
    return (
      <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/95 p-5 sm:p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-all duration-200 text-slate-100">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            {renderStars("text-amber-400 fill-amber-400")}
            <Sparkles className="h-4 w-4 text-purple-400/80" />
          </div>
          <p className="text-sm leading-relaxed text-slate-300 mb-5">
            "{item.review}"
          </p>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          {renderAvatar("h-11 w-11 ring-1 ring-purple-500/30")}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-white truncate">
                {item.name}
              </span>
              {item.websiteUrl && (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-purple-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // DESIGN 5: Quote Focus
  // Prominent quotation mark, large centered testimonial statement,
  // attribution beneath
  // -----------------------------------------------------------
  if (designId === "quote-focus") {
    return (
      <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/40 via-white to-white p-7 sm:p-10 text-center shadow-xs">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100/70 text-purple-600">
          <Quote className="h-7 w-7" />
        </div>

        {showRatings && (
          <div className="flex justify-center mb-4">
            {renderStars("text-amber-400 fill-amber-400")}
          </div>
        )}

        <blockquote className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-slate-800 mb-6 max-w-2xl mx-auto">
          "{item.review}"
        </blockquote>

        <div className="flex flex-col items-center justify-center gap-2">
          {renderAvatar("h-14 w-14 ring-4 ring-white shadow-sm")}
          <div className="text-center">
            <span className="font-bold text-base text-slate-900 block">
              {item.name}
            </span>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // DESIGN 6: Compact Slider
  // Space-efficient horizontal card suitable for sidebars & narrow columns
  // -----------------------------------------------------------
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center gap-3 mb-2.5">
        {renderAvatar("h-10 w-10")}
        <div className="min-w-0 flex-1">
          <span className="font-semibold text-xs sm:text-sm text-slate-900 block truncate">
            {item.name}
          </span>
          {subtitle && (
            <p className="text-[11px] text-slate-500 truncate leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {renderStars("text-amber-400 fill-amber-400")}
      </div>
      <p className="text-xs leading-relaxed text-slate-700 line-clamp-3">
        "{item.review}"
      </p>
    </div>
  );
}
