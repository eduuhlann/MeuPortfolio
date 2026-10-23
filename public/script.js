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

    // 1.2 Pill Nav - barra deslizante
    const pillNav = document.querySelector('.pill-nav');
    const pillBg = document.querySelector('.pill-nav__bg');
    const pillLinks = document.querySelectorAll('.pill-nav a');
    let pillHovered = null;

    function movePill(el) {
        if (!pillNav || !pillBg || !el) return;
        const navRect = pillNav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        pillBg.style.width = elRect.width + 'px';
        pillBg.style.transform = 'translateX(' + (elRect.left - navRect.left) + 'px)';
    }

    if (pillNav && pillBg) {
        function positionInitialPill() {
            if (pillHovered) return;
            const active = pillNav.querySelector('a.active') || pillNav.querySelector('a');
            movePill(active);
        }

        pillLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                pillHovered = link;
                movePill(link);
            });
        });

        pillNav.addEventListener('mouseleave', () => {
            pillHovered = null;
            positionInitialPill();
        });

        positionInitialPill();
        window.addEventListener('resize', positionInitialPill);
    }

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
            'nav.music': 'Música',
            'nav.faq': 'FAQ',
            'nav.contact': 'Contato',
            'section.faq': "FAQ",
            'faq.title': "Perguntas frequentes",
            'faq.intro': "O que você precisa saber antes de começarmos um site juntos.",
            'faq.more': "Ainda tem alguma dúvida?",
            'faq.contact': "Vamos conversar",
            'faq.q1': "Que tipo de site posso solicitar?",
            'faq.a1': "Landing pages, portfólios e sites institucionais são alguns exemplos. Conte a sua ideia para avaliarmos o que faz sentido para o seu objetivo.",
            'faq.q2': "Como funciona o orçamento?",
            'faq.a2': "Envie uma descrição da ideia, as páginas e funcionalidades de que precisa e, se tiver, algumas referências. Com essas informações, podemos definir o escopo e conversar sobre o investimento.",
            'faq.q3': "Quanto tempo leva para um site ficar pronto?",
            'faq.a3': "O prazo depende do tamanho do site, das funcionalidades e da disponibilidade dos textos e imagens. Ele é combinado depois da definição do projeto.",
            'faq.q4': "O site vai funcionar no celular?",
            'faq.a4': "A proposta é criar interfaces responsivas, pensadas para celulares, tablets e computadores, com atenção à navegação e à legibilidade em cada tela.",
            'faq.q5': "Preciso ter domínio e hospedagem?",
            'faq.a5': "Para publicar o site, precisamos definir onde ele será hospedado e se usará um domínio próprio. Essas escolhas podem ser avaliadas junto com as necessidades do projeto.",
            'faq.q6': "Você faz alterações depois da entrega?",
            'faq.a6': "Ajustes, atualizações e manutenção podem ser conversados conforme a necessidade. O que estiver incluído fica definido no escopo do projeto.",
            'hero.ctaContact': 'Falar comigo',
            'hero.morphTexts': ['DESENVOLVEDOR FRONTEND', 'UI/UX DESIGNER', 'FREELANCER'],
            'section.about': 'Sobre Mim',
            'section.music': 'Música',
            'section.contact': 'Contato',
            'about.title': 'Desenvolvedor em formação pela UTFPR, apaixonado por tecnologia e design.',
            'about.p1': 'Tenho 20 anos e sou estudante de Ciência da Computação na UTFPR de Campo Mourão. Estou em constante evolução como desenvolvedor, com foco em criar interfaces limpas, modernas e funcionais.',
            'about.p2': 'Gosto de transformar ideias em produtos digitais bem acabados. Trabalho com tecnologias web e busco sempre entregar uma experiência visual de qualidade, com atenção aos detalhes e usabilidade.',
            'music.subtitle': 'O que estou escutando enquanto codifico.',
            'music.listening': 'Ouvindo agora',
            'music.paused': 'Pausado',
            'music.prev': 'Música anterior',
            'music.next': 'Próxima música',
            'music.play': 'Reproduzir música',
            'music.pause': 'Pausar música',
            'contact.kicker': 'Vamos tirar sua ideia do papel?',
            'contact.title': 'Design moderno e código de qualidade para a sua presença digital.',
            'contact.p': 'Entre em contato para criarmos uma experiência online única para você ou seu negócio.',
            'contact.email': '// e-mail direto',
            'contact.github': '// código aberto',
            'contact.social': '// rede social',
            'contact.whatsapp': '// conversa rápida',
            'backToTop': 'Voltar ao topo',
            'footer.copyright': '© 2026 Eduardo Lannes Marinato. Desenvolvido com muito <span class="footer-mug"><i class="fa-solid fa-mug-hot"></i><span class="steam"><span></span><span></span><span></span></span></span> e código.',
            'philosophy.kicker': 'A Filosofia',
            'philosophy.reference': "Efésios 2:1–10",
            'philosophy.reader': 'Versículos de Efésios 2:1–10 na NVI',
            'philosophy.v1': 'Vocês estavam mortos nas suas transgressões e nos seus pecados,',
            'philosophy.v2': 'nos quais costumavam viver, quando seguiam os padrões deste mundo e o príncipe do poder do ar, o espírito que agora atua nos filhos da desobediência.',
            'philosophy.v3': 'Antes, todos também vivíamos como eles, satisfazendo os desejos da nossa natureza pecaminosa, realizando as vontades e os pensamentos dela. Como os outros, éramos por natureza merecedores da ira.',
            'philosophy.v4': 'Todavia, Deus, por ser rico em misericórdia, por causa do grande amor com que nos amou,',
            'philosophy.v5': 'deu-nos a vida com Cristo quando ainda estávamos mortos nas transgressões — pela graça vocês são salvos.',
            'philosophy.v6': 'Deus nos ressuscitou com Cristo e com ele nos assentou nas regiões celestiais em Cristo Jesus,',
            'philosophy.v7': 'para mostrar, nas eras por vir, a incomparável riqueza da sua graça, demonstrada na sua bondade para conosco em Cristo Jesus.',
            'philosophy.v8': 'Pois pela graça vocês são salvos, por meio da fé, e isto não vem de vocês, é dom de Deus;',
            'philosophy.v9': 'não por obras, para que ninguém se glorie.',
            'philosophy.v10': 'Porque fomos feitos por Deus, criados em Cristo Jesus, para boas obras, as quais Deus preparou previamente para que andássemos nelas.',
            'breadcrumb': { home: 'Home', about: 'Sobre mim', music: 'Música', faq: 'Perguntas frequentes', contact: 'Contato', philosophy: 'Filosofia' }
        },
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.music': 'Music',
            'nav.faq': 'FAQ',
            'nav.contact': 'Contact',
            'section.faq': "FAQ",
            'faq.title': "Frequently asked questions",
            'faq.intro': "What you need to know before we start building your website.",
            'faq.more': "Still have a question?",
            'faq.contact': "Let’s talk",
            'faq.q1': "What kind of website can I request?",
            'faq.a1': "Landing pages, portfolios, and business websites are a few examples. Tell me about your idea so we can work out what makes sense for your goals.",
            'faq.q2': "How do I get a quote?",
            'faq.a2': "Send a description of your idea, the pages and features you need, and any references you have. With that information, we can define the scope and discuss the cost.",
            'faq.q3': "How long does it take to build a website?",
            'faq.a3': "The timeline depends on the size of the website, its features, and when the text and images are ready. We agree on a schedule after defining the project.",
            'faq.q4': "Will the website work on mobile?",
            'faq.a4': "The goal is to create responsive interfaces for phones, tablets, and computers, with attention to navigation and readability on each screen.",
            'faq.q5': "Do I need a domain and hosting?",
            'faq.a5': "To publish the website, we need to decide where it will be hosted and whether it will use a custom domain. We can consider those choices alongside the needs of the project.",
            'faq.q6': "Can I request changes after delivery?",
            'faq.a6': "We can discuss changes, updates, and maintenance based on your needs. The project scope sets out what is included.",
            'hero.ctaContact': 'Get in touch',
            'hero.morphTexts': ['FRONTEND DEVELOPER', 'UI/UX DESIGNER', 'FREELANCER'],
            'section.about': 'About Me',
            'section.music': 'Music',
            'section.contact': 'Contact',
            'about.title': 'Computer Science student at UTFPR, passionate about technology and design.',
            'about.p1': "I'm 20 years old and a Computer Science student at UTFPR in Campo Mourão. I'm constantly evolving as a developer, focused on creating clean, modern, and functional interfaces.",
            'about.p2': 'I enjoy turning ideas into well-crafted digital products. I work with web technologies and always strive to deliver a quality visual experience, with attention to detail and usability.',
            'music.subtitle': 'What I am listening to while coding.',
            'music.listening': 'Now playing',
            'music.paused': 'Paused',
            'music.prev': 'Previous track',
            'music.next': 'Next track',
            'music.play': 'Play track',
            'music.pause': 'Pause track',
            'contact.kicker': 'Ready to bring your idea to life?',
            'contact.title': 'Modern design and quality code for your digital presence.',
            'contact.p': 'Get in touch to create a unique online experience for you or your business.',
            'contact.email': '// direct email',
            'contact.github': '// open source',
            'contact.social': '// social media',
            'contact.whatsapp': '// quick chat',
            'backToTop': 'Back to top',
            'footer.copyright': '© 2026 Eduardo Lannes Marinato. Built with lots of <span class="footer-mug"><i class="fa-solid fa-mug-hot"></i><span class="steam"><span></span><span></span><span></span></span></span> and code.',
            'philosophy.kicker': 'The Philosophy',
            'philosophy.reference': "Ephesians 2:1–10",
            'philosophy.reader': 'Ephesians 2:1–10 verses in English (WEB)',
            'philosophy.v1': 'You were made alive when you were dead in transgressions and sins,',
            'philosophy.v2': 'in which you once walked according to the course of this world, according to the prince of the power of the air, the spirit who now works in the children of disobedience;',
            'philosophy.v3': 'among whom we also all once lived in the lusts of our flesh, doing the desires of the flesh and of the mind, and were by nature children of wrath, even as the rest.',
            'philosophy.v4': 'But God, being rich in mercy, for his great love with which he loved us,',
            'philosophy.v5': 'even when we were dead through our trespasses, made us alive together with Christ—by grace you have been saved—',
            'philosophy.v6': 'and raised us up with him, and made us to sit with him in the heavenly places in Christ Jesus,',
            'philosophy.v7': 'that in the ages to come he might show the exceeding riches of his grace in kindness toward us in Christ Jesus;',
            'philosophy.v8': 'for by grace you have been saved through faith, and that not of yourselves; it is the gift of God,',
            'philosophy.v9': 'not of works, that no one would boast.',
            'philosophy.v10': 'For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.',
            'breadcrumb': { home: 'Home', about: 'About me', music: 'Music', faq: 'Frequently asked questions', contact: 'Contact', philosophy: 'Philosophy' }
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

        document.querySelectorAll('.philosophy__quote').forEach(el => {
            el.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
        });

        const bc = t.breadcrumb;
        if (bc) {
            breadcrumbLabels.home = bc.home;
            breadcrumbLabels.about = bc.about;
            breadcrumbLabels.music = bc.music;
            breadcrumbLabels.faq = bc.faq;
            breadcrumbLabels.contact = bc.contact;
            breadcrumbLabels.philosophy = bc.philosophy;
            if (breadcrumbText && lastSectionId) {
                breadcrumbText.textContent = breadcrumbLabels[lastSectionId] || lastSectionId;
            }
        }

        if (typeof morphTexts !== 'undefined') {
            const newMorphs = t['hero.morphTexts'];
            if (newMorphs) {
                morphTexts.length = 0;
                newMorphs.forEach(s => morphTexts.push(s));
            }
        }

        updateNowPlayingText(lang);
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
    let breadcrumbLabels = { home: 'Home', about: 'Sobre mim', music: 'Música', faq: 'Perguntas frequentes', contact: 'Contato', philosophy: 'Filosofia' };
    let lastSectionId = '';

    function updateSectionUI(id) {
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
        if (pillBg && pillNav && !pillHovered) {
            const active = pillNav.querySelector('a.active') || pillNav.querySelector('a');
            movePill(active);
        }
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

    // 7.5 Música - now playing via Last.fm
    const nowPlayingCard = document.getElementById('nowPlaying');
    if (nowPlayingCard) {
        const npCover = document.getElementById('npCover');
        const npStatus = document.getElementById('npStatus');
        const npTrack = document.getElementById('npTrack');
        const npArtist = document.getElementById('npArtist');
        const npBar = document.getElementById('npBar');
        const npPrev = document.getElementById('npPrev');
        const npNext = document.getElementById('npNext');
        const npPlay = document.getElementById('npPlay');
        const npPlayIcon = document.getElementById('npPlayIcon');
        const npProgress = document.querySelector('.np-progress');
        const npAudio = new Audio();
        npAudio.preload = 'none';
        let npHistory = [];
        let npIndex = 0;
        let npPlaying = false;

        function setPlayIcon() {
            if (!npPlayIcon) return;
            const key = npPlaying ? 'music.pause' : 'music.play';
            npPlayIcon.className = npPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
            nowPlayingCard.classList.toggle('play-paused', npPlaying);
            if (npPlay && TRANSLATIONS[currentNowPlayingLang]) {
                npPlay.setAttribute('aria-label', TRANSLATIONS[currentNowPlayingLang][key] || '');
            }
        }

        function stopAudio() {
            npAudio.pause();
            npAudio.removeAttribute('src');
            npAudio.load();
            npPlaying = false;
            setPlayIcon();
        }

        function renderNowPlaying(item) {
            if (!item || !item.track) {
                nowPlayingCard.hidden = true;
                stopAudio();
                return;
            }
            nowPlayingCard.hidden = false;
            const playing = npIndex === 0 ? !!item.playing : false;
            nowPlayingCard.classList.toggle('paused', !playing);
            if (npAudio.dataset.track !== (item.track || '')) stopAudio();
            npCover.src = item.cover || '';
            npCover.alt = item.album ? 'Capa do álbum ' + item.album : 'Capa do álbum';
            npStatus.textContent = playing ? TRANSLATIONS[currentNowPlayingLang]['music.listening'] : TRANSLATIONS[currentNowPlayingLang]['music.paused'];
            npTrack.textContent = item.track;
            npTrack.href = item.url || '#';
            npArtist.textContent = Array.isArray(item.artists) ? item.artists.join(', ') : '';
            if (npProgress) npProgress.hidden = !item.duration;
            npBar.style.width = item.duration ? Math.min(100, (item.progress / item.duration) * 100) + '%' : '0%';
            if (npPrev) npPrev.disabled = npIndex <= 0;
            if (npNext) npNext.disabled = npIndex >= npHistory.length - 1;
            if (npPlay) npPlay.disabled = !item.preview;
        }

        function togglePlay() {
            const item = npHistory[npIndex];
            if (!item || !item.preview) return;
            if (npPlaying) {
                npAudio.pause();
                npPlaying = false;
                setPlayIcon();
                return;
            }
            npAudio.src = item.preview;
            npAudio.dataset.track = item.track || '';
            npPlaying = true;
            setPlayIcon();
            npAudio.play().catch(() => {
                npPlaying = false;
                setPlayIcon();
            });
        }

        async function updateNowPlaying() {
            try {
                const res = await fetch('/api/now-playing');
                if (!res.ok) throw new Error('api indisponivel');
                const data = await res.json();
                if (!data || !data.track) {
                    nowPlayingCard.hidden = true;
                    return;
                }
                npHistory = Array.isArray(data.history) && data.history.length
                    ? data.history
                    : [{ track: data.track, artists: data.artists, album: data.album, cover: data.cover, url: data.url, preview: data.preview, playing: data.playing }];
                npIndex = 0;
                renderNowPlaying(npHistory[0]);
            } catch (e) {
                nowPlayingCard.hidden = true;
            }
        }

        if (npPrev) npPrev.addEventListener('click', () => {
            if (npIndex > 0) {
                npIndex--;
                renderNowPlaying(npHistory[npIndex]);
            }
        });
        if (npNext) npNext.addEventListener('click', () => {
            if (npIndex < npHistory.length - 1) {
                npIndex++;
                renderNowPlaying(npHistory[npIndex]);
            }
        });
        if (npPlay) npPlay.addEventListener('click', togglePlay);
        npAudio.addEventListener('ended', () => {
            npPlaying = false;
            setPlayIcon();
        });

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

    // 10.1 Click sparks (React Bits — ClickSpark portado para JS puro)
    const sparksCanvas = document.getElementById('clickSparks');
    if (sparksCanvas) {
        const sparkCtx = sparksCanvas.getContext('2d');
        const clickSparks = {
            sparkColor: '#fff',
            sparkSize: 16,
            sparkRadius: 26,
            sparkCount: 8,
            duration: 400,
            easing: 'ease-out',
            extraScale: 1.0
        };
        let sparks = [];
        let sparkAnimationId;

        function resizeSparks() {
            sparksCanvas.width = window.innerWidth;
            sparksCanvas.height = window.innerHeight;
        }

        function easeSpark(t) {
            switch (clickSparks.easing) {
                case 'linear': return t;
                case 'ease-in': return t * t;
                case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                default: return t * (2 - t);
            }
        }

        function drawSparks(timestamp) {
            sparkCtx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);

            sparks = sparks.filter(spark => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= clickSparks.duration) {
                    return false;
                }

                const progress = elapsed / clickSparks.duration;
                const eased = easeSpark(progress);

                const distance = eased * clickSparks.sparkRadius * clickSparks.extraScale;
                const lineLength = clickSparks.sparkSize * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                sparkCtx.strokeStyle = clickSparks.sparkColor;
                sparkCtx.lineWidth = 2;
                sparkCtx.beginPath();
                sparkCtx.moveTo(x1, y1);
                sparkCtx.lineTo(x2, y2);
                sparkCtx.stroke();

                return true;
            });

            sparkAnimationId = requestAnimationFrame(drawSparks);
        }

        function spawnSparks(e) {
            const now = performance.now();
            for (let i = 0; i < clickSparks.sparkCount; i++) {
                sparks.push({
                    x: e.clientX,
                    y: e.clientY,
                    angle: (2 * Math.PI * i) / clickSparks.sparkCount,
                    startTime: now
                });
            }
        }

        window.addEventListener('resize', resizeSparks);
        resizeSparks();
        sparkAnimationId = requestAnimationFrame(drawSparks);
        document.addEventListener('click', spawnSparks, { passive: true });
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

    // Native FAQ disclosures change the position of the contact section below.
    const faqSection = document.getElementById('faq');
    if (faqSection) {
        faqSection.addEventListener('toggle', (event) => {
            if (event.target.tagName !== 'DETAILS') return;
            if (window.ScrollTrigger) ScrollTrigger.refresh(true);
            updateProgress();
        }, true);
    }

    // Philosophy — expand the image, then move verses with vertical page scroll.
    const philoSection = document.getElementById('philosophy');
    if (philoSection && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        const philoTrack = philoSection.querySelector('.philosophy__track');
        const philoStage = document.getElementById('philoStage');
        const philoFrame = document.getElementById('philoFrame');
        const philoMedia = philoSection.querySelector('.philosophy__media');
        const philoScrim = document.getElementById('philoScrim');
        const philoOverlay = document.getElementById('philoOverlay');
        const philoVerses = document.getElementById('philoVerses');
        const verses = Array.from(philoSection.querySelectorAll('.philosophy__verse'));
        const philoMotion = gsap.matchMedia();

        philoMotion.add('(prefers-reduced-motion: no-preference)', () => {
            let sequenceContext = null;
            let resizeTimer;
            let active = true;

            function updatePhilosophy() {
                if (!active) return;
                // Refresh an existing pin before measuring its resized viewport.
                if (sequenceContext) ScrollTrigger.refresh();
                philoSection.classList.add('philosophy--scroll');

                // Keep the full passage readable if zoom or a small viewport makes it too tall.
                if (philoOverlay.scrollHeight > philoStage.clientHeight + 1) {
                    const wasPinned = Boolean(sequenceContext);
                    if (sequenceContext) sequenceContext.revert();
                    sequenceContext = null;
                    philoSection.classList.remove('philosophy--scroll');
                    if (wasPinned) ScrollTrigger.refresh();
                    return;
                }
                if (sequenceContext) return;

                // An explicit context also owns sequences created by delayed resize/font callbacks.
                sequenceContext = gsap.context(() => {
                    const sequence = gsap.timeline({
                        defaults: { ease: 'none' },
                        scrollTrigger: {
                            id: 'philosophy-sequence',
                            trigger: philoTrack,
                            pin: philoStage,
                            pinSpacing: true,
                            start: 'top top',
                            end: () => '+=' + Math.round(window.innerHeight * (2 + verses.length * 0.85)),
                            scrub: 0.4,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    // Phase 1: finish expanding the image before revealing the first verse.
                    sequence
                        .fromTo(philoFrame,
                            { clipPath: 'inset(21% 29% round 24px)' },
                            { clipPath: 'inset(0% 0% round 0px)', duration: 1.5 }, 0)
                        .fromTo(philoMedia, { scale: 1.25 }, { scale: 1, duration: 1.5 }, 0)
                        .fromTo(philoScrim, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.5)
                        .fromTo(philoOverlay, { autoAlpha: 0, y: 24 },
                            { autoAlpha: 1, y: 0, duration: 0.5 }, 1.75)
                        .set(philoVerses, { x: 0 }, 0)
                        .addLabel('verse-1', 2.25)
                        .to({}, { duration: 0.65 });

                    // Phase 2: each transition and reading pause consumes vertical scroll distance.
                    verses.slice(1).forEach((verse, index) => {
                        sequence
                            .to(philoVerses, {
                                x: () => -(verse.offsetLeft - verses[0].offsetLeft),
                                duration: 0.65,
                            })
                            .addLabel('verse-' + (index + 2))
                            .to({}, { duration: 0.65 });
                    });
                }, philoSection);
                ScrollTrigger.refresh();
            }

            function schedulePhilosophyUpdate() {
                if (!active) return;
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updatePhilosophy, 120);
            }

            updatePhilosophy();
            window.addEventListener('resize', schedulePhilosophyUpdate);
            window.addEventListener('load', schedulePhilosophyUpdate, { once: true });
            if (document.fonts) document.fonts.ready.then(schedulePhilosophyUpdate);

            return () => {
                active = false;
                clearTimeout(resizeTimer);
                window.removeEventListener('resize', schedulePhilosophyUpdate);
                window.removeEventListener('load', schedulePhilosophyUpdate);
                if (sequenceContext) sequenceContext.revert();
                philoSection.classList.remove('philosophy--scroll');
            };
        });
    }
    // End philosophy scroll sequence

    applyLang(getCurrentLang(), false);
});
