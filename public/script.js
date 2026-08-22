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

    // 8. Typing effect on hero name + cycling role
    const heroTyping = document.getElementById('heroTyping');
    const heroRole = document.getElementById('heroRole');
    if (heroTyping) {
        const fullName = 'Eduardo Lannes Marinato';
        if (reducedMotion) {
            heroTyping.textContent = fullName;
            if (heroRole) heroRole.textContent = 'Desenvolvedor FrontEnd';
        } else {
            let ni = 0;
            function typeName() {
                heroTyping.textContent = fullName.substring(0, ni + 1);
                ni++;
                if (ni < fullName.length) {
                    setTimeout(typeName, 70);
                } else if (heroRole) {
                    setTimeout(startRoleCycling, 400);
                }
            }
            setTimeout(typeName, 600);
        }
    }

    function startRoleCycling() {
        const heroRole = document.getElementById('heroRole');
        if (!heroRole) return;
        const roles = ['Desenvolvedor FrontEnd', 'UI/UX Designer', 'Freelancer', 'Estudante de CC'];
        let ri = 0;
        let i = 0;
        let deleting = false;
        let current = '';

        function loop() {
            const target = roles[ri];
            if (!deleting) {
                current = target.substring(0, i + 1);
                i++;
                heroRole.textContent = current;
                if (i >= target.length) {
                    deleting = true;
                    setTimeout(loop, 1600);
                    return;
                }
                setTimeout(loop, 75);
            } else {
                current = target.substring(0, i - 1);
                i--;
                heroRole.textContent = current;
                if (i <= 0) {
                    deleting = false;
                    ri = (ri + 1) % roles.length;
                    setTimeout(loop, 350);
                    return;
                }
                setTimeout(loop, 38);
            }
        }
        loop();
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
