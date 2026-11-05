import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import FluxLines from './components/ui/FluxLines';
import KineticStatement from './experience/KineticStatement';
import ProjectShowcase from './experience/ProjectShowcase';
import './experience/experience.css';

// Keep the existing document and its content. Each interactive section is an island.
// Module scripts run after parsing, before the legacy page's DOMContentLoaded setup.
const sections = [
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

flushSync(() => {
  sections.forEach(([id, component]) => {
    const host = document.getElementById(id);
    if (host) createRoot(host).render(component);
  });
});
document.dispatchEvent(new Event('portfolio:content-ready'));
