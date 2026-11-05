import type { CSSProperties, ReactElement, ReactNode } from "react";

export type CarouselItem =
  | string
  | ReactNode
  | {
      id?: string | number;
      image?: string;
      alt?: string;
      icon?: ReactNode;
      title?: string;
      description?: string;
    };

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  aspectRatio?: number;
  peek?: number;
  gap?: number;
  radius?: number;
  frame?: boolean;
  effect?: "tilt" | "slide" | "scale" | "fade" | "cube";
  indicator?: "dots" | "bars" | "counter" | "none";
  arrows?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  draggable?: boolean;
  round?: boolean;
  initialIndex?: number;
  theme?: "dark" | "light";
  onChange?: (index: number, item: CarouselItem) => void;
  className?: string;
  style?: CSSProperties;
}

declare function Carousel(props: CarouselProps): ReactElement | null;

export default Carousel;
