import type { FC, SVGProps } from "react";

export interface BrandLogoInfo {
  id: string;
  name: string;
  svgPath: string;
  category: string;
}

export const BRAND_LOGOS: BrandLogoInfo[] = [
  { id: "google", name: "Google", svgPath: "/logos/google.svg", category: "Technology" },
  { id: "microsoft", name: "Microsoft", svgPath: "/logos/microsoft.svg", category: "Technology" },
  { id: "apple", name: "Apple", svgPath: "/logos/apple.svg", category: "Hardware" },
  { id: "amazon", name: "Amazon", svgPath: "/logos/amazon.svg", category: "E-Commerce" },
  { id: "meta", name: "Meta", svgPath: "/logos/meta.svg", category: "Social" },
  { id: "adobe", name: "Adobe", svgPath: "/logos/adobe.svg", category: "Creative" },
  { id: "spotify", name: "Spotify", svgPath: "/logos/spotify.svg", category: "Media" },
  { id: "slack", name: "Slack", svgPath: "/logos/slack.svg", category: "Productivity" },
];

export interface LogoComponentProps extends SVGProps<SVGSVGElement> {
  size?: number;
  grayscale?: boolean;
  inverted?: boolean;
}

export const GoogleLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Google logo"
    {...props}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const MicrosoftLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Microsoft logo"
    {...props}
  >
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
  </svg>
);

export const AppleLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  inverted = false,
  ...props
}) => (
  <svg
    viewBox="0 0 170 170"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill={inverted ? "#FFFFFF" : "#1E293B"}
    style={grayscale ? { opacity: 0.6 } : undefined}
    aria-label="Apple logo"
    {...props}
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.75-11.64-14.13-6.62-10.42-11.89-21.84-15.82-34.25-3.92-12.41-5.89-24.16-5.89-35.25 0-14.74 3.69-26.69 11.07-35.85 7.38-9.17 16.59-13.89 27.63-14.17 4.93 0 10.45 1.39 16.56 4.17 6.11 2.78 10.02 4.22 11.73 4.33 1.95 0 6.07-1.55 12.37-4.66 6.3-3.1 11.96-4.56 16.99-4.37 12.63.7 22.82 5.43 30.56 14.18-11.07 6.72-16.48 16.03-16.22 27.93.26 9.4 3.82 17.27 10.68 23.6 6.86 6.33 14.97 9.87 24.32 10.62-2.12 6.53-4.64 13.1-7.56 19.72zm-28.7-104.9c-.13 3.69-1.39 7.4-3.79 11.13-2.4 3.73-5.59 6.81-9.56 9.24-3.5 2.13-7.25 3.38-11.25 3.75-.13-3.69 1.07-7.39 3.6-11.1 2.53-3.71 5.79-6.72 9.78-9.03 3.99-2.31 7.73-3.64 11.22-3.99z" />
  </svg>
);

export const AmazonLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  inverted = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Amazon logo"
    {...props}
  >
    <path
      d="M13.96 10.09c0 1.27.06 2.33.66 3.45.48.91 1.26 1.49 2.19 1.49 1.25 0 1.98-.95 1.98-2.37V10.09h2.9v5.18c0 1.29.08 2.37.57 3.46h-2.73l-.22-1.07h-.08c-.77 1.03-1.85 1.35-3.08 1.35-2.35 0-4.15-1.58-4.15-4.16 0-3.33 2.46-4.66 5.69-4.66h1.01V9.92c0-1.25-.79-1.92-2.06-1.92-1.09 0-1.96.49-2.23 1.56l-2.77-.37C12.26 7.05 14.24 5.83 16.78 5.83c3.06 0 4.83 1.57 4.83 4.54v4.21c0 1.02.04 1.94.48 2.79h-2.81l-.23-1.08h-.08c-.75 1.04-1.81 1.35-3.04 1.35"
      fill={inverted ? "#FFFFFF" : "#1E293B"}
    />
    <path
      d="M21.8 18.79c-2.83 2.08-6.96 3.2-10.51 3.2-4.99 0-9.49-1.89-12.9-5.01-.27-.25-.03-.59.29-.4 3.69 2.14 8.17 3.42 12.82 3.42 3.16 0 6.82-.73 10.16-2.26.47-.22.81.33.14.68v.37z"
      fill="#FF9900"
    />
    <path
      d="M22.96 17.58c-.35-.46-2.35-.22-3.25-.1-.27.03-.31-.21-.07-.38 1.56-1.1 4.12-.79 4.44-.41.31.4-.25 2.95-1.73 4.17-.23.19-.45.09-.34-.16.34-.8.96-3.12.96-3.12z"
      fill="#FF9900"
    />
  </svg>
);

