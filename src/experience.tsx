import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import KineticStatement from './experience/KineticStatement';
import ProjectShowcase from './experience/ProjectShowcase';
import './experience/experience.css';

// Keep the existing document and its content. Each interactive section is an island.
// Module scripts run after parsing, before the legacy page's DOMContentLoaded setup.
const sections = [
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
