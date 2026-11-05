import { useEffect, useRef, useState } from "react";
import SplitText from "../components/ui/SplitText";
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
    slidesAria: "Carrossel de projetos",
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
    slidesAria: "Project carousel",
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
  const root = useRef<HTMLDivElement>(null);
  const text = copy[language];
  const secondaryProject = projects[0];
  const secondaryText = secondaryProject.copy[language];

  const goToSlide = (index: number) => {
    setActive((index + projects.length) % projects.length);
  };

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

  return (
    <div ref={root} className="ps-showcase">
      <header className="ps-heading ps-reveal">
        <div className="ps-section-index"><span className="ps-index-mark" aria-hidden="true" />{text.label}</div>
        <div className="ps-heading-row">
          <h2 id="projects-heading" aria-live="polite">
            <SplitText
              tag="span"
              className="ps-heading-word ps-heading-word--light"
              text={text.title}
              splitType="chars"
              effect="rise"
              trigger="view"
              delay={26}
              duration={1}
              staggerFrom="start"
              threshold={0.15}
              rootMargin="-70px"
              textAlign="left"
            />
            <br />
            <SplitText
              tag="span"
              className="ps-heading-word ps-heading-word--muted"
              text={text.titleEnd}
              splitType="chars"
              effect="rise"
              trigger="view"
              delay={26}
              duration={1}
              staggerFrom="start"
              threshold={0.15}
              rootMargin="-70px"
              textAlign="left"
            />
          </h2>
          <a
            className="ps-heading-link"
            href={secondaryProject.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={secondaryText.visitAria}
          >
            <Arrow diagonal />
          </a>
        </div>
      </header>

      <div className="ps-carousel ps-reveal" aria-roledescription="carrossel" aria-label={text.slidesAria}>
        <div className="ps-carousel__viewport">
          <div className="ps-carousel__track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {projects.map((project, index) => {
              const projectText = project.copy[language];
              return (
                <article key={project.id} className="ps-carousel__slide" aria-hidden={index !== active}>
                  <div className="ps-featured-card">
                    <div className="ps-featured-card__media">
                      <div className="ps-browser">
                        <div className="ps-browser-bar">
                          <div className="ps-browser-dots" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </div>
                          <div className="ps-browser-url">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            <span>{project.domain}</span>
                          </div>
                          <div className="ps-browser-menu">⋮</div>
                        </div>
                        <img src={project.preview} alt={projectText.previewAlt} draggable={false} />
                      </div>
                    </div>

                    <div className="ps-featured-card__content">
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
                      >
                        {text.visit}<Arrow diagonal />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="ps-carousel__controls">
          <div className="ps-carousel__count" aria-live="polite">
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            <span>/ {String(projects.length).padStart(2, "0")}</span>
          </div>

          <div className="ps-carousel__dots" role="group" aria-label={language === "en" ? "Choose project" : "Escolher projeto"}>
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                className={index === active ? "is-active" : ""}
                aria-current={index === active ? "true" : undefined}
                aria-label={language === "en" ? `Open project ${project.name}` : `Abrir projeto ${project.name}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          <div className="ps-carousel__arrows">
            <button type="button" aria-label={language === "en" ? "Previous project" : "Projeto anterior"} onClick={() => goToSlide(active - 1)}>
              <Arrow />
            </button>
            <button type="button" aria-label={language === "en" ? "Next project" : "Próximo projeto"} onClick={() => goToSlide(active + 1)}>
              <Arrow diagonal />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
