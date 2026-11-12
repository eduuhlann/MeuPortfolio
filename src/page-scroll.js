import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

function initPageScroll() {
    const lenis = new Lenis({
        smoothWheel: true,
        lerp: 0.085,
        syncTouch: true,
        anchors: false,
        allowNestedScroll: true,
    });
    window.portfolioScroll = lenis;

    function getPinnedTarget(target) {
        const triggers = window.ScrollTrigger?.getAll?.();
        if (!triggers) return null;
        const match = triggers.find(trigger => trigger.pin && trigger.trigger && (trigger.trigger === target || target.contains(trigger.trigger)));
        if (!match) return null;

        const animation = match.animation;
        const duration = animation?.duration?.() || 0;
        const labelTimes = animation?.labels ? Object.values(animation.labels).filter(time => time > 0) : [];
        // Land where the pinned content is already revealed instead of on the
        // collapsed intro frame, which looks like an empty section.
        if (duration > 0 && labelTimes.length) {
            const reveal = Math.min(1, Math.min(...labelTimes) / duration);
            return match.start + (match.end - match.start) * reveal;
        }
        return match.start;
    }

    function scrollToHash(hash) {
        if (!hash || hash === '#') return;
        const id = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(id);
        if (!target) return;

        const pinnedTarget = getPinnedTarget(target);
        if (pinnedTarget !== null) {
            lenis.scrollTo(pinnedTarget);
            return;
        }

        const header = document.querySelector('.site-header');
        const targetStyle = getComputedStyle(target);
        const rootStyle = getComputedStyle(document.documentElement);
        const scrollMargin = parseFloat(targetStyle.scrollMarginTop) || 0;
        const scrollPadding = parseFloat(rootStyle.scrollPaddingTop) || 0;
        // Lenis already subtracts scroll-margin/scroll-padding, so compensate to
        // avoid doubling the header offset (e.g. projects has its own margin).
        lenis.scrollTo(target, {
            offset: scrollMargin + scrollPadding - (header?.getBoundingClientRect().height ?? 0),
        });
    }

    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
        if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
        const id = decodeURIComponent(url.hash.slice(1));
        if (!document.getElementById(id)) return;

        event.preventDefault();
        if (window.location.hash !== url.hash) {
            window.history.pushState(null, '', url.hash);
        }
        scrollToHash(url.hash);
    });

    window.addEventListener('popstate', () => scrollToHash(window.location.hash));

    if (document.documentElement.classList.contains('intro-active')) lenis.stop();
    document.addEventListener('portfolio:intro-done', () => lenis.start(), { once: true });

    const gsap = window.gsap;
    const scrollTrigger = window.ScrollTrigger;

    lenis.on('scroll', () => scrollTrigger?.update());

    if (gsap) {
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    } else {
        function frame(time) {
            lenis.raf(time);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

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
            lenis.scrollTo(event.key === 'Home' ? 0 : lenis.limit);
        }
    });

    let layoutFrame = 0;

    function refreshLayout() {
        if (layoutFrame) return;
        layoutFrame = requestAnimationFrame(() => {
            layoutFrame = 0;
            scrollTrigger?.refresh();
            lenis.resize();
        });
    }

    document.addEventListener('portfolio:content-ready', refreshLayout);
    document.addEventListener('portfolio:layout-change', refreshLayout);
    window.addEventListener('load', refreshLayout, { once: true });
    document.fonts?.ready.then(refreshLayout);
    scrollTrigger?.addEventListener('refresh', () => lenis.resize());
}

// The existing page initializes its animations and scrollspy first.
document.addEventListener('DOMContentLoaded', initPageScroll);
