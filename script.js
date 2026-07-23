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
});

// Add visible class for skill cards via CSS
const style = document.createElement('style');
style.textContent = '.skill-card.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
