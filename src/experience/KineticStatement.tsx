import { useEffect, useRef } from 'react';
import { usePortfolioLanguage } from './usePortfolioLanguage';
import './kinetic.css';

export default function KineticStatement() {
  const english = usePortfolioLanguage();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (preference.matches) {
        element.style.setProperty('--kinetic-progress', '0.5');
        return;
      }
      const rect = element.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      element.style.setProperty('--kinetic-progress', progress.toFixed(4));
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: '100px' });
    observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', update);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); preference.removeEventListener('change', update); };
  }, []);

  return (
    <div className="kinetic-statement" ref={root}>
      <div className="kinetic-statement__top"><span>01 / {english ? 'THE CREATIVE PROCESS' : 'O PROCESSO CRIATIVO'}</span><span aria-hidden="true">[ DESIGN × CODE ]</span></div>
      <h2 className="kinetic-statement__heading"><span className="kinetic-statement__line kinetic-statement__line--first">{english ? 'LESS ORDINARY.' : 'MENOS DO MESMO.'}</span><span className="kinetic-statement__line kinetic-statement__line--second">{english ? 'MORE INTENTION.' : 'MAIS INTENÇÃO.'}<span className="kinetic-statement__asterisk" aria-hidden="true">✳</span></span></h2>
      <div className="kinetic-statement__bottom"><span aria-hidden="true">↳</span><p>{english ? 'A good interface doesn’t just look good. It feels right, responds naturally, and makes every detail count.' : 'Uma boa interface vai além do visual. Ela faz sentido, responde com naturalidade e transforma cada detalhe em experiência.'}</p><a href="#projects">{english ? 'See it in practice' : 'Veja na prática'}<span aria-hidden="true">↗</span></a></div>
    </div>
  );
}
