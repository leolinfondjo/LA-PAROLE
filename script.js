/* ==========================================================================
   SITE VITRINE - LA PAROLE (LOGE N° 5385, GODF, YAOUNDÉ)
   INTERACTIONS & COMPORTEMENTS DYNAMIQUES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. GESTION DU THEME (Sombre / Clair) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Lire la pr\u00e9f\u00e9rence sauvegard\u00e9e ou utiliser 'dark' par d\u00e9faut
    const savedTheme = localStorage.getItem('laParoleTheme') || 'dark';
    if (savedTheme === 'light') {
        htmlEl.classList.add('light-mode');
        themeToggleBtn.setAttribute('aria-label', 'Basculer vers le mode sombre');
        themeToggleBtn.title = 'Basculer vers le mode sombre';
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = htmlEl.classList.toggle('light-mode');

        if (isLight) {
            localStorage.setItem('laParoleTheme', 'light');
            themeToggleBtn.setAttribute('aria-label', 'Basculer vers le mode sombre');
            themeToggleBtn.title = 'Basculer vers le mode sombre';
        } else {
            localStorage.setItem('laParoleTheme', 'dark');
            themeToggleBtn.setAttribute('aria-label', 'Basculer vers le mode clair');
            themeToggleBtn.title = 'Basculer vers le mode clair';
        }
    });

    // --- 1. STICKY HEADER & COMPRESSION ---
    const header = document.getElementById('main-header');
    
    function handleScrollHeader() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Exécution initiale au cas où la page est déjà défilée


    // --- 2. MENU MOBILE HAMBURGER & DRAWER ---
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    function toggleMobileMenu() {
        const isOpen = mobileDrawer.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        hamburgerToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Empêche le défilement du fond
    }
    
    function closeMobileMenu() {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        hamburgerToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Rétablit le défilement
    }
    
    hamburgerToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Fermeture du menu au clic sur un lien mobile
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Fermeture du menu au clic à l'extérieur du drawer
    document.addEventListener('click', (e) => {
        if (mobileDrawer.classList.contains('open') && 
            !mobileDrawer.contains(e.target) && 
            !hamburgerToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Fermeture du menu avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
            closeMobileMenu();
        }
    });


    // --- 3. EFFETS DE PARALLAXE DYNAMIQUE & BARRE DE PROGRESSION ---
    const isMobile = () => window.innerWidth <= 768;
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const heroBg = document.getElementById('hero-bg-elem');
    const filigraneCompass = document.querySelector('.filigrane-compass');
    const filigraneScroll = document.querySelector('.filigrane-scroll');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollPosition = window.scrollY;
        
        // 1. Mise à jour de la barre de progression
        if (scrollProgressBar) {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = documentHeight > 0 ? (scrollPosition / documentHeight) * 100 : 0;
            scrollProgressBar.style.width = `${progress}%`;
        }
        
        // 2. Effet parallaxe fluide (Desktop uniquement, sans Reduced Motion)
        if (!isMobile() && !prefersReducedMotion()) {
            // Parallaxe Hero (translate3d pour accélération matérielle)
            if (heroBg) {
                heroBg.style.transform = `translate3d(0, ${scrollPosition * 0.3}px, 0)`;
            }
            
            // Parallaxe Filigranes
            if (filigraneCompass) {
                filigraneCompass.style.transform = `translate3d(-50%, calc(-50% + ${scrollPosition * 0.08}px), 0)`;
            }
            
            if (filigraneScroll) {
                filigraneScroll.style.transform = `translate3d(-50%, calc(-50% + ${scrollPosition * 0.08}px), 0)`;
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    // Initialisation
    updateScrollEffects();


    // --- 4. SCROLL REVEAL AVEC INTERSECTION OBSERVER & STAGGER ---
    const revealGroups = document.querySelectorAll('.reveal-group');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.10
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('reveal-visible');
                
                const items = target.querySelectorAll('.reveal-item');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 120}ms`;
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
                
                const cards = target.querySelectorAll('.history-card');
                cards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 150}ms`;
                    card.classList.add('reveal-card-visible');
                });
                
                const aboutBlocks = target.querySelectorAll('.about-block');
                aboutBlocks.forEach((block, index) => {
                    block.style.transitionDelay = `${index * 150}ms`;
                    block.classList.add('reveal-card-visible');
                });

                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    revealGroups.forEach(group => {
        revealObserver.observe(group);
    });
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            const heroItems = heroContent.querySelectorAll('.reveal-item');
            heroItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 150}ms`;
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }, 100);
    }


    // --- 5. ACCORDÉON DE LA FAQ ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Fermer les autres éléments FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const btn = item.querySelector('.faq-question');
                    btn.setAttribute('aria-expanded', 'false');
                    const ans = item.querySelector('.faq-answer');
                    ans.style.maxHeight = null;
                    ans.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Ouvrir/Fermer l'élément sélectionné
            if (isExpanded) {
                faqItem.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
                faqAnswer.style.maxHeight = null;
                faqAnswer.setAttribute('aria-hidden', 'true');
            } else {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                faqAnswer.setAttribute('aria-hidden', 'false');
            }
        });
    });


    // --- 5.5. SLIDER ACTUALITÉS / TRAVAUX ---
    const newsSlider = document.getElementById('news-slider');
    const sliderPrevBtn = document.getElementById('slider-prev');
    const sliderNextBtn = document.getElementById('slider-next');
    const sliderDotsContainer = document.getElementById('slider-dots');
    
    if (newsSlider) {
        const slides = newsSlider.querySelectorAll('.news-slide');
        const numSlides = slides.length;
        let currentSlide = 0;
        
        for (let i = 0; i < numSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            sliderDotsContainer.appendChild(dot);
        }
        
        const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
        
        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = numSlides - 1;
            if (currentSlide >= numSlides) currentSlide = 0;
            
            newsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
        
        if (sliderPrevBtn) {
            sliderPrevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
            });
        }
        
        if (sliderNextBtn) {
            sliderNextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
        }
        
        let slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 6000);
        
        const sliderContainer = document.querySelector('.news-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    goToSlide(currentSlide + 1);
                }, 6000);
            });
            
            // Swipe tactile basique
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            sliderContainer.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1); // swipe left
                if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1); // swipe right
            }, {passive: true});
        }
    }


    // --- 6. VALIDATION & TRANSMISSION DU FORMULAIRE ---
    const contactForm = document.getElementById('lodge-contact-form');
    const successScreen = document.getElementById('success-screen');
    const submitBtn = document.getElementById('submit-btn');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Transmission en cours...";
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    contactForm.reset();
                    showSuccessScreen();
                } else {
                    throw new Error("Une erreur réseau est survenue.");
                }
            } catch (error) {
                console.error("Erreur d'envoi du formulaire :", error);
                
                const emailTo = "leolinfondjo@gmail.com";
                const subject = encodeURIComponent(formData.get('_subject') || "Contact Loge La Parole");
                const bodyText = encodeURIComponent(
                    `Nom : ${formData.get('name')}\n` +
                    `Email : ${formData.get('email')}\n` +
                    `Téléphone : ${formData.get('phone') || 'Non fourni'}\n\n` +
                    `Message :\n${formData.get('message')}`
                );
                
                const mailtoUrl = `mailto:${emailTo}?subject=${subject}&body=${bodyText}`;
                
                const userConfirmed = confirm(
                    "La transmission automatique a échoué. Souhaitez-vous ouvrir votre messagerie par défaut pour nous faire parvenir votre message à leolinfondjo@gmail.com ?"
                );
                
                if (userConfirmed) {
                    window.location.href = mailtoUrl;
                    showSuccessScreen();
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    function showSuccessScreen() {
        contactForm.style.display = 'none';
        successScreen.style.display = 'flex';
        successScreen.setAttribute('aria-hidden', 'false');
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
    
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', () => {
            successScreen.style.display = 'none';
            successScreen.setAttribute('aria-hidden', 'true');
            contactForm.style.display = 'flex';
            document.getElementById('full-name').focus();
        });
    }

    // --- 7. FILTRES ACTUALITÉS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterBtns.length > 0 && blogCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Mettre à jour l'état actif
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filtrage
                const filterValue = btn.getAttribute('data-filter');
                blogCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        // petite animation d'apparition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
});
