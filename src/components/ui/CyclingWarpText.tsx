import { useEffect, useState } from 'react';
import WarpText from './WarpText';

interface CyclingWarpTextProps {
  texts: string[];
  interval?: number;
  color?: string;
  warpStrength?: number;
  warpScale?: number;
  speed?: number;
  pointerInfluence?: number;
  pointerStrength?: number;
  refraction?: number;
  ripple?: boolean;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  letterSpacing?: string | number;
  lineHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const CyclingWarpText: React.FC<CyclingWarpTextProps> = ({
  texts,
  interval = 2500,
  color = '#f8f5ff',
  warpStrength = 0.08,
  warpScale = 1.7,
  speed = 0.55,
  pointerInfluence = 0.42,
  pointerStrength = 0.38,
  refraction = 0.018,
  ripple = true,
  fontSize = 'clamp(2rem, 7vw, 6.5rem)',
  fontWeight = 800,
  fontFamily = "'Outfit', sans-serif",
  letterSpacing = '-0.06em',
  lineHeight = 0.9,
  className = '',
  style,
}) => {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeOut = setTimeout(() => {
      setOpacity(0);

      const changeText = setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setOpacity(1);
      }, 300);

      return () => clearTimeout(changeText);
    }, interval);

    return () => clearTimeout(fadeOut);
  }, [index, interval, texts.length]);

  return (
    <div
      className={`cycling-warp-text ${className}`.trim()}
      style={{ transition: 'opacity 0.3s ease', opacity, ...style }}
    >
      <WarpText
        text={texts[index]}
        color={color}
        warpStrength={warpStrength}
        warpScale={warpScale}
        speed={speed}
        pointerInfluence={pointerInfluence}
        pointerStrength={pointerStrength}
        refraction={refraction}
        ripple={ripple}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        letterSpacing={letterSpacing}
        lineHeight={lineHeight}
      />
    </div>
  );
};

export default CyclingWarpText;
