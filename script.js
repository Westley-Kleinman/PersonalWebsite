// Modern Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar-nav');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle mobile sidebar
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navItem = document.querySelector(`[data-section="${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
        });
    }

    // Throttled scroll event for performance
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

    window.addEventListener('scroll', handleScroll);    // Hero section interactions
    const heroButtons = document.querySelectorAll('.hero-actions button');
    
    heroButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (index === 0) { // View Portfolio button
                document.querySelector('#projects').scrollIntoView({
                    behavior: 'smooth'
                });
            } else { // Download Resume button
                // This would trigger a resume download
                window.open('resume.pdf', '_blank');
            }
        });
    });

    // Animated skill bars
    const skillBars = document.querySelectorAll('.skill-fill');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    }

    // Trigger skill bar animation when about section is in view
    const aboutSection = document.querySelector('#about');
    let skillsAnimated = false;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target === aboutSection && !skillsAnimated) {
                animateSkillBars();
                skillsAnimated = true;
            }
        });
    }, observerOptions);

    if (aboutSection) {
        sectionObserver.observe(aboutSection);
    }

    // Project cards hover effects enhancement
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Sent!</span>';
                submitBtn.style.background = 'var(--gradient-secondary)';
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = 'var(--gradient-primary)';
                }, 2000);
            }, 1500);
        });
    }

    // Floating animation enhancement
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    function createParallaxEffect() {
        const scrollTop = window.pageYOffset;
        
        floatingShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(scrollTop * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Throttled parallax scroll
    let parallaxTicking = false;
    function handleParallaxScroll() {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                createParallaxEffect();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }

    window.addEventListener('scroll', handleParallaxScroll);

    // Status indicator animation
    const statusIndicators = document.querySelectorAll('.status-indicator');
    
    statusIndicators.forEach(indicator => {
        if (indicator.classList.contains('active')) {
            setInterval(() => {
                indicator.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    indicator.style.transform = 'scale(1)';
                }, 300);
            }, 2000);
        }
    });

    // Typewriter effect for hero section (optional enhancement)
    const heroTitle = document.querySelector('.name-title');
    if (heroTitle && heroTitle.textContent) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typewriter effect after page load
        setTimeout(typeWriter, 500);
    }

    // Card glow effect following mouse
    const glowCards = document.querySelectorAll('.hero-card, .stat-card, .contact-card');
    
    glowCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Initialize everything
    updateActiveNavigation();
    
    // Window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });

    // Add loading animation completion
    document.body.classList.add('loaded');
});
