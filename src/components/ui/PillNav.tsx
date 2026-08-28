import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface NavItem {
  label: string;
  href: string;
}

interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  theme?: 'dark' | 'light';
}

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref = '',
  className = '',
  ease = 'power2.out',
  baseColor = '#000000',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#000000',
  pillTextColor,
  theme = 'dark',
}: PillNavProps) => {
  const navRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(
    items.findIndex((item) => item.href === activeHref),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  const offsetIndex = hoveredIndex >= 0 ? hoveredIndex : activeIndex;

  const resolvedPillTextColor =
    pillTextColor ?? (theme === 'dark' ? '#ffffff' : '#000000');

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const pills = nav.querySelectorAll<HTMLElement>(
      '[data-pillnav-link]',
    );
    const background = nav.querySelector<HTMLElement>('[data-pillnav-background]');

    const setActive = (el: HTMLElement) => {
      if (!background || !nav) return;
      const navRect = nav.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      gsap.to(background, {
        duration: 0.5,
        ease,
        width: elRect.width,
        height: elRect.height,
        left: elRect.left - navRect.left,
        top: elRect.top - navRect.top,
      });
    };

    pills.forEach((pill, index) => {
      pill.addEventListener('mouseenter', () => {
        setHoveredIndex(index);
        setActive(pill);
      });
      pill.addEventListener('mouseleave', () => setHoveredIndex(-1));
      pill.addEventListener('click', () => {
        setActiveIndex(index);
        setHoveredIndex(-1);
      });
    });

    const targetIndex = hoveredIndex >= 0 ? hoveredIndex : activeIndex;
    const targetEl = pills[targetIndex];
    if (targetEl && targetIndex >= 0) {
      setActive(targetEl);
    } else if (background && nav) {
      gsap.set(background, { width: 0, height: 0 });
    }

    return () => {
      pills.forEach((pill) => {
        pill.removeEventListener('mouseenter', () => setHoveredIndex(0));
        pill.removeEventListener('mouseleave', () => setHoveredIndex(-1));
        pill.removeEventListener('click', () => setActiveIndex(0));
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, hoveredIndex, ease, offsetIndex]);

  return (
    <nav
      ref={navRef}
      className={`relative inline-flex flex-wrap items-center gap-1 rounded-full px-2 py-2 ${className}`}
      style={{ backgroundColor: baseColor }}
      aria-label="Navegação principal"
    >
      {logo && (
        <img
          src={logo}
          alt={logoAlt}
          className="mr-2 h-8 w-8 rounded-full object-contain"
        />
      )}
      <div
        data-pillnav-background
        className="pointer-events-none absolute rounded-full"
        style={{ backgroundColor: pillColor }}
      />
      {items.map((item, index) => {
        const isActive = index === offsetIndex;
        return (
          <a
            key={item.href}
            data-pillnav-link
            href={item.href}
            className="relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300"
            style={{
              color: isActive ? hoveredPillTextColor : resolvedPillTextColor,
            }}
            aria-current={index === activeIndex ? 'page' : undefined}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};

export default PillNav;
