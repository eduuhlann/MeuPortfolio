import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

function initPageScroll() {
    const main = document.querySelector('main');
    const footer = document.querySelector('.site-footer');
    if (!main || !footer) return;

    const tail = document.createElement('div');
    tail.className = 'page-loop-tail';
    tail.setAttribute('aria-hidden', 'true');
    tail.inert = true;
    footer.after(tail);

    const parallaxTargets = '.hero-v2__title-wrap, .hero-v2__stage, .hero-v2__gif-wrap, .hero-v2__bottom';
    let mirrors = [];
    let resizeFrame = 0;
    let layoutFrame = 0;

    function rebuildTail() {
        resizeFrame = 0;
        tail.style.height = `${window.innerHeight}px`;
        tail.replaceChildren();
        let height = 0;

        // Mobile can fit more than the hero in one viewport.
        for (const source of main.children) {
            const copy = source.cloneNode(true);
            const identified = [copy, ...copy.querySelectorAll('[id]')];
            identified.forEach(node => {
                if (node.id) node.id = `loop-${node.id}`;
            });
            copy.querySelectorAll('.morphing-text').forEach(node => {
                node.style.filter = 'url(#loop-threshold) blur(0.6px)';
            });
            copy.querySelectorAll(parallaxTargets).forEach(node => {
                node.style.removeProperty('transform');
                node.style.removeProperty('opacity');
            });
            copy.querySelectorAll('.tech-card').forEach(node => {
                node.style.removeProperty('transform');
            });
            copy.querySelectorAll('.computer-scene').forEach(node => {
                node.style.removeProperty('--computer-x');
                node.style.removeProperty('--computer-y');
            });
            // Do not replay entrance animations every time the tail is resized.
            copy.querySelectorAll('.scroll-reveal, .tech-card').forEach(node => {
                node.classList.add('visible');
                node.style.animation = 'none';
                node.style.opacity = '1';
            });
            tail.append(copy);
            height += copy.getBoundingClientRect().height;
            if (height >= window.innerHeight) break;
        }

        // Floating artwork and changing text must match on both sides of the seam.
        const animatedNodes = '.morphing-text__span, .hero-v2__gif-wrap, .marquee__track, .computer-float, .studio-scroll-cue > span';
        const liveNodes = main.querySelectorAll(animatedNodes);
        const copies = tail.querySelectorAll(animatedNodes);
        mirrors = Array.from(copies, (copy, index) => [liveNodes[index], copy]);
        lenis.resize();
    }

    const lenis = new Lenis({
        infinite: true,
        smoothWheel: true,
        lerp: 0.085,
        syncTouch: true,
        anchors: true,
        allowNestedScroll: true,
    });
    window.portfolioScroll = lenis;

    const gsap = window.gsap;
    const scrollTrigger = window.ScrollTrigger;
    let previousScroll = window.scrollY;

    lenis.on('scroll', () => {
        scrollTrigger?.update();
        if (Math.abs(lenis.scroll - previousScroll) > lenis.limit / 2) {
            // A scrubbed hero otherwise eases back from its offscreen state.
            const hero = scrollTrigger?.getById('hero-parallax');
            hero?.getTween()?.progress(1);
            hero?.animation?.progress(hero.progress);
        }
        previousScroll = lenis.scroll;
    });

    function render(time) {
        lenis.raf(time);
        if (window.scrollY + window.innerHeight < tail.offsetTop) return;
        mirrors.forEach(([source, copy]) => {
            if (source.classList.contains('morphing-text__span')) {
                if (copy.textContent !== source.textContent) copy.textContent = source.textContent;
                copy.style.filter = source.style.filter;
                copy.style.opacity = source.style.opacity;
            } else {
                // Floating artwork and the marquee share their original clocks.
                const originalAnimation = source.getAnimations()[0];
                const copyAnimation = copy.getAnimations()[0];
                if (originalAnimation && copyAnimation) {
                    copyAnimation.currentTime = originalAnimation.currentTime;
                }
            }
        });
    }

    if (gsap) {
        gsap.ticker.add(time => render(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        function frame(time) {
            render(time);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // Native keyboard scrolling stops at physical document edges; use the same loop.
    document.addEventListener('keydown', event => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target;
        if (target instanceof Element && target.closest('input, textarea, select, [contenteditable], [data-lenis-prevent]')) return;
        if (event.key === ' ' && target instanceof Element && target.closest('button, a, summary, [role="button"]')) return;

        const page = window.innerHeight * 0.9;
        const deltas = { ArrowDown: 40, ArrowUp: -40, PageDown: page, PageUp: -page, ' ': event.shiftKey ? -page : page };
        if (Object.hasOwn(deltas, event.key)) {
            event.preventDefault();
            lenis.scrollTo(lenis.targetScroll + deltas[event.key], { programmatic: false });
        } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            lenis.scrollTo(event.key === 'Home' ? 0 : Math.max(0, lenis.limit - window.innerHeight));
        }
    });

    function scheduleResize() {
        if (!resizeFrame) resizeFrame = requestAnimationFrame(rebuildTail);
    }

    function scheduleLayoutRefresh() {
        if (layoutFrame) return;
        layoutFrame = requestAnimationFrame(() => {
            layoutFrame = 0;
            scrollTrigger?.refresh();
            scheduleResize();
        });
    }

    window.addEventListener('resize', scheduleResize);
    document.addEventListener('portfolio:content-ready', scheduleResize);
    document.addEventListener('portfolio:layout-change', scheduleLayoutRefresh);
    window.addEventListener('load', scheduleResize, { once: true });
    document.fonts?.ready.then(scheduleResize);
    new ResizeObserver(scheduleResize).observe(main);
    new MutationObserver(scheduleResize).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-lang'],
    });
    scrollTrigger?.addEventListener('refresh', () => lenis.resize());
    rebuildTail();
}

// The existing page initializes its animations and scrollspy first.
document.addEventListener('DOMContentLoaded', initPageScroll);
