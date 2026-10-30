import { useState, type FC } from "react";
import type { LogoDesignId } from "@/lib/logo-carousel/types";
import {
  GoogleLogoSvg,
  MicrosoftLogoSvg,
  AppleLogoSvg,
  AmazonLogoSvg,
  MetaLogoSvg,
  AdobeLogoSvg,
  SpotifyLogoSvg,
  SlackLogoSvg,
} from "@/lib/logo-carousel/brandLogos";
import { cn } from "@/lib/utils";

type BrandKey =
  | "google"
  | "microsoft"
  | "apple"
  | "amazon"
  | "meta"
  | "adobe"
  | "spotify"
  | "slack";

interface BrandLogoItemProps {
  brand: BrandKey;
  size?: number;
  grayscale?: boolean;
  inverted?: boolean;
  className?: string;
}

export const BrandLogoItem: FC<BrandLogoItemProps> = ({
  brand,
  size = 20,
  grayscale = false,
  inverted = false,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);

  // SVG Fallback renderer if <img> fails to load
  const renderFallback = () => {
    switch (brand) {
      case "google":
        return <GoogleLogoSvg size={size} grayscale={grayscale} />;
      case "microsoft":
        return <MicrosoftLogoSvg size={size} grayscale={grayscale} />;
      case "apple":
        return <AppleLogoSvg size={size} grayscale={grayscale} inverted={inverted} />;
      case "amazon":
        return <AmazonLogoSvg size={size} grayscale={grayscale} inverted={inverted} />;
      case "meta":
        return <MetaLogoSvg size={size} grayscale={grayscale} />;
      case "adobe":
        return <AdobeLogoSvg size={size} grayscale={grayscale} />;
      case "spotify":
        return <SpotifyLogoSvg size={size} grayscale={grayscale} />;
      case "slack":
        return <SlackLogoSvg size={size} grayscale={grayscale} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn("flex items-center justify-center shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      title={`${brand.charAt(0).toUpperCase() + brand.slice(1)} logo`}
    >
      {!imgError ? (
        <img
          src={`/logos/${brand}.svg`}
          alt={`${brand.charAt(0).toUpperCase() + brand.slice(1)} logo`}
          width={size}
          height={size}
          loading="eager"
          decoding="sync"
          onError={() => setImgError(true)}
          className={cn(
            "max-h-full max-w-full object-contain transition-all duration-150 pointer-events-none",
            grayscale && "filter grayscale opacity-60",
            inverted && "brightness-0 invert"
          )}
        />
      ) : (
        renderFallback()
      )}
    </div>
  );
};

export function MiniatureLogoPreview({ id }: { id: LogoDesignId }) {
  switch (id) {
    // 1. Classic Logo Carousel — a horizontal row of actual logos with slider dots and nav arrows
    case "classic":
      return (
        <div className="flex flex-col justify-between w-full h-full bg-white dark:bg-slate-900 rounded-md p-2 shadow-2xs border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between w-full my-auto gap-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-bold shrink-0">
              ‹
            </span>
            <div className="flex items-center justify-center gap-3 mx-auto">
              <BrandLogoItem brand="google" size={19} />
              <BrandLogoItem brand="microsoft" size={18} />
              <BrandLogoItem brand="apple" size={18} />
              <BrandLogoItem brand="spotify" size={19} />
            </div>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-bold shrink-0">
              ›
            </span>
          </div>
          <div className="flex justify-center gap-1 mt-0.5">
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="h-1 w-2 rounded-full bg-purple-600" />
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
      );

    // 2. Trusted By — a heading with a row of recognizable logos
    case "trusted-by":
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 rounded-md p-2 shadow-2xs border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-[7px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            TRUSTED BY INDUSTRY LEADERS
          </span>
          <div className="flex items-center justify-center gap-3.5 w-full">
            <BrandLogoItem brand="google" size={18} />
            <BrandLogoItem brand="amazon" size={18} />
            <BrandLogoItem brand="meta" size={18} />
            <BrandLogoItem brand="microsoft" size={17} />
          </div>
        </div>
      );

    // 3. Infinite Marquee — multiple logos arranged in a continuous horizontal strip
    case "infinite-marquee":
      return (
        <div className="relative flex items-center w-full h-full bg-white dark:bg-slate-900 rounded-md p-2 shadow-2xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {/* Subtle gradient fades on left and right edges */}
          <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="flex items-center gap-2.5 mx-auto whitespace-nowrap">
            <BrandLogoItem brand="google" size={17} />
            <BrandLogoItem brand="apple" size={17} />
            <BrandLogoItem brand="slack" size={17} />
            <BrandLogoItem brand="microsoft" size={16} />
            <BrandLogoItem brand="spotify" size={17} />
            <BrandLogoItem brand="adobe" size={17} />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        </div>
      );

    // 4. Grayscale to Color — real logos in grayscale with active color-hover demonstration
    case "grayscale-color":
      return (
        <div className="flex items-center justify-center gap-2 w-full h-full bg-white dark:bg-slate-900 rounded-md p-2 shadow-2xs border border-slate-200/80 dark:border-slate-800">
          <BrandLogoItem brand="apple" size={16} grayscale />
          <BrandLogoItem brand="microsoft" size={16} grayscale />
          {/* Center active hover reveal logo */}
          <div className="relative flex items-center justify-center p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 ring-1.5 ring-purple-500 shadow-xs scale-110">
            <BrandLogoItem brand="google" size={19} />
            <span className="absolute -bottom-2 text-[5.5px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tighter bg-purple-100 dark:bg-purple-900/90 px-1 rounded-full">
              Hover
            </span>
          </div>
          <BrandLogoItem brand="spotify" size={16} grayscale />
          <BrandLogoItem brand="slack" size={16} grayscale />
        </div>
      );

    // 5. Logo Grid — real logos arranged in a clean grid
    case "logo-grid":
      return (
        <div className="grid grid-cols-3 gap-y-1.5 gap-x-2 w-full h-full bg-white dark:bg-slate-900 rounded-md p-2 shadow-2xs border border-slate-200/80 dark:border-slate-800 items-center justify-items-center">
          <div className="flex items-center justify-center h-6 w-full">
            <BrandLogoItem brand="google" size={16} />
          </div>
          <div className="flex items-center justify-center h-6 w-full">
            <BrandLogoItem brand="microsoft" size={15} />
          </div>
          <div className="flex items-center justify-center h-6 w-full">
            <BrandLogoItem brand="apple" size={15} />
          </div>
          <div className="flex items-center justify-center h-6 w-full">
            <BrandLogoItem brand="spotify" size={16} />
          </div>
          <div className="flex items-center justify-center h-6 w-full">
            <BrandLogoItem brand="meta" size={16} />
          </div>
          <div className="flex items-center justify-center h-6 w-full">
            <BrandLogoItem brand="slack" size={16} />
          </div>
        </div>
      );

    // 6. Premium Cards — real logos inside individual elevated cards
    case "premium-cards":
      return (
        <div className="flex items-center justify-center gap-1.5 w-full h-full bg-slate-50 dark:bg-slate-950/40 rounded-md p-1.5 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-center h-12 flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-1">
            <BrandLogoItem brand="google" size={18} />
          </div>
          <div className="flex items-center justify-center h-12 flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-1">
            <BrandLogoItem brand="microsoft" size={17} />
          </div>
          <div className="flex items-center justify-center h-12 flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-1">
            <BrandLogoItem brand="apple" size={17} />
          </div>
        </div>
      );

    // 7. Dark Showcase — actual logos on a dark background with suitable contrast
    case "dark-showcase":
      return (
        <div className="flex items-center justify-center gap-2.5 w-full h-full bg-slate-950 rounded-md p-2 shadow-2xs border border-slate-800">
          <BrandLogoItem brand="google" size={17} />
          <BrandLogoItem brand="microsoft" size={16} />
          <BrandLogoItem brand="apple" size={16} inverted />
          <BrandLogoItem brand="spotify" size={17} />
          <BrandLogoItem brand="slack" size={17} />
        </div>
      );

    // 8. Compact Partner Strip — a slim row of real logos
    case "compact-strip":
      return (
        <div className="flex items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-900/40 rounded-md p-1.5 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between w-full h-7 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 px-2.5 shadow-2xs">
            <BrandLogoItem brand="google" size={15} />
            <BrandLogoItem brand="microsoft" size={14} />
            <BrandLogoItem brand="apple" size={14} />
            <BrandLogoItem brand="amazon" size={15} />
            <BrandLogoItem brand="spotify" size={15} />
          </div>
        </div>
      );

    default:
      return null;
  }
}

