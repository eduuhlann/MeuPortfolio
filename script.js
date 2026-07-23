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

    // 6. Parallax on hero portrait
    const portraitCard = document.querySelector('.portrait-card');
    function updateParallax() {
        if (!portraitCard) return;
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        portraitCard.style.transform = `translateY(${rate}px)`;
    }
    window.addEventListener('scroll', updateParallax, { passive: true });

    // 7. Staggered reveal for skill cards
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

    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        skillObserver.observe(card);
    });

    // 8. Typing effect on hero name
    const heroTyping = document.getElementById('heroTyping');
    if (heroTyping) {
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

    // 9. Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

                const alpha = 0.06 + (dist < maxDist ? (maxDist - dist) / maxDist * 0.12 : 0);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fill();
            }

            ctx.strokeStyle = 'rgba(255,255,255,0.02)';
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

            requestAnimationFrame(draw);
        }

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', resize);
        resize();
        draw();
    }
});

const style = document.createElement('style');
style.textContent = '.skill-card.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
