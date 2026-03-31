/**
 * BMT — GSAP + Lenis Animation System
 * Initializes smooth scroll and scroll-triggered animations.
 * Loaded before script.js — sets up Lenis and GSAP ScrollTrigger.
 */

document.addEventListener('DOMContentLoaded', () => {

    const page = document.body.dataset.page || '';

    // ─── 1. Lenis Smooth Scroll ───────────────────────────────────────
    const lenis = new Lenis({
        duration: 0.8,
        easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Anchor links work with Lenis smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -72 });
            }
        });
    });


    // ─── 2. Hero Entrance Animation ──────────────────────────────────
    const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.3
    });

    heroTl
        .fromTo('.hero-content .eyebrow',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 }
        )
        .fromTo('.hero-content h1',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.9 },
            '-=0.4'
        )
        .fromTo('.hero-content h2',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 },
            '-=0.5'
        )
        .fromTo('.hero-content .cta-button',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.3'
        );


    // ─── 3. Hero Parallax on Scroll ──────────────────────────────────
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '60% top',
            scrub: 0.5,
        },
        y: 50,
        opacity: 0,
    });

    gsap.to('.video-background', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: '80% top',
            scrub: 0.5,
        },
        scale: 1.05,
    });


    // ─── 4. Generic Scroll-Reveal (.gsap-reveal) ─────────────────────
    document.querySelectorAll('.gsap-reveal').forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
        });
    });


    // ─── 4.5. Clients Section (replaces AOS fade-up / fade-in) ───────
    const clientsTitle = document.querySelector('.gsap-clients-title');
    const clientsSlider = document.querySelector('.gsap-clients-slider');

    if (clientsTitle) {
        gsap.fromTo(clientsTitle,
            { opacity: 0, y: 24 },
            {
                scrollTrigger: {
                    trigger: clientsTitle,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
            }
        );
    }

    if (clientsSlider) {
        gsap.fromTo(clientsSlider,
            { opacity: 0 },
            {
                scrollTrigger: {
                    trigger: clientsSlider,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                duration: 0.9,
                ease: 'power1.out',
            }
        );
    }


    // ─── 4.7. Module Section ─────────────────────────────────────────
    const modulesSection = document.querySelector('.modules-section');

    if (modulesSection) {
        const modulesTl = gsap.timeline({
            scrollTrigger: {
                trigger: modulesSection,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        modulesTl
            .fromTo('.modules-section .eyebrow',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            )
            .fromTo('.modules-section h2',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                '-=0.3'
            )
            .fromTo('.module-tabs',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.3'
            )
            .fromTo('.module-panel.active',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                '-=0.2'
            );
    }


    // ─── 4.8. Zenith Section ──────────────────────────────────────────
    const zenithSection = document.querySelector('.zenith-section');

    if (zenithSection) {
        const zenithTl = gsap.timeline({
            scrollTrigger: {
                trigger: zenithSection,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        zenithTl
            .fromTo('.zenith-section .zenith-eyebrow',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            )
            .fromTo('.zenith-title',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                '-=0.3'
            )
            .fromTo('.zenith-tagline',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.3'
            )
            .fromTo('.zenith-visual',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
                '-=0.2'
            )
            .fromTo('.zenith-description',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.4'
            )
            .fromTo('.zenith-pillar',
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
                '-=0.3'
            )
            .fromTo('.zenith-cta',
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5 },
                '-=0.2'
            );

        gsap.to('.zenith-glow', {
            scrollTrigger: {
                trigger: zenithSection,
                start: 'top 60%',
                end: 'bottom 20%',
                scrub: 1,
            },
            scale: 1.3,
            opacity: 0.35,
        });
    }


    // ─── 4.9. Product Outdoor Billboards ─────────────────────────────
    document.querySelectorAll('.product-outdoor').forEach((section) => {
        const text = section.querySelector('.product-outdoor__text');
        const visual = section.querySelector('.product-outdoor__visual');
        if (!text || !visual) return;

        const textChildren = [
            text.querySelector('.product-outdoor__eyebrow'),
            text.querySelector('.product-outdoor__title'),
            text.querySelector('.product-outdoor__tagline'),
            text.querySelector('.product-outdoor__ctas'),
        ].filter(Boolean);

        const outdoorTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        outdoorTl
            .fromTo(textChildren,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }
            )
            .fromTo(visual,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
                '-=0.4'
            );
    });


    // ─── 5. Feature Rows ─────────────────────────────────────────────
    document.querySelectorAll('.feature-row').forEach((row) => {
        const media = row.querySelector('.feature-row__media');
        const text = row.querySelector('.feature-row__text');
        if (!media || !text) return;

        const isReversed = row.classList.contains('feature-row--reversed');

        const rowTl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        rowTl
            .fromTo(media,
                { opacity: 0, x: isReversed ? 60 : -60 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
            )
            .fromTo(text.children,
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
                '-=0.4'
            );
    });


    // ─── 6. Testimonials Cinematic — section reveal ───────────────────
    const cinematicSection = document.querySelector('.testimonials-cinematic');

    if (cinematicSection) {
        gsap.fromTo('.cinematic-label',
            { opacity: 0, y: 16 },
            {
                scrollTrigger: {
                    trigger: cinematicSection,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
            }
        );
    }


    // ─── 7. Tech Partners ────────────────────────────────────────────
    const techPartnerItems = document.querySelectorAll('.tech-partner-item');

    if (techPartnerItems.length > 0) {
        gsap.fromTo(techPartnerItems,
            { opacity: 0, y: 20 },
            {
                scrollTrigger: {
                    trigger: '.tech-partners-grid',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
            }
        );
    }


    // ─── 8. Partner Logos ────────────────────────────────────────────
    const partnerLogos = document.querySelectorAll('.partner-logos img');

    if (partnerLogos.length > 0) {
        gsap.fromTo(partnerLogos,
            { opacity: 0, scale: 0.8 },
            {
                scrollTrigger: {
                    trigger: '.partner-logos',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 0.8,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.4)',
            }
        );
    }


    // ─── 9. Contact Form ─────────────────────────────────────────────
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        gsap.fromTo(contactForm,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: {
                    trigger: '.contact-section',
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
            }
        );
    }


    // ─── 10. Section Titles ──────────────────────────────────────────
    const sectionTitles = document.querySelectorAll(
        '.features-section h2, .workflow-section-header h2, .about-us-section h2, .contact-section h2, .clients-section h2'
    );

    sectionTitles.forEach((title) => {
        gsap.fromTo(title,
            { opacity: 0, y: 30 },
            {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
            }
        );
    });

});
