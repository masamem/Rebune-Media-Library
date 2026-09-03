/* أيقونات SVG مرسومة يدويًا لهوية Rebune */

export interface IconProps {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const LogoMark = ({ className, tone = "brand" }: IconProps & { tone?: "brand" | "light" }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <rect x="2" y="2" width="36" height="36" rx="11" fill={tone === "brand" ? "#E8601C" : "#FDFCF8"} />
    <path
      d="M14 28V12h7.2a5.3 5.3 0 0 1 0 10.6H14m8 0 6 5.4"
      fill="none"
      stroke={tone === "brand" ? "#FDFCF8" : "#E8601C"}
      strokeWidth="3.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-4.6-4.6" />
  </svg>
);

export const IconPlay = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M8.5 5.4v13.2a.6.6 0 0 0 .9.5l10.4-6.6a.6.6 0 0 0 0-1L9.4 4.9a.6.6 0 0 0-.9.5Z" fill="currentColor" />
  </svg>
);

export const IconDownload = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 3.5v11m0 0 4.5-4.5M12 14.5 7.5 10" />
    <path d="M4 16.5v2A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-2" />
  </svg>
);

export const IconEye = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconFilm = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M7.5 5v14M16.5 5v14M3 9.5h4.5M3 14.5h4.5M16.5 9.5H21M16.5 14.5H21" />
  </svg>
);

export const IconPhoto = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="8.5" cy="10" r="1.6" />
    <path d="m21 16-5.2-5.2a1 1 0 0 0-1.4 0L6 19" />
  </svg>
);

export const IconSpark = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="m12 3 1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" />
    <path d="M18.5 16.5v4M16.5 18.5h4" />
  </svg>
);

export const IconFolder = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M3 7.5a2 2 0 0 1 2-2h4l2 2.2h8a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z" />
    <path d="M3 11h18" />
  </svg>
);

export const IconPdf = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M8.5 13.5h7M8.5 17h5" />
  </svg>
);

export const IconTag = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M20.6 13.3 13.3 20.6a2 2 0 0 1-2.8 0L3.5 13.6V3.5h10.1l7 7a2 2 0 0 1 0 2.8Z" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLayers = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 16.5 12 21l8.5-4.5" />
  </svg>
);

export const IconX = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconCheck = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.4}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const IconChevronRight = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconChevronLeft = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

/** سهم "للأمام" في واجهة RTL يشير لليسار */
export const IconArrowForward = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </svg>
);

export const IconBoxSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 96 96" className={className} aria-hidden="true" fill="none">
    <path
      d="M18 34v34l30 14 22-10.3"
      stroke="#D8C6A9"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 34 48 20l30 14-30 14-30-14Zm30 14v34"
      stroke="#A8957F"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="64" cy="60" r="13" fill="#FBF6EE" stroke="#E8601C" strokeWidth="3.6" />
    <path d="m73.5 69.5 7.5 7.5" stroke="#E8601C" strokeWidth="3.6" strokeLinecap="round" />
    <path d="M59 60h10M64 55v10" stroke="#E8601C" strokeWidth="2.6" strokeLinecap="round" opacity="0.45" />
  </svg>
);
