import { useMemo, useRef, useState } from 'react';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: number | string;
  letterSpacing?: string | number;
  textColor?: string;
  pressureColor?: string;
  idle?: 'none' | 'wave' | 'pulse';
  idleSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const TextPressure = ({
  text = 'eduuhlann',
  fontFamily = "'Outfit', sans-serif",
  fontSize = 'clamp(2.2rem, 7vw, 6.5rem)',
  fontWeight = 800,
  letterSpacing = '-0.06em',
  textColor = '#f5f5f5',
  pressureColor = '#a4c1ff',
  idle = 'wave',
  idleSpeed = 1,
  className = '',
  style,
}: TextPressureProps) => {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5, active: false });
  const [pointerDown, setPointerDown] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const chars = useMemo(() => Array.from(text), [text]);

  const updatePointer = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);

    setPointer({ x, y, active: true });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    updatePointer(event.clientX, event.clientY);
    setPointerDown(true);
    window.setTimeout(() => setPointerDown(false), 180);
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0.5, y: 0.5, active: false });
  };

  return (
    <div
      ref={containerRef}
      className={`text-pressure ${className}`.trim()}
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing,
        ...style,
      }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      aria-label={text}
      role="img"
    >
      {chars.map((char, index) => {
        const total = Math.max(chars.length - 1, 1);
        const position = chars.length === 1 ? 0.5 : index / total;
        const dx = Math.abs(position - pointer.x);
        const dy = Math.abs(0.5 - pointer.y);
        const distance = Math.hypot(dx, dy * 1.2);
        const intensity = pointer.active ? clamp(1 - distance / 0.6, 0, 1) : 0;
        const idleWave = idle === 'wave'
          ? 0.5 + 0.5 * Math.cos((index * 0.9) - performance.now() * 0.001 * idleSpeed)
          : idle === 'pulse'
            ? 0.5 + 0.5 * Math.sin((performance.now() * 0.0017 + index * 0.35) * idleSpeed)
            : 0;
        const idleBoost = idle === 'none' ? 0 : idleWave * 0.14;
        const shock = pointerDown ? (1 - index / Math.max(chars.length, 1)) * 0.18 : 0;

        const scale = 1 + intensity * 0.48 + idleBoost + shock;
        const translateY = (0.5 - pointer.y) * 18 * intensity + (idleBoost * 5);
        const skewX = (pointer.x - 0.5) * 18 * intensity;
        const opacity = clamp(0.78 + intensity * 0.35 + idleBoost, 0.7, 1);

        return (
          <span
            key={`${char}-${index}`}
            className="text-pressure__char"
            style={{
              color: intensity > 0 ? pressureColor : textColor,
              opacity,
              transform: `scale(${scale}) translateY(${translateY}px) skewX(${skewX}deg)`,
              textShadow:
                intensity > 0
                  ? `0 0 18px rgba(164, 193, 255, 0.72), 0 0 28px rgba(255,255,255,0.18)`
                  : 'none',
              transition: 'transform 180ms ease, color 180ms ease, opacity 180ms ease, text-shadow 180ms ease',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default TextPressure;
