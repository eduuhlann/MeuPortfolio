import type { CSSProperties, ReactElement } from 'react';

export type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((progress: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: Record<string, unknown>;
  to?: Record<string, unknown>;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties['textAlign'];
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  staggerFrom?: 'start' | 'center' | 'end' | 'edges' | 'random';
  mask?: boolean;
  effect?: 'rise' | 'fade' | 'blur' | 'flip' | 'pop' | 'skew' | 'wave';
  trigger?: 'view' | 'load' | 'hover' | 'click';
  loop?: boolean;
  loopDelay?: number;
  hoverEffect?: 'none' | 'lift' | 'wave';
  color?: string;
  accentColor?: string;
  onLetterAnimationComplete?: () => void;
};

declare const SplitText: (props: SplitTextProps) => ReactElement;

export default SplitText;
