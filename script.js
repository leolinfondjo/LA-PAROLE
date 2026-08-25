/* ==========================================================================
   SITE VITRINE - LA PAROLE (LOGE N° 5385, GODF, YAOUNDÉ)
   INTERACTIONS & COMPORTEMENTS DYNAMIQUES
   ==========================================================================

   CONFIGURATION DU FORMULAIRE DE CONTACT
   --------------------------------------
   Renseignez FORMSPREE_FORM_ID ci-dessous pour activer l'envoi automatique :
     1. Créer un compte sur https://formspree.io (offre gratuite suffisante)
     2. Créer un formulaire, y indiquer l'adresse de réception de la Loge
     3. Copier l'identifiant affiché dans l'URL du formulaire
        (ex. https://formspree.io/f/xdorwqkv  ->  'xdorwqkv')

   Tant que cet identifiant est vide, le formulaire bascule automatiquement
   sur la messagerie du visiteur (mailto) : le site reste fonctionnel.
   ========================================================================== */

const FORMSPREE_FORM_ID = '';
const CONTACT_EMAIL = 'laparolegodf@gmail.com';


document.addEventListener('DOMContentLoaded', () => {

    // --- 0. GESTION DU THEME (Sombre / Clair) ---
    // La classe .light-mode est déjà posée par le script inline du <head>
    // (évite le flash au chargement) ; on se contente ici de synchroniser
    // l'étiquette du bouton et de gérer le clic.
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    function syncThemeButton() {
        if (!themeToggleBtn) return;
        const isLight = htmlEl.classList.contains('light-mode');
        const label = isLight ? 'Basculer vers le mode sombre' : 'Basculer vers le mode clair';
        themeToggleBtn.setAttribute('aria-label', label);
        themeToggleBtn.title = label;
    }

    if (themeToggleBtn) {
        syncThemeButton();

        themeToggleBtn.addEventListener('click', () => {
            const isLight = htmlEl.classList.toggle('light-mode');
            try {
                localStorage.setItem('laParoleTheme', isLight ? 'light' : 'dark');
            } catch (e) {
                /* Stockage indisponible : le thème s'applique pour la session seulement. */
            }
            syncThemeButton();
        });
    }


    // --- 1. STICKY HEADER & COMPRESSION ---
    const header = document.getElementById('main-header');

    function handleScrollHeader() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    if (header) {
        window.addEventListener('scroll', handleScrollHeader, { passive: true });
        handleScrollHeader(); // Exécution initiale au cas où la page est déjà défilée
    }


    // --- 2. MENU MOBILE HAMBURGER & DRAWER ---
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburgerToggle && mobileDrawer) {

        function openMobileMenu() {
            mobileDrawer.classList.add('open');
            mobileDrawer.setAttribute('aria-hidden', 'false');
            // inert retire tout le sous-arbre de l'ordre de tabulation ET de
            // l'arbre d'accessibilité, sans dépendre du timing des transitions CSS.
            mobileDrawer.removeAttribute('inert');
            hamburgerToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Empêche le défilement du fond

            // Force le recalcul de style avant de déplacer le focus, de façon
            // synchrone (requestAnimationFrame ne s'exécuterait pas si l'onglet
            // était en arrière-plan).
            void mobileDrawer.offsetWidth;

            // Porte le focus sur le premier lien pour la navigation au clavier
            const firstLink = mobileDrawer.querySelector('.mobile-nav-link');
            if (firstLink) firstLink.focus();
        }

        function closeMobileMenu(returnFocus) {
            // Le focus doit quitter le drawer AVANT qu'il ne devienne inert,
            // sinon il serait renvoyé sur <body> et la position serait perdue.
            if (returnFocus || mobileDrawer.contains(document.activeElement)) {
                hamburgerToggle.focus();
            }
            mobileDrawer.classList.remove('open');
            mobileDrawer.setAttribute('aria-hidden', 'true');
            mobileDrawer.setAttribute('inert', '');
            hamburgerToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Rétablit le défilement
        }

        hamburgerToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileDrawer.classList.contains('open')) {
                closeMobileMenu(false);
            } else {
                openMobileMenu();
            }
        });

        // Fermeture du menu au clic sur un lien mobile
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => closeMobileMenu(false));
        });

        // Fermeture du menu au clic à l'extérieur du drawer
        document.addEventListener('click', (e) => {
            if (mobileDrawer.classList.contains('open') &&
                !mobileDrawer.contains(e.target) &&
                !hamburgerToggle.contains(e.target)) {
                closeMobileMenu(false);
            }
        });

        // Fermeture du menu avec la touche Échap (le focus revient au bouton)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                closeMobileMenu(true);
            }
        });
    }


    // --- 3. EFFETS DE PARALLAXE DYNAMIQUE & BARRE DE PROGRESSION ---
    // Les MediaQueryList sont créées une seule fois : les interroger à chaque
    // frame d'animation serait inutilement coûteux.
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const mqReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
        if (!mqMobile.matches && !mqReducedMotion.matches) {
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
    }, { passive: true });

    // Initialisation
    updateScrollEffects();


    // --- 4. SCROLL REVEAL AVEC INTERSECTION OBSERVER & STAGGER ---
    // Sur un navigateur sans IntersectionObserver, rien ne viendrait révéler le
    // contenu : on retire la classe .js pour que le CSS l'affiche d'emblée, et
    // on saute uniquement ce bloc — le reste du script continue de s'exécuter.
    const supporteObserver = 'IntersectionObserver' in window;
    if (!supporteObserver) {
        htmlEl.classList.remove('js');
    }

    const revealGroups = supporteObserver ? document.querySelectorAll('.reveal-group') : [];

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.10
    };

    const revealObserver = supporteObserver && new IntersectionObserver((entries, observer) => {
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

    const heroContent = supporteObserver && document.querySelector('.hero-content');
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

    function closeFaqItem(item) {
        item.classList.remove('active');
        const btn = item.querySelector('.faq-question');
        const ans = item.querySelector('.faq-answer');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (ans) {
            ans.style.maxHeight = null;
            ans.setAttribute('aria-hidden', 'true');
        }
    }

    function openFaqItem(item) {
        item.classList.add('active');
        const btn = item.querySelector('.faq-question');
        const ans = item.querySelector('.faq-answer');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (ans) {
            ans.style.maxHeight = ans.scrollHeight + 'px';
            ans.setAttribute('aria-hidden', 'false');
        }
    }

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Fermer les autres éléments FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) closeFaqItem(item);
            });

            // Ouvrir/Fermer l'élément sélectionné
            if (isExpanded) {
                closeFaqItem(faqItem);
            } else {
                openFaqItem(faqItem);
            }
        });
    });

    // La hauteur d'une réponse ouverte est figée en pixels : il faut la
    // recalculer si la largeur change (rotation de l'écran, redimensionnement),
    // sinon le texte se retrouve tronqué.
    let faqResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(faqResizeTimer);
        faqResizeTimer = setTimeout(() => {
            document.querySelectorAll('.faq-item.active .faq-answer').forEach(ans => {
                ans.style.maxHeight = ans.scrollHeight + 'px';
            });
        }, 150);
    });


    // --- 5.5. SLIDER ACTUALITÉS / TRAVAUX ---
    const newsSlider = document.getElementById('news-slider');
    const sliderPrevBtn = document.getElementById('slider-prev');
    const sliderNextBtn = document.getElementById('slider-next');
    const sliderDotsContainer = document.getElementById('slider-dots');

    if (newsSlider && sliderDotsContainer) {
        const slides = newsSlider.querySelectorAll('.news-slide');
        const numSlides = slides.length;
        let currentSlide = 0;
        let slideInterval = null;

        // Les puces sont de vrais <button> : cliquables ET atteignables au clavier.
        for (let i = 0; i < numSlides; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Aller à la publication ${i + 1}`);
            if (i === 0) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            }
            dot.addEventListener('click', () => goToSlide(i));
            sliderDotsContainer.appendChild(dot);
        }

        const dots = sliderDotsContainer.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = numSlides - 1;
            if (currentSlide >= numSlides) currentSlide = 0;

            newsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, i) => {
                const isActive = i === currentSlide;
                dot.classList.toggle('active', isActive);
                if (isActive) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        }

        function startAutoplay() {
            // Défilement automatique désactivé si le visiteur a demandé à réduire
            // les animations, ou si l'onglet n'est pas visible.
            if (mqReducedMotion.matches || document.hidden || slideInterval) return;
            slideInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
            slideInterval = null;
        }

        if (sliderPrevBtn) {
            sliderPrevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        }

        if (sliderNextBtn) {
            sliderNextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        }

        startAutoplay();

        // Suspend le défilement quand l'onglet passe en arrière-plan
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        const sliderContainer = document.querySelector('.news-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoplay);
            sliderContainer.addEventListener('mouseleave', startAutoplay);

            // Suspend aussi le défilement pendant la navigation au clavier
            sliderContainer.addEventListener('focusin', stopAutoplay);
            sliderContainer.addEventListener('focusout', startAutoplay);

            // Swipe tactile basique
            let touchStartX = 0;

            sliderContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            sliderContainer.addEventListener('touchend', e => {
                const touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) goToSlide(currentSlide + 1); // swipe left
                if (touchEndX - touchStartX > 50) goToSlide(currentSlide - 1); // swipe right
            }, { passive: true });
        }
    }


    // --- 6. VALIDATION & TRANSMISSION DU FORMULAIRE ---
    const contactForm = document.getElementById('lodge-contact-form');
    const successScreen = document.getElementById('success-screen');
    const submitBtn = document.getElementById('submit-btn');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    const formError = document.getElementById('form-error');

    function showFormError(html) {
        if (!formError) return;
        formError.innerHTML = html;
        formError.hidden = false;
    }

    function clearFormError() {
        if (!formError) return;
        formError.hidden = true;
        formError.innerHTML = '';
    }

    // Construit un lien mailto pré-rempli à partir des champs saisis.
    function buildMailtoLink(data) {
        const subject = encodeURIComponent(`[La Parole] ${data.get('objet') || 'Prise de contact'}`);
        const body = encodeURIComponent(
            `Nom : ${data.get('name') || ''}\n` +
            `Email : ${data.get('email') || ''}\n` +
            `Téléphone : ${data.get('phone') || 'Non fourni'}\n\n` +
            `Message :\n${data.get('message') || ''}`
        );
        return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    }

    function showSuccessScreen() {
        if (!contactForm || !successScreen) return;
        clearFormError();
        contactForm.style.display = 'none';
        successScreen.style.display = 'flex';
        successScreen.setAttribute('aria-hidden', 'false');

        const heading = successScreen.querySelector('h3');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }

        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormError();

            const formData = new FormData(contactForm);

            // Le piège à robots n'est jamais rempli par un humain : on abandonne
            // silencieusement l'envoi en affichant malgré tout la confirmation.
            if (formData.get('_gotcha')) {
                contactForm.reset();
                showSuccessScreen();
                return;
            }

            // Formspree utilise _subject comme objet de l'e-mail reçu.
            formData.set('_subject', `[La Parole] ${formData.get('objet') || 'Prise de contact'}`);

            const mailtoLink = buildMailtoLink(formData);

            // Sans identifiant Formspree configuré, on passe directement par la
            // messagerie du visiteur plutôt que de tenter un envoi voué à l'échec.
            if (!FORMSPREE_FORM_ID) {
                showFormError(
                    'L\'envoi automatique n\'est pas encore configuré sur ce site. ' +
                    `<a href="${mailtoLink}">Cliquez ici pour nous envoyer votre message</a> ` +
                    `depuis votre messagerie, ou écrivez-nous à <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`
                );
                return;
            }

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Transmission en cours...';

            try {
                const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) throw new Error(`Réponse ${response.status} du service d'envoi.`);

                contactForm.reset();
                showSuccessScreen();
            } catch (error) {
                console.error("Erreur d'envoi du formulaire :", error);
                showFormError(
                    'La transmission automatique a échoué. ' +
                    `<a href="${mailtoLink}">Envoyer ce message depuis votre messagerie</a>, ` +
                    `ou écrivez-nous à <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    if (backToFormBtn && contactForm && successScreen) {
        backToFormBtn.addEventListener('click', () => {
            successScreen.style.display = 'none';
            successScreen.setAttribute('aria-hidden', 'true');
            contactForm.style.display = 'flex';
            clearFormError();
            const firstField = document.getElementById('full-name');
            if (firstField) firstField.focus();
        });
    }


    // --- 7. FILTRES ACTUALITÉS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterBtns.length > 0 && blogCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Mettre à jour l'état actif
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                // Filtrage
                const filterValue = btn.getAttribute('data-filter');
                blogCards.forEach(card => {
                    const matches = filterValue === 'all' ||
                                    card.getAttribute('data-category') === filterValue;
                    if (matches) {
                        card.hidden = false;
                        // petite animation d'apparition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.hidden = true;
                        }, 300);
                    }
                });
            });
        });
    }
});
