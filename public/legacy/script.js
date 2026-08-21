document.addEventListener('DOMContentLoaded', () => {
    // 0. Loading screen — hide when fonts are ready
    const loadingScreen = document.getElementById('loadingScreen');
    function hideLoader() {
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(hideLoader);
    } else {
        setTimeout(hideLoader, 1800);
    }

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
            applyTheme(getCurrentTheme() === 'light' ? 'dark' : 'light', true);
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

    // 3.5 Scrollspy - destaca a seção ativa no menu
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.main-nav a');
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));

    // 4. Copy email on click
    const copyEmailBtn = document.querySelector('.copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(copyEmailBtn.dataset.email).then(() => {
                const icon = copyEmailBtn.querySelector('i');
                icon.classList.remove('fa-envelope');
                icon.classList.add('fa-check');
                copyEmailBtn.style.borderColor = '#22c55e';
                setTimeout(() => {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-envelope');
                    copyEmailBtn.style.borderColor = '';
                }, 2000);
            });
        });
    }

    // 5. Scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // 6. Staggered reveal for skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const siblings = Array.from(card.parentElement.children);
                const i = siblings.indexOf(card);
                card.style.transitionDelay = (i * 0.08) + 's';
                card.classList.add('visible');
                skillObserver.unobserve(card);
            }
        });
    }, { threshold: 0.2 });

    skillCards.forEach(card => skillObserver.observe(card));

    // 7. Projects carousel
    const carousel = document.getElementById('projectCarousel');
    if (carousel) {
        const track = carousel.querySelector('.project-track');
        const cards = carousel.querySelectorAll('.project-card');
        const prevBtn = carousel.querySelector('.carousel-btn--prev');
        const nextBtn = carousel.querySelector('.carousel-btn--next');
        const dotsWrap = carousel.querySelector('.carousel-dots');
        const total = cards.length;
        const interval = 5000;
        let current = 0;
        let timer = null;
        let paused = false;
        let inView = true;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            const dots = dotsWrap.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
                dot.setAttribute('aria-current', i === current ? 'true' : 'false');
            });
        }

        function startAutoplay() {
            if (reducedMotion || total < 2 || paused || !inView) return;
            stopAutoplay();
            timer = setInterval(() => goTo(current + 1), interval);
        }

        function stopAutoplay() {
            clearInterval(timer);
            timer = null;
        }

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Ir para o projeto ' + (i + 1));
            dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                goTo(i);
                startAutoplay();
            });
            dotsWrap.appendChild(dot);
        }

        prevBtn.addEventListener('click', () => {
            goTo(current - 1);
            startAutoplay();
        });
        nextBtn.addEventListener('click', () => {
            goTo(current + 1);
            startAutoplay();
        });

        carousel.addEventListener('mouseenter', () => {
            paused = true;
            stopAutoplay();
        });
        carousel.addEventListener('mouseleave', () => {
            paused = false;
            startAutoplay();
        });

        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            paused = true;
            stopAutoplay();
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) goTo(current + (diff < 0 ? 1 : -1));
            paused = false;
            startAutoplay();
        }, { passive: true });

        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
                e.preventDefault();
            }
        });

        new IntersectionObserver((entries) => {
            inView = entries[0].isIntersecting;
            if (inView) startAutoplay();
            else stopAutoplay();
        }, { threshold: 0.2 }).observe(carousel);

        startAutoplay();
    }

    // 8. Typing effect on hero name
    const heroTyping = document.getElementById('heroTyping');
    if (heroTyping) {
        if (reducedMotion) {
            heroTyping.textContent = 'Eduardo Lannes Marinato';
        } else {
            const text = 'Eduardo Lannes Marinato';
            const roles = ['Desenvolvedor FrontEnd', 'UI/UX Designer', 'Freelancer'];
            let i = 0;
            let deleting = false;
            let currentText = '';
            let currentTarget = text;
            let roleIndex = 0;

            function typeLoop() {
                if (!deleting) {
                    currentText = currentTarget.substring(0, i + 1);
                    i++;
                    heroTyping.textContent = currentText;

                    if (i === currentTarget.length) {
                        if (currentTarget === text) {
                            setTimeout(() => { deleting = true; typeLoop(); }, 2000);
                            return;
                        } else {
                            setTimeout(() => { deleting = true; typeLoop(); }, 1500);
                            return;
                        }
                    }
                    setTimeout(typeLoop, 80);
                } else {
                    currentText = currentTarget.substring(0, i - 1);
                    i--;
                    heroTyping.textContent = currentText;

                    if (i === 0) {
                        deleting = false;
                        if (currentTarget === text) {
                            currentTarget = roles[roleIndex];
                            roleIndex = (roleIndex + 1) % roles.length;
                        } else {
                            currentTarget = text;
                        }
                        setTimeout(typeLoop, 500);
                        return;
                    }
                    setTimeout(typeLoop, 40);
                }
            }
            setTimeout(typeLoop, 800);
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
});
