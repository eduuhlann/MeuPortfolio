document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuButton = document.querySelector('.menu-button');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const backdrop = document.querySelector('.nav-backdrop');

    function openMenu() {
        menuButton.setAttribute('aria-expanded', 'true');
        mainNav.classList.add('active');
        backdrop.classList.add('active');
        const icon = menuButton.querySelector('i');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    }

    function closeMenu() {
        menuButton.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        backdrop.classList.remove('active');
        const icon = menuButton.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        isExpanded ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 1.5 Theme toggle (claro/escuro)
    const themeToggle = document.querySelector('.theme-toggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    let gridRgb = '255, 255, 255';
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function syncThemeUI() {
        const theme = getCurrentTheme();
        if (themeMeta) {
            themeMeta.setAttribute('content', theme === 'light' ? '#f7f7f8' : '#050505');
        }
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
        const gridValue = getComputedStyle(document.documentElement).getPropertyValue('--grid-dot').trim();
        gridRgb = gridValue || '255, 255, 255';
    }

    function applyTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            try { localStorage.setItem('theme', theme); } catch (e) { }
        }
        syncThemeUI();
    }

    let morphTexts = ['DESENVOLVEDOR FRONTEND', 'UI/UX DESIGNER', 'FREELANCER'];

    // 1.6 Language toggle (PT/EN)
    const TRANSLATIONS = {
        pt: {
            'nav.home': 'Home',
            'nav.about': 'Sobre',
            'nav.projects': 'Projetos',
            'nav.music': 'Música',
            'nav.contact': 'Contato',
            'hero.ctaProjects': 'Ver projetos',
            'hero.ctaContact': 'Falar comigo',
            'hero.morphTexts': ['DESENVOLVEDOR FRONTEND', 'UI/UX DESIGNER', 'FREELANCER'],
            'section.about': 'Sobre Mim',
            'section.projects': 'Projetos',
            'section.music': 'Música',
            'section.contact': 'Contato',
            'about.title': 'Desenvolvedor em formação pela UTFPR, apaixonado por tecnologia e design.',
            'about.p1': 'Tenho 20 anos e sou estudante de Ciência da Computação na UTFPR de Campo Mourão. Estou em constante evolução como desenvolvedor, com foco em criar interfaces limpas, modernas e funcionais.',
            'about.p2': 'Gosto de transformar ideias em produtos digitais bem acabados. Trabalho com tecnologias web e busco sempre entregar uma experiência visual de qualidade, com atenção aos detalhes e usabilidade.',
            'projects.subtitle': 'Alguns dos projetos que já construí.',
            'projects.details': 'Ver detalhes <i class="fa-solid fa-plus"></i>',
            'projects.visit': 'Visitar site <i class="fa-solid fa-arrow-right"></i>',
            'projects.oneflow.tag': 'Projeto Web',
            'projects.oneflow.desc': 'Plataforma web moderna com foco em experiência do usuário, performance e design limpo.',
            'projects.oneflow.title': 'OneFlow',
            'projects.oneflow.fullDesc': 'Plataforma web moderna com foco em experiência do usuário, performance e design limpo. Construída para demonstrar boas práticas de desenvolvimento frontend, da interface à otimização.',
            'projects.oneflow.h1': 'Interface responsiva e acessível',
            'projects.oneflow.h2': 'Design limpo e moderno',
            'projects.oneflow.h3': 'Foco em performance de carregamento',
            'projects.metanoia.tag': 'Site Institucional',
            'projects.metanoia.desc': 'Site feito para a juventude da Primeira Igreja Batista de Campo Mourão, PR.',
            'projects.metanoia.title': 'MetanoiaApp',
            'projects.metanoia.fullDesc': 'Presença digital da juventude da Primeira Igreja Batista de Campo Mourão, PR. Pensada para conectar os jovens, divulgar encontros e fortalecer a comunidade.',
            'projects.metanoia.h1': 'Divulgação clara dos encontros',
            'projects.metanoia.h2': 'Visual acolhedor e jovem',
            'projects.metanoia.h3': 'Navegação simples e direta',
            'music.subtitle': 'O que estou escutando enquanto codifico.',
            'music.listening': 'Ouvindo agora',
            'music.paused': 'Pausado',
            'contact.kicker': 'Vamos tirar sua ideia do papel?',
            'contact.title': 'Design moderno e código de qualidade para a sua presença digital.',
            'contact.p': 'Entre em contato para criarmos uma experiência online única para você ou seu negócio.',
            'contact.email': '// e-mail direto',
            'contact.github': '// código aberto',
            'contact.social': '// rede social',
            'contact.whatsapp': '// conversa rápida',
            'backToTop': 'Voltar ao topo',
            'modal.close': 'Fechar detalhes do projeto',
            'modal.technologies': 'Tecnologias',
            'modal.highlights': 'Destaques',
            'footer.copyright': '© 2026 Eduardo Lannes Marinato. Desenvolvido com muito <span class="footer-mug"><i class="fa-solid fa-mug-hot"></i><span class="steam"><span></span><span></span><span></span></span></span> e código.',
            'footer.updated': 'Última atualização: ago/2026',
            'breadcrumb': { home: 'Home', about: 'Sobre mim', work: 'Projetos', music: 'Música', contact: 'Contato' }
        },
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.projects': 'Projects',
            'nav.music': 'Music',
            'nav.contact': 'Contact',
            'hero.ctaProjects': 'View projects',
            'hero.ctaContact': 'Get in touch',
            'hero.morphTexts': ['FRONTEND DEVELOPER', 'UI/UX DESIGNER', 'FREELANCER'],
            'section.about': 'About Me',
            'section.projects': 'Projects',
            'section.music': 'Music',
            'section.contact': 'Contact',
            'about.title': 'Computer Science student at UTFPR, passionate about technology and design.',
            'about.p1': "I'm 20 years old and a Computer Science student at UTFPR in Campo Mourão. I'm constantly evolving as a developer, focused on creating clean, modern, and functional interfaces.",
            'about.p2': 'I enjoy turning ideas into well-crafted digital products. I work with web technologies and always strive to deliver a quality visual experience, with attention to detail and usability.',
            'projects.subtitle': 'Some of the projects I have built.',
            'projects.details': 'View details <i class="fa-solid fa-plus"></i>',
            'projects.visit': 'Visit site <i class="fa-solid fa-arrow-right"></i>',
            'projects.oneflow.tag': 'Web Project',
            'projects.oneflow.desc': 'Modern web platform focused on user experience, performance, and clean design.',
            'projects.oneflow.title': 'OneFlow',
            'projects.oneflow.fullDesc': 'Modern web platform focused on user experience, performance, and clean design. Built to demonstrate frontend development best practices, from interface to optimization.',
            'projects.oneflow.h1': 'Responsive and accessible interface',
            'projects.oneflow.h2': 'Clean and modern design',
            'projects.oneflow.h3': 'Focus on loading performance',
            'projects.metanoia.tag': 'Institutional Site',
            'projects.metanoia.desc': 'Website built for the youth ministry of Primeira Igreja Batista de Campo Mourão, PR.',
            'projects.metanoia.title': 'MetanoiaApp',
            'projects.metanoia.fullDesc': 'Digital presence for the youth ministry of Primeira Igreja Batista de Campo Mourão, PR. Designed to connect young people, promote events, and strengthen the community.',
            'projects.metanoia.h1': 'Clear event promotion',
            'projects.metanoia.h2': 'Welcoming and youthful look',
            'projects.metanoia.h3': 'Simple and direct navigation',
            'music.subtitle': 'What I am listening to while coding.',
            'music.listening': 'Now playing',
            'music.paused': 'Paused',
            'contact.kicker': 'Ready to bring your idea to life?',
            'contact.title': 'Modern design and quality code for your digital presence.',
            'contact.p': 'Get in touch to create a unique online experience for you or your business.',
            'contact.email': '// direct email',
            'contact.github': '// open source',
            'contact.social': '// social media',
            'contact.whatsapp': '// quick chat',
            'backToTop': 'Back to top',
            'modal.close': 'Close project details',
            'modal.technologies': 'Technologies',
            'modal.highlights': 'Highlights',
            'footer.copyright': '© 2026 Eduardo Lannes Marinato. Built with lots of <span class="footer-mug"><i class="fa-solid fa-mug-hot"></i><span class="steam"><span></span><span></span><span></span></span></span> and code.',
            'footer.updated': 'Last updated: Aug/2026',
            'breadcrumb': { home: 'Home', about: 'About me', work: 'Projects', music: 'Music', contact: 'Contact' }
        }
    };

    const langToggle = document.querySelector('.lang-toggle');
    const langLabel = document.getElementById('langLabel');

    function getCurrentLang() {
        return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'pt';
    }

    function applyLang(lang, persist) {
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
        if (persist) {
            try { localStorage.setItem('lang', lang); } catch (e) { }
        }
        if (langLabel) langLabel.textContent = lang === 'pt' ? 'EN' : 'PT';
        translatePage(lang);
    }

    function translatePage(lang) {
        const t = TRANSLATIONS[lang];
        if (!t) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (t[key] !== undefined) {
                el.innerHTML = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (t[key] !== undefined) {
                el.setAttribute('aria-label', t[key]);
            }
        });

        const bc = t.breadcrumb;
        if (bc) {
            breadcrumbLabels.home = bc.home;
            breadcrumbLabels.about = bc.about;
            breadcrumbLabels.work = bc.work;
            breadcrumbLabels.music = bc.music;
            breadcrumbLabels.contact = bc.contact;
        }

        if (typeof morphTexts !== 'undefined') {
            const newMorphs = t['hero.morphTexts'];
            if (newMorphs) {
                morphTexts.length = 0;
                newMorphs.forEach(s => morphTexts.push(s));
            }
        }

        translateProjectDetails(lang);
        updateNowPlayingText(lang);
    }

    function translateProjectDetails(lang) {
        const t = TRANSLATIONS[lang];
        if (!t) return;

        PROJECT_DETAILS.oneflow.tag = t['projects.oneflow.tag'];
        PROJECT_DETAILS.oneflow.description = t['projects.oneflow.fullDesc'];
        PROJECT_DETAILS.oneflow.title = t['projects.oneflow.title'];
        PROJECT_DETAILS.oneflow.highlights = [t['projects.oneflow.h1'], t['projects.oneflow.h2'], t['projects.oneflow.h3']];

        PROJECT_DETAILS.metanoia.tag = t['projects.metanoia.tag'];
        PROJECT_DETAILS.metanoia.description = t['projects.metanoia.fullDesc'];
        PROJECT_DETAILS.metanoia.title = t['projects.metanoia.title'];
        PROJECT_DETAILS.metanoia.highlights = [t['projects.metanoia.h1'], t['projects.metanoia.h2'], t['projects.metanoia.h3']];
    }

    let currentNowPlayingLang = 'pt';
    function updateNowPlayingText(lang) {
        currentNowPlayingLang = lang;
        const el = document.getElementById('npStatus');
        if (el && el.getAttribute('data-i18n')) {
            const key = el.getAttribute('data-i18n');
            const t = TRANSLATIONS[lang];
            if (t && t[key]) el.textContent = t[key];
        }
    }

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const next = getCurrentLang() === 'pt' ? 'en' : 'pt';
            const apply = () => applyLang(next, true);
            if (document.startViewTransition && !reducedMotion) {
                document.startViewTransition(apply);
            } else {
                apply();
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = getCurrentTheme() === 'light' ? 'dark' : 'light';
            const apply = () => applyTheme(next, true);
            if (document.startViewTransition && !reducedMotion) {
                document.startViewTransition(apply);
            } else {
                apply();
            }
        });
    }

    if (window.matchMedia) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
        systemTheme.addEventListener('change', (e) => {
            let stored = null;
            try { stored = localStorage.getItem('theme'); } catch (err) { }
            if (!stored) applyTheme(e.matches ? 'light' : 'dark', false);
        });
    }

    syncThemeUI();

    // 2. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Header scroll effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // 3.5 Scrollspy - destaca a seção ativa no menu + breadcrumb flutuante
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.main-nav a');
    const sectionBreadcrumb = document.getElementById('sectionBreadcrumb');
    const breadcrumbText = document.getElementById('breadcrumbText');
    let breadcrumbLabels = { home: 'Home', about: 'Sobre mim', work: 'Projetos', music: 'Música', contact: 'Contato' };
    let lastSectionId = '';

    function updateSectionUI(id) {
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
        if (!sectionBreadcrumb || !breadcrumbText || id === lastSectionId) return;
        lastSectionId = id;
        breadcrumbText.textContent = breadcrumbLabels[id] || id;
        sectionBreadcrumb.classList.remove('flash');
        void sectionBreadcrumb.offsetWidth;
        sectionBreadcrumb.classList.add('flash');
    }

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) updateSectionUI(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));

    // Breadcrumb aparece depois que o usuário sai do topo
    function updateBreadcrumbVisibility() {
        if (sectionBreadcrumb) {
            sectionBreadcrumb.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
        }
    }

    // 5. Scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
        updateBreadcrumbVisibility();
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // 7. Projetos em grid + modal de detalhes
    const PROJECT_DETAILS = {
        oneflow: {
            title: 'OneFlow',
            tag: 'Projeto Web',
            description: 'Plataforma web moderna com foco em experiência do usuário, performance e design limpo. Construída para demonstrar boas práticas de desenvolvimento frontend, da interface à otimização.',
            stack: ['React', 'TypeScript', 'CSS3', 'Vercel'],
            highlights: [
                'Interface responsiva e acessível',
                'Design limpo e moderno',
                'Foco em performance de carregamento'
            ],
            live: 'https://oneflowweb.vercel.app'
        },
        metanoia: {
            title: 'MetanoiaApp',
            tag: 'Site Institucional',
            description: 'Presença digital da juventude da Primeira Igreja Batista de Campo Mourão, PR. Pensada para conectar os jovens, divulgar encontros e fortalecer a comunidade.',
            stack: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
            highlights: [
                'Divulgação clara dos encontros',
                'Visual acolhedor e jovem',
                'Navegação simples e direta'
            ],
            live: 'https://metanoiaapp.vercel.app'
        }
    };

    const projectModal = document.getElementById('projectModal');

    if (projectModal) {
        const modalDialog = projectModal.querySelector('.modal-dialog');
        const modalImage = document.getElementById('modalImage');
        const modalTag = document.getElementById('modalTag');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalStack = document.getElementById('modalStack');
        const modalHighlights = document.getElementById('modalHighlights');
        const modalLive = document.getElementById('modalLive');
        const modalCloseBtn = projectModal.querySelector('.modal-close');
        let lastTrigger = null;

        function openModal(key, trigger) {
            const data = PROJECT_DETAILS[key];
            if (!data) return;
            lastTrigger = trigger || null;
            const card = trigger && trigger.closest ? trigger.closest('.project-card') : null;
            const cardImg = card ? card.querySelector('.project-preview img') : null;
            if (cardImg) {
                modalImage.src = cardImg.src;
                modalImage.alt = cardImg.alt;
            }
            modalTag.textContent = data.tag;
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;
            modalStack.innerHTML = data.stack.map(t => '<span class="chip">' + t + '</span>').join('');
            modalHighlights.innerHTML = data.highlights.map(h => '<li>' + h + '</li>').join('');
            modalLive.href = data.live;
            projectModal.classList.add('open');
            projectModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            modalCloseBtn.focus();
        }

        function closeModal() {
            projectModal.classList.remove('open');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastTrigger) lastTrigger.focus();
        }

        document.querySelectorAll('[data-project]').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.project, btn));
        });

        projectModal.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
            if (!projectModal.classList.contains('open')) return;
            if (e.key === 'Escape') {
                closeModal();
                return;
            }
            if (e.key === 'Tab') {
                const focusables = modalDialog.querySelectorAll('a[href], button:not([disabled])');
                if (!focusables.length) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // 7.5 Música - now playing via Last.fm
    const nowPlayingCard = document.getElementById('nowPlaying');
    if (nowPlayingCard) {
        const npCover = document.getElementById('npCover');
        const npStatus = document.getElementById('npStatus');
        const npTrack = document.getElementById('npTrack');
        const npArtist = document.getElementById('npArtist');
        const npBar = document.getElementById('npBar');

        async function updateNowPlaying() {
            try {
                const res = await fetch('/api/now-playing');
                if (!res.ok) throw new Error('api indisponivel');
                const data = await res.json();
                if (!data || !data.track) {
                    nowPlayingCard.hidden = true;
                    return;
                }
                nowPlayingCard.hidden = false;
                nowPlayingCard.classList.toggle('paused', !data.playing);
                npCover.src = data.cover || '';
                npCover.alt = data.album ? 'Capa do álbum ' + data.album : 'Capa do álbum';
                npStatus.textContent = data.playing ? TRANSLATIONS[currentNowPlayingLang]['music.listening'] : TRANSLATIONS[currentNowPlayingLang]['music.paused'];
                npTrack.textContent = data.track;
                npTrack.href = data.url || '#';
                npArtist.textContent = Array.isArray(data.artists) ? data.artists.join(', ') : '';
                const npProgress = document.querySelector('.np-progress');
                if (npProgress) npProgress.hidden = !data.duration;
                npBar.style.width = data.duration ? Math.min(100, (data.progress / data.duration) * 100) + '%' : '0%';
            } catch (e) {
                nowPlayingCard.hidden = true;
            }
        }

        updateNowPlaying();
        setInterval(updateNowPlaying, 30000);
    }

    // 8. Hero V2 — morphing text (liquid-text effect)
    const morphText1 = document.getElementById('morphText1');
    const morphText2 = document.getElementById('morphText2');
    if (morphText1 && morphText2 && !reducedMotion) {
        const morphTime = 1.5;
        const cooldownTime = 0.5;
        let textIndex = 0;
        let morphProgress = 0;
        let cooldown = 0;
        let lastTime = performance.now();

        function updateMorph(now) {
            const dt = (now - lastTime) / 1000;
            lastTime = now;
            cooldown -= dt;

            if (cooldown <= 0) {
                morphProgress -= cooldown;
                cooldown = 0;
                let fraction = morphProgress / morphTime;

                if (fraction > 1) {
                    cooldown = cooldownTime;
                    fraction = 1;
                }

                const inv = 1 - fraction;
                morphText2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
                morphText2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
                morphText1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
                morphText1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;

                morphText1.textContent = morphTexts[textIndex % morphTexts.length];
                morphText2.textContent = morphTexts[(textIndex + 1) % morphTexts.length];

                if (fraction === 1) textIndex++;
            } else {
                morphProgress = 0;
                morphText2.style.filter = 'none';
                morphText2.style.opacity = '100%';
                morphText1.style.filter = 'none';
                morphText1.style.opacity = '0%';
            }

            requestAnimationFrame(updateMorph);
        }
        requestAnimationFrame(updateMorph);
    } else if (morphText1 && morphText2) {
        morphText1.textContent = 'DESENVOLVEDOR FRONTEND';
        morphText1.style.opacity = '100%';
        morphText1.style.filter = 'none';
    }

    // 8.5 Hero V2 — mouse parallax on tech cards
    if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
        const heroStage = document.getElementById('heroStage');
        const techCards = document.querySelectorAll('.tech-card');
        if (heroStage && techCards.length) {
            heroStage.addEventListener('mousemove', (e) => {
                const rect = heroStage.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / rect.width;
                const dy = (e.clientY - cy) / rect.height;

                techCards.forEach(card => {
                    const depth = parseFloat(card.dataset.depth) || 0.03;
                    const moveX = dx * depth * 120;
                    const moveY = dy * depth * 80;
                    const baseRotate = getComputedStyle(card).getPropertyValue('--card-rotate').trim() || '0deg';
                    card.style.transform = `rotate(${baseRotate}) translate(${moveX}px, ${moveY}px)`;
                });
            });

            heroStage.addEventListener('mouseleave', () => {
                techCards.forEach(card => {
                    const baseRotate = getComputedStyle(card).getPropertyValue('--card-rotate').trim() || '0deg';
                    card.style.transform = `rotate(${baseRotate})`;
                });
            });
        }
    }

    // 9. Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        });
    }

    // 10. Page grid animation
    const heroCanvas = document.getElementById('heroGrid');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let w, h, cols, rows, points;
        const spacing = 50;
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            heroCanvas.width = w;
            heroCanvas.height = h;
            cols = Math.ceil(w / spacing) + 1;
            rows = Math.ceil(h / spacing) + 1;
            points = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    points.push({
                        x: x * spacing,
                        y: y * spacing,
                        ox: x * spacing,
                        oy: y * spacing
                    });
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);

            for (const p of points) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 150;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    p.x = p.ox - dx * force * 0.3;
                    p.y = p.oy - dy * force * 0.3;
                } else {
                    p.x += (p.ox - p.x) * 0.08;
                    p.y += (p.oy - p.y) * 0.08;
                }

                const alpha = 0.25 + (dist < maxDist ? (maxDist - dist) / maxDist * 0.35 : 0);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${gridRgb},${alpha})`;
                ctx.fill();
            }

            ctx.strokeStyle = `rgba(${gridRgb},0.1)`;
            ctx.lineWidth = 0.5;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols - 1; x++) {
                    const a = points[y * cols + x];
                    const b = points[y * cols + x + 1];
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
            for (let y = 0; y < rows - 1; y++) {
                for (let x = 0; x < cols; x++) {
                    const a = points[y * cols + x];
                    const b = points[(y + 1) * cols + x];
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        function loop() {
            draw();
            requestAnimationFrame(loop);
        }

        window.addEventListener('resize', resize);
        resize();
        if (reducedMotion) {
            draw();
        } else {
            document.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            document.addEventListener('mouseleave', () => {
                mouse.x = -1000;
                mouse.y = -1000;
            });

            loop();
        }
    }

    // 10.5 Magnetic elements
    if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
        const magnets = document.querySelectorAll('.magnetic');
        magnets.forEach(el => {
            const strength = 0.35;
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                el.classList.add('magnetic--active');
                el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.classList.remove('magnetic--active');
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // 10.6 Ripple on .btn-ripple
    const ripples = document.querySelectorAll('.btn-ripple');
    ripples.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const span = document.createElement('span');
            span.className = 'ripple';
            span.style.width = span.style.height = size + 'px';
            span.style.left = (e.clientX - rect.left - size / 2) + 'px';
            span.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(span);
            setTimeout(() => span.remove(), 600);
        });
    });

    // 11. SplitText effect (porta do componente SplitText do React Bits)
    if (typeof gsap !== 'undefined' && typeof SplitText !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        function initSplitText(el) {
            if (reducedMotion) return;

            const text = el.textContent;
            if (!text || !text.trim()) return;

            const splitType = el.dataset.split || 'chars';
            const delay = parseFloat(el.dataset.delay || '50');
            const duration = parseFloat(el.dataset.duration || '1.25');
            const ease = el.dataset.ease || 'power3.out';
            const threshold = parseFloat(el.dataset.threshold || '0.1');
            const rootMargin = el.dataset.rootMargin || '-100px';
            const textAlign = el.dataset.textAlign || 'center';
            const from = { opacity: 0, y: 40 };
            const to = { opacity: 1, y: 0 };

            el.style.textAlign = textAlign;
            el.style.overflow = 'hidden';
            el.style.display = 'inline-block';
            el.style.whiteSpace = 'normal';
            el.style.wordWrap = 'break-word';
            el.style.willChange = 'transform, opacity';
            el.classList.add('split-parent');

            const startPct = (1 - threshold) * 100;
            const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
            const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
            const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
            const sign = marginValue === 0 ? '' : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
            const start = `top ${startPct}%${sign}`;

            let targets;
            const assignTargets = (self) => {
                if (splitType.includes('chars') && self.chars.length) targets = self.chars;
                if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
                if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
                if (!targets) targets = self.chars || self.words || self.lines;
            };

            new SplitText(el, {
                type: splitType,
                smartWrap: true,
                autoSplit: splitType === 'lines',
                linesClass: 'split-line',
                wordsClass: 'split-word',
                charsClass: 'split-char',
                reduceWhiteSpace: false,
                onSplit: (self) => {
                    assignTargets(self);
                    gsap.fromTo(
                        targets,
                        { ...from },
                        {
                            ...to,
                            duration,
                            ease,
                            stagger: delay / 1000,
                            scrollTrigger: {
                                trigger: el,
                                start,
                                once: true,
                                fastScrollEnd: true,
                                anticipatePin: 0.4
                            }
                        }
                    );
                }
            });
        }

        document.querySelectorAll('[data-split]').forEach(initSplitText);

        // 11.5 Hero parallax cinemático com ScrollTrigger
        if (!reducedMotion) {
            const hero = document.querySelector('.hero-v2');
            const heroTitle = document.querySelector('.hero-v2__title-wrap');
            const heroStage = document.querySelector('.hero-v2__stage');
            const heroBottom = document.querySelector('.hero-v2__bottom');
            const heroGif = document.querySelector('.hero-v2__gif-wrap');

            if (hero && heroTitle && heroStage) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5,
                        fastScrollEnd: true,
                    }
                });

                tl.to(heroTitle, { y: -120, opacity: 0, ease: 'none' }, 0);
                tl.to(heroStage, { y: -60, ease: 'none' }, 0);
                tl.to(heroGif, { scale: 1.15, ease: 'none' }, 0);
                if (heroBottom) {
                    tl.to(heroBottom, { y: -40, opacity: 0, ease: 'none' }, 0);
                }
            }
        }
    }

    // 12.5 Sobre mim — carrossel circular de fotos
    const aboutCirc = document.getElementById('aboutCirc');
    if (aboutCirc) {
        const imgs = aboutCirc.querySelectorAll('.about-circ__img');
        const prevBtn = aboutCirc.querySelector('[data-circ-prev]');
        const nextBtn = aboutCirc.querySelector('[data-circ-next]');
        const count = imgs.length;
        let circIndex = 0;

        function renderCirc() {
            imgs.forEach((img, i) => {
                img.classList.remove('is-active', 'is-left', 'is-right');
                const offset = (i - circIndex + count) % count;
                if (offset === 0) img.classList.add('is-active');
                else if (offset === 1) img.classList.add('is-right');
                else if (offset === count - 1) img.classList.add('is-left');
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => {
            circIndex = (circIndex - 1 + count) % count;
            renderCirc();
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            circIndex = (circIndex + 1) % count;
            renderCirc();
        });

        renderCirc();
    }

    // 13. App loader (efeito "Loading") — esconde ao carregar
    const appLoader = document.getElementById('appLoader');
    if (appLoader) {
        let appLoaderDone = false;
        const hideAppLoader = () => {
            if (appLoaderDone) return;
            appLoaderDone = true;
            appLoader.classList.add('ldr--done');
            setTimeout(() => appLoader.remove(), 600);
        };

        if (document.readyState === 'complete') {
            hideAppLoader();
        } else {
            window.addEventListener('load', hideAppLoader);
            setTimeout(hideAppLoader, 3000);
        }
    }

    applyLang(getCurrentLang(), false);
});
