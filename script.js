// Modern Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // GSAP - project card stagger on homepage
    if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            gsap.from(projectCards, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 80%"
                }
            });
        }
    }

    // Chart.js - impact tester page only.
    // Impact energy is just E = mgh, so the curves are the rig's actual
    // operating envelope rather than illustrative data.
    const ctx = document.getElementById('impactChart');
    if (ctx && typeof Chart !== 'undefined') {
        const gridColor = '#e2e8f0';
        const textColor = '#475569';
        const heights = Array.from({ length: 21 }, (_, i) => i * 0.1);
        const anvilMasses = [
            { mass: 10, color: '#93c5fd' },
            { mass: 25, color: '#3b82f6' },
            { mass: 50, color: '#1d4ed8' }
        ];

        window.impactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: heights.map(h => h.toFixed(1)),
                datasets: anvilMasses.map(({ mass, color }) => ({
                    label: `${mass} kg anvil`,
                    data: heights.map(h => +(mass * 9.81 * h).toFixed(1)),
                    borderColor: color,
                    backgroundColor: color,
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 220,
                        title: { display: true, text: 'Impact energy (J)', color: textColor },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    x: {
                        title: { display: true, text: 'Drop height (m)', color: textColor },
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    },
                    tooltip: {
                        callbacks: {
                            label: item => `${item.dataset.label}: ${item.formattedValue} J`
                        }
                    }
                }
            }
        });
    }

    // Mobile nav
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active') ? 'true' : 'false');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });

    // Active nav highlighting (homepage hash links only; project pages keep fixed Projects active)
    const sections = document.querySelectorAll('section[id]');
    const hasInPageHashNav = Boolean(document.querySelector('.nav-menu a.nav-link[href^="#"]'));
    
    function updateActiveNavigation() {
        if (!hasInPageHashNav) return;

        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll);

    const navbar = document.querySelector('.navbar');
    
    function handleNavbarScroll() {
        if (!navbar) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '0';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // Typing effect (homepage)
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const phrases = [
            "Mechanical Engineering · Duke",
            "CAD · Composites · Fabrication",
            "Next.js · Three.js · Python",
            "Re:3D R&D Intern · Monte Founder"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        if (!prefersReducedMotion) {
            setTimeout(type, 1000);
        }
    }

    // Project card tilt
    const cards = document.querySelectorAll('.project-card');

    if (!prefersReducedMotion && !isCoarsePointer) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    if (!prefersReducedMotion && !isCoarsePointer) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const moveX = (x - centerX) * 0.12;
                const moveY = (y - centerY) * 0.12;

                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    }

    updateActiveNavigation();
    handleNavbarScroll();
});
