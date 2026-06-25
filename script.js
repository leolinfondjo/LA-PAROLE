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


    // --- 3. EFFETS DE PARALLAXE JS COMPLÉMENTAIRES (DESKTOP SEULEMENT) ---
    const isMobile = () => window.innerWidth <= 768;
    const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const heroBg = document.getElementById('hero-bg-elem');
    const filigraneCompass = document.querySelector('.filigrane-compass');
    const filigraneScroll = document.querySelector('.filigrane-scroll');
    
    function handleParallax() {
        if (isMobile() || prefersReducedMotion()) return;
        
        const scrollPosition = window.scrollY;
        
        // Parallaxe Hero (Translation douce de l'image de fond)
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
        
        // Parallaxe Filigranes dans les sections Bienvenue et Pourquoi La Parole
        // (Ajustement subtil de la position d'arrière-plan)
        if (filigraneCompass) {
            filigraneCompass.style.transform = `translate(-50%, calc(-50% + ${scrollPosition * 0.08}px))`;
        }
        
        if (filigraneScroll) {
            filigraneScroll.style.transform = `translate(-50%, calc(-50% + ${scrollPosition * 0.08}px))`;
        }
    }
    
    window.addEventListener('scroll', handleParallax);


    // --- 4. SCROLL REVEAL AVEC INTERSECTION OBSERVER & STAGGER ---
    const revealGroups = document.querySelectorAll('.reveal-group');
    
    // Options de l'observateur (se déclenche quand 10% de la section est visible)
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
                
                // Stagger dynamique des éléments enfants .reveal-item
                const items = target.querySelectorAll('.reveal-item');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 120}ms`;
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
                
                // Cartes historiques spécifiques (dans la section histoire)
                const cards = target.querySelectorAll('.history-card');
                cards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 150}ms`;
                    card.classList.add('reveal-card-visible');
                });
                
                // Blocs à propos spécifiques
                const aboutBlocks = target.querySelectorAll('.about-block');
                aboutBlocks.forEach((block, index) => {
                    block.style.transitionDelay = `${index * 150}ms`;
                    block.classList.add('reveal-card-visible');
                });

                // Une fois révélée, plus besoin d'observer cette section
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    // Associer l'observateur à toutes les sections à révéler
    revealGroups.forEach(group => {
        revealObserver.observe(group);
    });
    
    // Révéler immédiatement le Hero (au chargement)
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


    // --- 5. VALIDATION & TRANSMISSION DU FORMULAIRE ---
    const contactForm = document.getElementById('lodge-contact-form');
    const successScreen = document.getElementById('success-screen');
    const submitBtn = document.getElementById('submit-btn');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    const messageField = document.getElementById('message-content');
    
    // Validation du nombre de lignes du message
    function validateMessageLines() {
        const messageText = messageField.value;
        // Découpe le texte par saut de ligne, filtre les lignes vides
        const lines = messageText.split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length < 6) {
            messageField.setCustomValidity("Votre message doit contenir au moins 6 lignes de texte pour être transmis.");
            return false;
        } else {
            messageField.setCustomValidity("");
            return true;
        }
    }
    
    messageField.addEventListener('input', validateMessageLines);
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Re-validation finale du nombre de lignes
            if (!validateMessageLines()) {
                contactForm.reportValidity();
                return;
            }
            
            // Préparer le bouton pour l'envoi
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = "Transmission en cours...";
            
            // Extraction des données du formulaire
            const formData = new FormData(contactForm);
            
            try {
                // Envoi AJAX à Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Succès de la transmission
                    contactForm.reset();
                    showSuccessScreen();
                } else {
                    // Échec (Code statut HTTP invalide de Formspree)
                    throw new Error("Une erreur réseau est survenue lors de la transmission.");
                }
            } catch (error) {
                console.error("Erreur d'envoi du formulaire :", error);
                
                // Plan de secours en cas d'erreur de réseau/Formspree : Mailto natif
                const emailTo = "leolinfondjo@gmail.com";
                const subject = encodeURIComponent(formData.get('_subject') || "Contact Loge La Parole");
                const bodyText = encodeURIComponent(
                    `Nom : ${formData.get('name')}\n` +
                    `Email : ${formData.get('email')}\n\n` +
                    `Message :\n${formData.get('message')}`
                );
                
                const mailtoUrl = `mailto:${emailTo}?subject=${subject}&body=${bodyText}`;
                
                // Message d'erreur demandant à l'utilisateur d'envoyer via son client mail
                const userConfirmed = confirm(
                    "La transmission automatique a échoué. Souhaitez-vous ouvrir votre messagerie par défaut pour nous faire parvenir votre message à leolinfondjo@gmail.com ?"
                );
                
                if (userConfirmed) {
                    window.location.href = mailtoUrl;
                    showSuccessScreen();
                }
            } finally {
                // Rétablir le bouton
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    function showSuccessScreen() {
        contactForm.style.display = 'none';
        successScreen.style.display = 'flex';
        successScreen.setAttribute('aria-hidden', 'false');
        
        // Défilement automatique doux vers la section contact pour voir le succès
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
    
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', () => {
            successScreen.style.display = 'none';
            successScreen.setAttribute('aria-hidden', 'true');
            contactForm.style.display = 'flex';
            
            // Focus sur le premier champ
            document.getElementById('full-name').focus();
        });
    }
});
