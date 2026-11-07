import WarpText from './WarpText';
import TextPressure from './TextPressure';
import './BrandWordmark.css';

interface BrandWordmarkProps {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BrandWordmark = ({
  text = 'eduuhlann',
  className = '',
  style,
}: BrandWordmarkProps) => {
  return (
    <div className={`brand-wordmark ${className}`.trim()} style={style}>
      <div className="brand-wordmark__warp" aria-hidden="true">
        <WarpText
          text={text}
          color="#f5f5f5"
          warpStrength={0.09}
          warpScale={1.8}
          speed={0.6}
          pointerInfluence={0.46}
          pointerStrength={0.42}
          refraction={0.02}
          ripple
          fontSize="clamp(2.3rem, 8vw, 6.5rem)"
          fontWeight={800}
          fontFamily="'Outfit', sans-serif"
          letterSpacing="-0.08em"
          lineHeight={0.88}
        />
      </div>

      <TextPressure
        text={text}
        textColor="#f5f5f5"
        pressureColor="#b3c7ff"
        idle="wave"
        idleSpeed={1.1}
        fontFamily="'Outfit', sans-serif"
        fontSize="clamp(2.3rem, 8vw, 6.5rem)"
        fontWeight={800}
        letterSpacing="-0.08em"
        className="brand-wordmark__pressure"
      />
    </div>
  );
};

export default BrandWordmark;
