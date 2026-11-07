import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import FluxLines from './components/ui/FluxLines';
import WarpText from './components/ui/WarpText';
import KineticStatement from './experience/KineticStatement';
import ProjectShowcase from './experience/ProjectShowcase';
import './experience/experience.css';

// Keep the existing document and its content. Each interactive section is an island.
// Module scripts run after parsing, before the legacy page's DOMContentLoaded setup.
const sections = [
  [
    'loaderWarp',
    <WarpText
      text="eduuhlann"
      color="#f5f5f5"
      warpStrength={0.08}
      warpScale={1.7}
      speed={0.55}
      lens="bulge"
      pointerInfluence={0.42}
      pointerStrength={0.38}
      refraction={0.018}
      chromatic={0.35}
      idleDrift={0.2}
      ripple
      clickRipple
      intro
      fontSize="clamp(3rem, 12vw, 8rem)"
      fontWeight={800}
      fontFamily="'Outfit', sans-serif"
      letterSpacing="-0.06em"
      style={{ height: '100%' }}
    />,
  ],
  [
    'heroFlux',
    <FluxLines
      colors={['#ffffff', '#aeb0bd', '#ffffff']}
      speed={0.35}
      scale={1.6}
      turbulence={0.9}
      fluidity={0.12}
      rimWidth={0.18}
      sharpness={2.4}
      shimmer={1.3}
      glow={1.6}
      lineWidth={1}
      flowDirection="down"
      opacity={0.6}
      mouseInteraction
      mouseStrength={1}
      clickSwirl
      mixBlendMode="screen"
      style={{ position: 'absolute', inset: 0 }}
    />,
  ],
  ['kineticExperience', <KineticStatement />],
  ['projectExperience', <ProjectShowcase />],
] as const;

const roots = new Map<string, ReturnType<typeof createRoot>>();

flushSync(() => {
  sections.forEach(([id, component]) => {
    const host = document.getElementById(id);
    if (!host) return;
    const root = createRoot(host);
    roots.set(id, root);
    root.render(component);
  });
});

document.addEventListener(
  'portfolio:intro-done',
  () => {
    window.setTimeout(() => {
      const root = roots.get('loaderWarp');
      if (!root) return;
      root.unmount();
      roots.delete('loaderWarp');
    }, 650);
  },
  { once: true },
);

document.dispatchEvent(new Event('portfolio:content-ready'));
