import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import "./projects.css";

type Language = "pt" | "en";

const copy = {
  pt: {
    label: "02 / TRABALHOS SELECIONADOS",
    title: "Projetos que",
    titleEnd: "ganham vida.",
    intro: "Da primeira ideia ao último detalhe. Design e código em experiências feitas para pessoas.",
    featured: "PROJETO EM DESTAQUE",
    visit: "Explorar projeto",
    status: "ONLINE",
    featuresAria: "Características do projeto",
    previous: "Projeto anterior",
    next: "Próximo projeto",
    goTo: "Ir para o projeto",
    slideOf: "de",
  },
  en: {
    label: "02 / SELECTED WORK",
    title: "Projects that",
    titleEnd: "come to life.",
    intro: "From the first idea to the final detail. Design and code in experiences made for people.",
    featured: "FEATURED PROJECT",
    visit: "Explore project",
    status: "LIVE",
    featuresAria: "Project features",
    previous: "Previous project",
    next: "Next project",
    goTo: "Go to project",
    slideOf: "of",
  },
};

const projects = [
  {
    id: "imper",
    name: "Imper Uniformes",
    url: "https://www.imperuniformes.com.br",
    domain: "imperuniformes.com.br",
    preview: "/imper-project-preview-4k.jpg",
    width: 3840,
    height: 2105,
    copy: {
      pt: {
        projectType: "WEBSITE INSTITUCIONAL",
        projectDescription: "Uma presença digital que aproxima a marca de quem veste a sua história.",
        tags: ["Interface responsiva", "Design de interface", "Experiência web"],
        visitAria: "Explorar o site da Imper Uniformes (abre em uma nova aba)",
        previewAlt: "Página inicial do site da Imper Uniformes, com uniformes corporativos personalizados",
      },
      en: {
        projectType: "CORPORATE WEBSITE",
        projectDescription: "A digital presence that brings the brand closer to the people wearing its story.",
        tags: ["Responsive interface", "Interface design", "Web experience"],
        visitAria: "Explore the Imper Uniformes website (opens in a new tab)",
        previewAlt: "Imper Uniformes homepage showing custom corporate uniforms",
      },
    },
  },
  {
    id: "pib",
    name: "PIB Campo Mourão",
    url: "https://pib-site-ruddy.vercel.app/",
    domain: "pib-site-ruddy.vercel.app",
    preview: "/pib-project-preview.jpg",
    width: 1440,
    height: 790,
    copy: {
      pt: {
        projectType: "WEBSITE INSTITUCIONAL",
        projectDescription: "Um espaço acolhedor para apresentar a igreja, seus encontros e sua comunidade.",
        tags: ["Interface responsiva", "Programação de cultos", "Experiência acolhedora"],
        visitAria: "Explorar o site da PIB Campo Mourão (abre em uma nova aba)",
        previewAlt: "Página inicial do site da PIB Campo Mourão",
      },
      en: {
        projectType: "CORPORATE WEBSITE",
        projectDescription: "A welcoming space to present the church, its gatherings, and its community.",
        tags: ["Responsive interface", "Service schedule", "Welcoming experience"],
        visitAria: "Explore the PIB Campo Mourão website (opens in a new tab)",
        previewAlt: "PIB Campo Mourão homepage",
      },
    },
  },
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ps-arrow">
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

export default function ProjectShowcase() {
  const [language, setLanguage] = useState<Language>(() =>
    document.documentElement.dataset.lang === "en" ? "en" : "pt",
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const text = copy[language];
  const total = projects.length;

  const goTo = (index: number) => setActive((index + total) % total);
  const goBy = (delta: number) => setActive((current) => (current + delta + total) % total);

  useEffect(() => {
    document.dispatchEvent(new Event('portfolio:layout-change'));
  }, [active, language]);

  useEffect(() => {
    const languageObserver = new MutationObserver(() => {
      setLanguage(document.documentElement.dataset.lang === "en" ? "en" : "pt");
    });
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lang"] });
    return () => languageObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const targets = root.current.querySelectorAll(".ps-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("ps-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("ps-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => goBy(1), 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    swipeStart.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) < 42) return;
    goBy(distance < 0 ? 1 : -1);
  };

  return (
    <div
      ref={root}
      className="ps-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goBy(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goBy(1);
        }
      }}
    >
      <header className="ps-heading ps-reveal">
        <div className="ps-section-index"><span className="ps-index-mark" aria-hidden="true" />{text.label}</div>
        <div className="ps-heading-row">
          <h2 id="projects-heading" aria-live="polite">
            <span className="ps-heading-word">{text.title}</span><br />
            <span className="ps-heading-word ps-heading-word--muted">{text.titleEnd}</span>
          </h2>
          <p>{text.intro}</p>
        </div>
      </header>

      <div className="ps-carousel ps-reveal" aria-roledescription="carrossel" aria-label={language === "en" ? "Project carousel" : "Carrossel de projetos"}>
        <div
          className="ps-carousel__stage"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { swipeStart.current = null; }}
        >
          {projects.map((project, index) => {
            const projectText = project.copy[language];
            const isActive = index === active;
            const offset = index - active;
            return (
              <article
                key={project.id}
                className={isActive ? "ps-slide is-active" : "ps-slide"}
                style={{ "--ps-offset": offset } as CSSProperties}
                aria-hidden={!isActive}
                aria-roledescription="slide"
                aria-label={`${index + 1} ${text.slideOf} ${total}: ${project.name}`}
              >
                <div className="ps-slide__preview">
                  <span className="ps-preview-grid" aria-hidden="true" />
                  <div className="ps-browser">
                    <div className="ps-browser-bar" aria-hidden="true">
                      <span className="ps-browser-dots"><i /><i /><i /></span>
                      <span className="ps-browser-url"><svg viewBox="0 0 12 12" fill="none"><path d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5m-6 0h7v6h-7z" /></svg>{project.domain}</span>
                      <span className="ps-browser-menu">···</span>
                    </div>
                    <img src={project.preview} width={project.width} height={project.height} alt={projectText.previewAlt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                  </div>
                  <span className="ps-preview-coordinate" aria-hidden="true">DESIGN / DEVELOP / DELIVER</span>
                  <span className="ps-preview-number" aria-hidden="true">0{index + 1}</span>
                </div>

                <div className="ps-slide__content">
                  <div className="ps-slide__topline">
                    <span>{text.featured}</span>
                    <span className="ps-status"><i aria-hidden="true" />{text.status}</span>
                  </div>
                  <span className="ps-eyebrow">{projectText.projectType}</span>
                  <h3>{project.name}</h3>
                  <p className="ps-project-description">{projectText.projectDescription}</p>
                  <ul className="ps-tags" aria-label={text.featuresAria}>
                    {projectText.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <a
                    className="ps-button ps-button-primary"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={projectText.visitAria}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {text.visit}<Arrow diagonal />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className="ps-carousel__controls">
          <p className="ps-carousel__count" aria-live="polite">
            <strong>0{active + 1}</strong><span>/ 0{total}</span>
          </p>

          <div className="ps-carousel__dots" role="group" aria-label={language === "en" ? "Choose project" : "Escolher projeto"}>
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={index === active ? "is-active" : undefined}
                aria-current={index === active ? "true" : undefined}
                aria-label={`${text.goTo} ${index + 1}: ${project.name}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>

          <div className="ps-carousel__arrows">
            <button type="button" onClick={() => goBy(-1)} aria-label={text.previous}><Arrow /></button>
            <button type="button" onClick={() => goBy(1)} aria-label={text.next}><Arrow /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
