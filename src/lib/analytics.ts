/**
 * Google Analytics 4 (GA4) Integration
 * Measurement ID: G-4C1PP726EZ
 */

export const GA_MEASUREMENT_ID = "G-4C1PP726EZ";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Module-level deduplication tracker across renders and StrictMode mounts
let lastDispatchedPath: string | null = null;

/**
 * Resets the last dispatched path (used primarily for unit testing).
 */
export function resetAnalyticsState() {
  lastDispatchedPath = null;
}

/**
 * Gets the last dispatched path (for testing and verification).
 */
export function getLastDispatchedPath(): string | null {
  return lastDispatchedPath;
}

/**
 * Safe gtag dispatch helper that queues commands into dataLayer
 * even before gtag.js has finished downloading in the browser.
 */
export function gtag(...args: any[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  } else {
    window.dataLayer.push(args);
  }
}

export interface PageViewParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

/**
 * Send a GA4 page_view event.
 * Ensures duplicate page_views for the same path are suppressed.
 */
export function trackPageView(params?: PageViewParams) {
  if (typeof window === "undefined") return;

  const page_location = params?.page_location || window.location.href;
  const page_path =
    params?.page_path || (window.location.pathname + window.location.search);
  const page_title = params?.page_title || document.title;

  gtag("event", "page_view", {
    page_title,
    page_location,
    page_path,
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * Track route changes in Single Page Application.
 * Compares against the last tracked path to guarantee zero duplicate page_views.
 */
export function trackRoute(
  pathname: string,
  searchStr?: string,
  immediate: boolean = false
) {
  if (typeof window === "undefined") return;

  const cleanSearch = searchStr
    ? searchStr
    : typeof window !== "undefined"
      ? window.location.search
      : "";
  const currentPath = pathname + cleanSearch;

  // Suppress duplicate page_view for the identical path
  if (lastDispatchedPath === currentPath) {
    return;
  }
  lastDispatchedPath = currentPath;

  const dispatch = () => {
    const pageLocation =
      typeof window !== "undefined" && window.location?.origin
        ? `${window.location.origin}${currentPath}`
        : typeof window !== "undefined"
          ? window.location.href
          : currentPath;

    trackPageView({
      page_title: document.title,
      page_location: pageLocation,
      page_path: currentPath,
    });
  };

  if (immediate || typeof window.setTimeout !== "function") {
    dispatch();
  } else {
    window.setTimeout(dispatch, 0);
  }
}

/**
 * Send a custom analytics event to GA4.
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  gtag("event", eventName, {
    ...eventParams,
    send_to: GA_MEASUREMENT_ID,
  });
}