export const MetaLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Meta logo"
    {...props}
  >
    <path
      d="M6.915 4.5c-2.36 0-4.39 1.1-5.69 2.87C.45 8.44 0 9.88 0 11.23c0 1.84.77 3.55 2.13 4.75 1.34 1.18 3.09 1.82 5.02 1.82 2.65 0 4.67-1.12 6.03-2.73 1.34 1.61 3.36 2.73 6.01 2.73 1.93 0 3.68-.64 5.02-1.82C23.57 14.78 24 13.07 24 11.23c0-1.35-.45-2.79-1.22-3.86-1.31-1.77-3.34-2.87-5.7-2.87-2.45 0-4.32.96-5.59 2.41C10.22 5.46 8.35 4.5 6.915 4.5zm0 2.2c1.78 0 3.28 1.12 4.15 2.92.54 1.12.83 2.45.83 3.61 0 1.15-.3 2.48-.84 3.61-.87 1.8-2.36 2.92-4.14 2.92-2.38 0-4.31-1.92-4.31-4.28 0-1.04.38-2.05 1.05-2.84.81-.97 1.99-1.55 3.26-1.55zm10.17 0c1.27 0 2.45.58 3.26 1.55.67.79 1.05 1.8 1.05 2.84 0 2.36-1.93 4.28-4.31 4.28-1.78 0-3.27-1.12-4.14-2.92-.54-1.13-.84-2.46-.84-3.61 0-1.16.29-2.49.83-3.61.87-1.8 2.37-2.92 4.15-2.92z"
      fill="#0081FB"
    />
  </svg>
);

export const AdobeLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Adobe logo"
    {...props}
  >
    <path
      d="M14.52 3H24v18h-4.96l-4.52-12.75zm-5.04 0H0v18h4.96l4.52-12.75zm2.52 7.74l3.71 10.26H11.7l-1.35-3.82H7.64l2.58-6.44z"
      fill="#FF0000"
    />
  </svg>
);

export const SpotifyLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Spotify logo"
    {...props}
  >
    <circle cx="12" cy="12" r="12" fill="#1ED760" />
    <path
      d="M17.5 16.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4.1-1 7.6-.6 10.3 1.1.4.3.4.7.2 1zm1.3-2.9c-.3.4-.8.5-1.2.3-2.9-1.8-7.3-2.3-10.7-1.2-.5.1-.9-.1-1.1-.6-.1-.5.1-.9.6-1.1 4-1.2 8.8-.7 12.1 1.4.4.2.5.7.3 1.2zm.1-3c-3.5-2.1-9.2-2.3-12.6-1.2-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 3.9-1.2 10.2-1 14.3 1.4.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3z"
      fill="#FFFFFF"
    />
  </svg>
);

export const SlackLogoSvg: FC<LogoComponentProps> = ({
  size = 24,
  className = "",
  grayscale = false,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={grayscale ? { filter: "grayscale(100%)", opacity: 0.65 } : undefined}
    aria-label="Slack logo"
    {...props}
  >
    <path
      d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.528 2.528 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      fill="#E01E5A"
    />
    <path
      d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      fill="#36C5F0"
    />
    <path
      d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      fill="#2EB67D"
    />
    <path
      d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      fill="#ECB22E"
    />
  </svg>
);

