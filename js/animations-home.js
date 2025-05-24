document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Header Scroll Effect ---
    const header = document.querySelector('[data-header]');
    if (header) {
        ScrollTrigger.create({
            start: 'top top-=70', // Start adding class 70px from top
            onUpdate: self => {
                if (self.direction === -1 && self.isActive) { // Scrolling Up
                    header.classList.remove('header--scrolled');
                } else if (self.direction === 1 && !header.classList.contains('header--scrolled')) { // Scrolling Down
                     header.classList.add('header--scrolled');
                }
            },
            onLeaveBack: () => header.classList.remove('header--scrolled') // When scrolling back to very top
        });
    }


    // --- Hero Section Animations ---
    const heroTitle = document.querySelector('[data-animate-chars="hero-main-title"]');
    const heroSubtitle = document.querySelector('[data-animate="hero-subtitle"]');
    const heroCTA = document.querySelector('[data-animate="hero-cta"]');
    // const heroForeground = document.querySelector('[data-animate="hero-foreground"]');

    if (!prefersReducedMotion) {
        const tlHero = gsap.timeline({ delay: 0.3 });

        if (heroTitle) {
            // Split title into lines if you want line-by-line animation
            // const heroLines = heroTitle.querySelectorAll('.hero__title-line');
            // tlHero.from(heroLines, { y: 50, autoAlpha: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out' });

            // Character animation for the whole title
            gsap.set(heroTitle, { autoAlpha: 1 }); // Ensure it's visible before text anim
             tlHero.from(heroTitle.querySelectorAll('.hero__title-line'), { // Animate lines container first
                duration: 0.01, // minimal duration, just to set initial state
                autoAlpha: 0,
                onComplete: () => {
                    gsap.to(heroTitle, { // Then animate text
                        duration: 1.5,
                        text: {
                            value: heroTitle.innerHTML, // Animate to its actual content
                            delimiter: "", // Animate characters
                        },
                        ease: "power2.inOut"
                    });
                }
            }, 0); // Start at beginning of timeline
        }
        if (heroSubtitle) {
            tlHero.from(heroSubtitle, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, "-=1.0"); // Overlap with title
        }
        if (heroCTA) {
            tlHero.from(heroCTA, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6");
        }
        // if (heroForeground) {
        //     tlHero.from(heroForeground, { scale: 0.8, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, 0.75)' }, "-=0.5");
        // }

        // Parallax for hero background (optional)
        const heroBg = document.querySelector('.hero__background-img');
        if (heroBg) {
            gsap.to(heroBg, {
                yPercent: 20, // Move background down as user scrolls down
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

    } else { // Reduced motion: simple fade in
        gsap.set([heroTitle, heroSubtitle, heroCTA /*, heroForeground*/], { autoAlpha: 1 });
    }


    // --- General Scroll-Triggered Animations ---
    const animatedElements = gsap.utils.toArray('[data-animate-scroll]');
    animatedElements.forEach(el => {
        if (!prefersReducedMotion) {
            gsap.from(el, {
                y: 50,
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%', // Trigger when 85% of element is in view
                    toggleActions: 'play none none none',
                    // markers: true, // for debugging
                }
            });
        } else {
            gsap.set(el, { autoAlpha: 1 });
        }
    });

    // --- Staggered Scroll-Triggered Animations (e.g., cards, list items) ---
    const staggerGroups = {};
    gsap.utils.toArray('[data-animate-scroll-stagger]').forEach(el => {
        const groupName = el.dataset.animateScrollStagger;
        if (!staggerGroups[groupName]) {
            staggerGroups[groupName] = [];
        }
        staggerGroups[groupName].push(el);
    });

    for (const groupName in staggerGroups) {
        const elements = staggerGroups[groupName];
        if (!prefersReducedMotion) {
            gsap.from(elements, {
                y: 50,
                autoAlpha: 0,
                duration: 0.7,
                ease: 'power2.out',
                stagger: 0.15, // Time between each item's animation
                scrollTrigger: {
                    trigger: elements[0].closest('section') || elements[0].parentElement, // Use section or parent as trigger
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                    // markers: true, // for debugging
                }
            });
        } else {
            gsap.set(elements, { autoAlpha: 1 });
        }
    }

    // Specific animation for Service Cards (Apple-like feel)
    const serviceCards = gsap.utils.toArray('.card-service');
    if (serviceCards.length > 0 && !prefersReducedMotion) {
        serviceCards.forEach((card, index) => {
            const tlCard = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%", // Start when card is 80% in view
                    end: "bottom 20%", // End when card is 20% from top leaving view
                    toggleActions: "play none none none", // Play once
                    // scrub: 0.5, // Uncomment for scrubby effect, more Apple-like
                    // markers: true, // for debugging
                }
            });

            tlCard.fromTo(card,
                { autoAlpha: 0, y: 60, scale: 0.95 /*, filter: 'blur(5px)'*/ },
                { autoAlpha: 1, y: 0, scale: 1, /*filter: 'blur(0px)',*/ duration: 0.8, ease: 'expo.out', delay: index * 0.05 } // Slight delay based on index
            );

            // Optional: Animate elements within the card
            // const cardIcon = card.querySelector('.card-service__icon-wrapper');
            // const cardTitle = card.querySelector('.card-service__title');
            // const cardDesc = card.querySelector('.card-service__description');
            // const cardLink = card.querySelector('.card-service__link');

            // tlCard
            //     .from(cardIcon, { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.7)' }, "-=0.5")
            //     .from([cardTitle, cardDesc, cardLink], { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, "-=0.4");
        });
    } else if (serviceCards.length > 0 && prefersReducedMotion) {
         gsap.set(serviceCards, { autoAlpha: 1 });
    }

    // --- Simple JS for main.js (if not already there) ---
    // This is duplicated from HTML, ensure it's managed in one place, e.g., main.js
    const currentYearEl = document.querySelector('.current-year');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    const mobileMenuToggle = document.querySelector('.header__menu-toggle');
    const mainNavEl = document.querySelector('.header__nav');
    // const siteHeaderEl = document.querySelector('.header'); // Already defined as header

    if (mobileMenuToggle && mainNavEl && header) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNavEl.classList.toggle('header__nav--open');
            header.classList.toggle('header--menu-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    const themeToggleBtn = document.querySelector('.header__theme-toggle');
    if (themeToggleBtn) {
        // Function to set theme based on preference or localStorage
        const applyTheme = (theme) => {
            if (theme === 'theme-dark') {
                document.documentElement.classList.remove('theme-light');
                document.documentElement.classList.add('theme-dark');
                // themeToggleBtn.querySelector('.header__theme-icon').textContent = '[MOON_ICON_SVG]'; // Update icon
                localStorage.setItem('theme', 'theme-dark');
            } else {
                document.documentElement.classList.remove('theme-dark');
                document.documentElement.classList.add('theme-light');
                // themeToggleBtn.querySelector('.header__theme-icon').textContent = '[SUN_ICON_SVG]'; // Update icon
                localStorage.setItem('theme', 'theme-light');
            }
        };
        
        // Check for saved theme in localStorage or system preference
        let currentTheme = localStorage.getItem('theme');
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light';
        }
        applyTheme(currentTheme);

        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
            applyTheme(newTheme);
        });
    }

});