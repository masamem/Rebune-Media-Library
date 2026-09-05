import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

/* Rebune sun mark — the brand anchor */
export const SunMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="8.5" stroke="currentColor" strokeWidth="3.4" />
    <path
      d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M36.7 11.3l-4.2 4.2M15.5 32.5l-4.2 4.2"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
    />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const SearchOffIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2M8.5 8.5l5 5M13.5 8.5l-5 5" />
  </svg>
);

export const PlayIcon = (p: P) => (
  <svg {...base({ ...p, fill: "currentColor", strokeWidth: 0 })}>
    <path d="M8.5 5.8c0-.9 1-1.5 1.8-1L19 10.9c.8.5.8 1.7 0 2.2l-8.7 6.1c-.8.5-1.8-.1-1.8-1V5.8Z" />
  </svg>
);

export const DownloadIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v10m0 0 4-4m-4 4-4-4" />
    <path d="M5 17v1.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V17" />
  </svg>
);

export const EyeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/* RTL-aware: "back" points right in Arabic UIs */
export const BackIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const ForwardIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const VideoIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="13" height="12" rx="2.5" />
    <path d="m16 10.5 4-2.5v8l-4-2.5" />
  </svg>
);

export const ImageIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m5 18 4.8-4.8a1.5 1.5 0 0 1 2.1 0l5.6 5.3M14.5 15.5l1.7-1.7a1.5 1.5 0 0 1 2.1 0l2.2 2" />
  </svg>
);

export const SparkIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2l-1.8-5.6L4.5 10.8 10.2 9 12 3.5Z" />
    <path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" strokeWidth="1.4" />
  </svg>
);

export const FileTextIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h8L19 8.5v12H6v-17Z" />
    <path d="M14 3.5v5h5M9 13h7M9 16.5h7" />
  </svg>
);

export const LayersIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z" />
    <path d="m4.5 12.5 7.5 4 7.5-4M4.5 16.5l7.5 4 7.5-4" strokeWidth="1.6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const FolderIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V6.5Z" />
  </svg>
);

export const InfoIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 7.8v.2" />
  </svg>
);

export const ArrowUpIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19V5m0 0-5 5m5-5 5 5" />
  </svg>
);

export const RefreshIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5" />
  </svg>
);

export const PenIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m14.5 5 4.5 4.5L8.5 20H4v-4.5L14.5 5Z" />
    <path d="m12.5 7 4.5 4.5M4 20l1.2-4.5" />
  </svg>
);
