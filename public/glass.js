(function () {
    'use strict';

    const root = document.documentElement;
    const finePointer = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
    const reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const schemeMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

    const REACTIVE_SELECTOR = [
        '.theme-switcher__option',
        '.main-nav.pill-nav a',
        '.icon-button',
        '.back-to-top',
        '.section-breadcrumb',
        '.about-cv',
        '.project-visit',
        '.faq-contact',
        '.c-link',
        '.np-btn',
        '.about-circ__arrow',
        '.ps-heading-link',
        '.ps-button',
        '.ps-carousel__arrows button',
        '.ps-carousel__dots button',
        '.ps-tags li'
    ].join(',');

    let activeElement = null;
    let lastPointerEvent = null;
    let frame = 0;

    function isGlassActive() {
        return root.getAttribute('data-theme') === 'glass';
    }

    function resetElement(element) {
        if (!element) return;
        element.style.removeProperty('--glass-x');
        element.style.removeProperty('--glass-y');
    }

    function updateReflection() {
        frame = 0;
        if (!lastPointerEvent || !isGlassActive() || (finePointer && !finePointer.matches) || (reducedMotion && reducedMotion.matches)) {
            return;
        }

        const target = lastPointerEvent.target instanceof Element
            ? lastPointerEvent.target.closest(REACTIVE_SELECTOR)
            : null;

        if (activeElement && activeElement !== target) {
            resetElement(activeElement);
            activeElement = null;
        }

        if (!target) return;

        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const x = ((lastPointerEvent.clientX - rect.left) / rect.width) * 100;
        const y = ((lastPointerEvent.clientY - rect.top) / rect.height) * 100;

        activeElement = target;
        target.style.setProperty('--glass-x', x.toFixed(2) + '%');
        target.style.setProperty('--glass-y', y.toFixed(2) + '%');
    }

    function scheduleReflection(event) {
        if (event.pointerType === 'touch') return;
        lastPointerEvent = event;
        if (!frame) frame = requestAnimationFrame(updateReflection);
    }

    document.addEventListener('pointermove', scheduleReflection, { passive: true });

    document.addEventListener('pointerout', event => {
        if (event.pointerType === 'touch') return;
        const related = event.relatedTarget;
        if (activeElement && (!(related instanceof Element) || !activeElement.contains(related))) {
            resetElement(activeElement);
            activeElement = null;
        }
    }, { passive: true });

    document.addEventListener('scroll', () => {
        // The gradient is stored in percentages, so only the pressed/hover
        // state needs to be cleared when a surface leaves under the pointer.
        if (activeElement && !activeElement.matches(':hover')) {
            resetElement(activeElement);
            activeElement = null;
        }
    }, { passive: true });

    document.addEventListener('portfolio:theme-change', () => {
        resetElement(activeElement);
        activeElement = null;
        lastPointerEvent = null;
    });

    function syncSchemeAttribute() {
        if (root.hasAttribute('data-glass-scheme')) return;
        root.setAttribute('data-glass-scheme', schemeMedia && schemeMedia.matches ? 'light' : 'dark');
    }

    syncSchemeAttribute();

    if (schemeMedia) {
        const onSchemeChange = () => {
            if (!isGlassActive()) return;
            root.setAttribute('data-glass-scheme', schemeMedia.matches ? 'light' : 'dark');
        };
        if (schemeMedia.addEventListener) schemeMedia.addEventListener('change', onSchemeChange);
        else if (schemeMedia.addListener) schemeMedia.addListener(onSchemeChange);
    }
})();
