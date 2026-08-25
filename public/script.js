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
    const breadcrumbLabels = { home: 'Home', about: 'Sobre mim', work: 'Projetos', music: 'Música', contact: 'Contato' };
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
                npStatus.textContent = data.playing ? 'Ouvindo agora' : 'Pausado';
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
        const morphTexts = ['DESENVOLVEDOR FRONTEND', 'UI/UX DESIGNER', 'FREELANCER'];
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
    }

    // 12. Page loader (porta do componente Cup Loader do React Bits)
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        let loaderDone = false;
        const hideLoader = () => {
            if (loaderDone) return;
            loaderDone = true;
            pageLoader.classList.add('page-loader--done');
            setTimeout(() => pageLoader.remove(), 600);
        };

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
            setTimeout(hideLoader, 3000);
        }
    }
});
