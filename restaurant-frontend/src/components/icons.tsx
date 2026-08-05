import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, strokeWidth = 1.8, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

export const StarIcon = ({ filled = true, ...props }: IconProps & { filled?: boolean }) => (
  <svg {...base(props)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.98 6.99 19.5l.99-5.8-4.21-4.1 5.82-.85z" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const UsersIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M17 19a5.5 5.5 0 0 0-2.5-4.6" />
  </svg>
);

export const EyeIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const EyeOffIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M9.5 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.7 3.4M6.2 7.3A15.7 15.7 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 3.3-.6" />
    <path d="M10 10a2.8 2.8 0 0 0 4 4M3 3l18 18" />
  </svg>
);

export const BackIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const HeartIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <svg {...base(props)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.4-7-9.5A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.5C19 15.6 12 20 12 20z" />
  </svg>
);

export const ShareIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="17" cy="6" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="17" cy="18" r="2.5" />
    <path d="M8.2 10.8l6.6-3.6M8.2 13.2l6.6 3.6" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronUpIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 15l6-6 6 6" />
  </svg>
);

export const BasketIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 8h16l-1.3 10.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8z" />
    <path d="M8.5 8l3.5-4 3.5 4M10 12v4M14 12v4" />
  </svg>
);

export const CardIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7 14.5h4" />
  </svg>
);

export const BellIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 5 2 6 2 6H4.5s2-1 2-6z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const PlusIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 12h14" />
  </svg>
);

export const CutleryIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11" />
    <path d="M17 3c-1.7 0-3 2-3 4.5S15.3 12 17 12v9" />
  </svg>
);

export const LocationIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 21s6.5-5.5 6.5-10.5A6.5 6.5 0 0 0 12 4a6.5 6.5 0 0 0-6.5 6.5C5.5 15.5 12 21 12 21z" />
    <circle cx="12" cy="10.5" r="2.4" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base({ ...props, strokeWidth: 2.4 })}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);
