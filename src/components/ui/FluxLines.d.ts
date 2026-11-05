import type { CSSProperties, ReactElement, HTMLAttributes } from "react";

export interface FluxLinesProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  colors?: string[];
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  lineWidth?: number;
  flowDirection?: "up" | "down" | "left" | "right";
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  clickSwirl?: boolean;
  intro?: boolean;
  lightMode?: boolean;
  transparent?: boolean;
  backgroundColor?: string;
  opacity?: number;
  paused?: boolean;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

declare function FluxLines(props: FluxLinesProps): ReactElement | null;

export default FluxLines;
