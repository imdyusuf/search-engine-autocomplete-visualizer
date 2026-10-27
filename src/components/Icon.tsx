import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "search"
  | "command"
  | "github"
  | "chevronDown"
  | "arrowRight"
  | "database"
  | "tree"
  | "layers"
  | "history"
  | "x"
  | "spark"
  | "check"
  | "code"
  | "plus"
  | "trash"
  | "sliders"
  | "clock"
  | "info"
  | "barChart"
  | "external";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...props }: IconProps) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, ...props };
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    command: <><path d="M18 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3Z" /></>,
    github: <><path d="M15 22v-3.9c0-1.1.1-1.5-.5-2.1 2.8-.3 5.5-1.4 5.5-6.2a4.8 4.8 0 0 0-1.3-3.3 4.5 4.5 0 0 0-.1-3.3s-1.1-.4-3.5 1.3a12.2 12.2 0 0 0-6.3 0C6.4 3 5.3 3.4 5.3 3.4a4.5 4.5 0 0 0-.1 3.3A4.8 4.8 0 0 0 4 10c0 4.8 2.7 5.9 5.5 6.2-.5.5-.5 1-.5 2.1V22" /><path d="M9 19c-4 .9-4-2-5.5-2.5" /></>,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
    tree: <><path d="M12 21V3" /><path d="M12 7 7 12" /><path d="M12 12 17 17" /><circle cx="12" cy="3" r="2" /><circle cx="7" cy="12" r="2" /><circle cx="17" cy="17" r="2" /></>,
    layers: <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 17 8 4 8-4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
    x: <path d="m6 6 12 12M18 6 6 18" />,
    spark: <><path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" /><path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" /></>,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    code: <><path d="m8 9-3 3 3 3M16 9l3 3-3 3M13.5 5 10.5 19" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
    sliders: <><path d="M4 7h5M15 7h5M4 17h8M18 17h2M9 4v6M12 14v6M12 17h6" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    barChart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    external: <><path d="M14 5h5v5M19 5l-8 8" /><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}