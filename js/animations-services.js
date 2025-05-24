document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and plugins are available (can be registered in main.js as well)
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof TextPlugin === 'undefined') {
        console.error('GSAP or its plugins (ScrollTrigger, TextPlugin) are not loaded.');
        return;
    }
    // No need to re-register if already done in another file like animations-home.js and main.js ensures order
    // gsap.registerPlugin(ScrollTrigger, TextPlugin); 

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Services Page Hero Animations ---
    const heroTitleServices = document.querySelector('[data-animate-chars="services-hero-main"]');
    const heroSubtitleServices = document.querySelector('[data-animate="services-hero-subtitle"]');

    if (!prefersReducedMotion) {
        const tlHeroServices = gsap.timeline({ delay: 0.3 });

        if (heroTitleServices) {
            gsap.set(heroTitleServices, { autoAlpha: 1 });
            tlHeroServices.from(heroTitleServices.querySelectorAll('.hero__title-line'), {
                duration: 0.01,
                autoAlpha: 0,
                onComplete: () => {
                    gsap.to(heroTitleServices, {
                        duration: 1.5,
                        text: {
                            value: heroTitleServices.innerHTML,
                            delimiter: "",
                        },
                        ease: "power2.inOut"
                    });
                }
            }, 0);
        }
        if (heroSubtitleServices) {
            tlHeroServices.from(heroSubtitleServices, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, "-=1.0");
        }

        // Parallax for hero background (optional, similar to homepage)
        const heroBgServices = document.querySelector('.hero--services .hero__background-img');
        if (heroBgServices) {
            gsap.to(heroBgServices, {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero--services",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

    } else {
        gsap.set([heroTitleServices, heroSubtitleServices], { autoAlpha: 1 });
    }

    // --- General Scroll-Triggered Animations for Service Page Sections ---
    // (Re-using data-animate-scroll and data-animate-scroll-stagger logic from home animations or main.js)
    // If you haven't centralized this, you can copy the logic from animations-home.js here.
    // For brevity, I'll assume common scroll animation functions might be in main.js or a shared utility.
    // If not, here's a simplified version again:

    const animatedScrollElements = gsap.utils.toArray('[data-animate-scroll]');
    animatedScrollElements.forEach(el => {
        if (!prefersReducedMotion) {
            gsap.from(el, {
                y: 50, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        } else {
            gsap.set(el, { autoAlpha: 1 });
        }
    });

    const staggerScrollGroups = {};
    gsap.utils.toArray('[data-animate-scroll-stagger]').forEach(el => {
        const groupName = el.dataset.animateScrollStagger;
        if (!staggerScrollGroups[groupName]) staggerScrollGroups[groupName] = [];
        staggerScrollGroups[groupName].push(el);
    });

    for (const groupName in staggerScrollGroups) {
        const elements = staggerScrollGroups[groupName];
        if (!prefersReducedMotion && elements.length > 0) {
            gsap.from(elements, {
                y: 30, autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
                scrollTrigger: {
                    trigger: elements[0].closest('section, div') || elements[0].parentElement,
                    start: 'top 80%', toggleActions: 'play none none none'
                }
            });
        } else {
            gsap.set(elements, { autoAlpha: 1 });
        }
    }


    // --- Specific Animations for Service Detail Sections ---
    const serviceDetailSections = gsap.utils.toArray('.service-detail');
    serviceDetailSections.forEach(section => {
        if (prefersReducedMotion) {
            gsap.set(section.querySelectorAll('[data-animate-scroll], [data-animate-scroll-stagger]'), {autoAlpha: 1});
            return;
        }

        const imageContent = section.querySelector('.service-detail__visual-content');
        const textContent = section.querySelector('.service-detail__text-content');
        // const categoryTag = section.querySelector('.service-detail__category-tag'); // animated by stagger
        // const title = section.querySelector('.service-detail__title'); // animated by scroll
        // const description = section.querySelector('.service-detail__description'); // animated by scroll
        // const features = section.querySelectorAll('.service-detail__feature-list li'); // animated by stagger
        // const cta = section.querySelector('.service-detail__cta'); // animated by scroll

        const tlDetail = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 70%', // Start animation a bit earlier for these larger sections
                toggleActions: 'play none none none',
                // markers: true,
            }
        });

        // Animate image and text blocks
        if (imageContent && textContent) {
            const imageFirst = section.querySelector('.service-detail__container--image-left');
            tlDetail.from(imageContent, {
                x: imageFirst ? -80 : 80, // Slide from left if image is on left, else from right
                autoAlpha: 0,
                duration: 1,
                ease: 'power3.out'
            }, 0)
            .from(textContent, {
                x: imageFirst ? 80 : -80, // Slide from opposite direction
                autoAlpha: 0,
                duration: 1,
                ease: 'power3.out'
            }, 0.1); // Slight offset
        }
        // Individual elements within textContent (tag, title, desc, features, cta) are handled
        // by the generic data-animate-scroll and data-animate-scroll-stagger above.
        // If you want more orchestrated animations *within* each service detail triggered by tlDetail,
        // you would remove their data-attributes and add them to tlDetail here.
        // For example:
        // .from(categoryTag, {y: -20, autoAlpha:0, duration: 0.5}, "-=0.7")
        // .from(title, {y: -20, autoAlpha:0, duration: 0.5}, "-=0.6")
        // ... and so on for description, features, cta
    });


    // --- Animations for Process Steps (already handled by stagger group if using data-attributes) ---
    // If you want a different animation for .process-step specifically:
    const processSteps = gsap.utils.toArray('.process-step');
    if (processSteps.length > 0 && !prefersReducedMotion && !processSteps[0].dataset.animateScrollStagger) {
        // This check `!processSteps[0].dataset.animateScrollStagger` prevents double animation
        // if you decide to keep the data-attribute on .process-step for the generic stagger.
        gsap.from(processSteps, {
            y: 60,
            autoAlpha: 0,
            scale: 0.9,
            duration: 0.7,
            ease: 'expo.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.process-overview__steps',
                start: 'top 75%',
                toggleActions: 'play none none none',
            }
        });
    } else if (processSteps.length > 0 && prefersReducedMotion) {
        gsap.set(processSteps, { autoAlpha: 1 });
    }

});