document.addEventListener('DOMContentLoaded', function() {
    // Animation au scroll
    const animateOnScroll = () => {
        document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-top').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('is-visible');
            }
        });
    };
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Animation des cartes d'expertise en effet domino au scroll
    const scrollRevealCards = document.querySelectorAll('.scroll-reveal');
    let revealTimeout;

    function checkScrollReveal() {
        // Trouver le point de déclenchement (milieu de la fenêtre)
        const triggerPoint = window.innerHeight * 0.6;
        
        // Vérifier si les cartes sont visibles dans ce point de déclenchement
        let isAnyCardVisible = false;
        
        scrollRevealCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardBottom = card.getBoundingClientRect().bottom;
            
            // Vérifier si la carte est dans la zone de déclenchement
            if (cardTop < triggerPoint && cardBottom > 0) {
                isAnyCardVisible = true;
            }
        });
        
        // Si au moins une carte est visible, démarrer l'effet domino
        if (isAnyCardVisible) {
            revealCards();
        } else {
            // Si aucune carte n'est visible, tout refermer
            hideCards();
        }
    }
    
    function revealCards() {
        // Annuler tout minuteur existant
        clearTimeout(revealTimeout);
        
        // Révéler les cartes en séquence
        scrollRevealCards.forEach((card, index) => {
            const content = card.querySelector('.expertise-content');
            const hint = card.querySelector('.expertise-hint');
            
            revealTimeout = setTimeout(() => {
                // Révéler le contenu
                content.classList.remove('hidden');
                
                // Ajouter des effets visuels
                card.classList.add('border-main-accent');
                card.classList.add('bg-white/10');
                
                // Animer la flèche
                if (hint) {
                    hint.style.transform = 'rotate(90deg)';
                    hint.style.color = '#3ddc97';
                }
            }, index * 200); // Délai progressif pour l'effet domino
        });
    }
    
    function hideCards() {
        // Annuler tout minuteur existant
        clearTimeout(revealTimeout);
        
        // Cacher les cartes en séquence inverse
        [...scrollRevealCards].reverse().forEach((card, index) => {
            const content = card.querySelector('.expertise-content');
            const hint = card.querySelector('.expertise-hint');
            
            revealTimeout = setTimeout(() => {
                // Cacher le contenu
                content.classList.add('hidden');
                
                // Retirer les effets visuels
                card.classList.remove('border-main-accent');
                card.classList.remove('bg-white/10');
                
                // Réinitialiser la flèche
                if (hint) {
                    hint.style.transform = 'rotate(0deg)';
                    hint.style.color = '';
                }
            }, index * 150); // Délai progressif pour l'effet domino inversé
        });
    }
    
    // Initialiser la vérification et configurer l'écouteur d'événement scroll
    checkScrollReveal();
    window.addEventListener('scroll', checkScrollReveal);

    // Highlights (dans la section #about)
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const highlights = entry.target.querySelectorAll('[class^="highlight-"]');
                    highlights.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.backgroundPosition = '100% 0';
                            el.classList.add('animated');
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        observer.observe(aboutSection);
    }

    // Formulaire WhatsApp (inchangé)
    const whatsappForm = document.getElementById('whatsappForm');
    const submitBtn = document.getElementById('submitBtn');
    if (whatsappForm && submitBtn) {
        let canSubmit = true;
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!canSubmit) {
                alert("Veuillez patienter avant un nouvel envoi.");
                return;
            }
            const nameVal = document.getElementById('nameField').value.trim();
            const msgVal = document.getElementById('messageField').value.trim();
            if (!nameVal || !msgVal) {
                alert("Merci de saisir au moins votre nom et un message.");
                return;
            }
            const text = `Bonjour, je m'appelle ${nameVal}.\n -> ${msgVal}\n\nMerci !`;
            const phoneNumber = '+41799139344';
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
            window.open(whatsappURL, '_blank');

            submitBtn.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Message envoyé !`;
            submitBtn.classList.replace('bg-main-gradient', 'bg-green-500');
            canSubmit = false;
            submitBtn.disabled = true;

            setTimeout(() => {
                canSubmit = true;
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fab fa-whatsapp mr-2"></i> Envoyer sur WhatsApp`;
                submitBtn.classList.replace('bg-green-500', 'bg-main-gradient');
                whatsappForm.reset();
            }, 8000);
        });
    }

    // Particules (inchangé)
    // createParticles('particles-js', 50); // Commenter cette ligne pour désactiver les particules

    // Morphing (inchangé)
    document.querySelectorAll('.morph-effect').forEach(el => {
        setInterval(() => {
            el.style.borderRadius = `
                ${Math.random()*50}% ${Math.random()*50}% ${Math.random()*50}% ${Math.random()*50}% / 
                ${Math.random()*50}% ${Math.random()*50}% ${Math.random()*50}% ${Math.random()*50}%`;
        }, 3000);
    });

    // Barre défilement (adaptée pour mobile)
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('nav-progress');
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (window.scrollY / scrollHeight) * 100 + '%';
        }
    });

    // Ajout de la fonctionnalité de déplacement du curseur sur la jauge de progression
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        let isDragging = false;
        
        // Fonction pour mettre à jour la position de défilement
        const updateScrollPosition = (clientX) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickPosition = clientX - rect.left;
            const containerWidth = rect.width;
            const percentage = Math.max(0, Math.min(100, (clickPosition / containerWidth) * 100));
            
            // Calculer la position de défilement correspondante
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = (percentage / 100) * scrollHeight;
            
            // Défiler vers la position calculée avec un comportement instantané
            window.scrollTo({
                top: scrollPosition,
                behavior: 'auto'
            });
        };
        
        // Événement mousedown pour commencer le glissement
        progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateScrollPosition(e.clientX);
        });
        
        // Événement mousemove pour suivre le curseur avec requestAnimationFrame
        let rafId = null;
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
                rafId = requestAnimationFrame(() => {
                    updateScrollPosition(e.clientX);
                });
            }
        });
        
        // Événement mouseup pour arrêter le glissement
        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
        
        // Événement mouseleave pour arrêter le glissement si le curseur quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            isDragging = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
        
        // Conserver l'événement click pour la compatibilité
        progressContainer.addEventListener('click', (e) => {
            if (!isDragging) {
                updateScrollPosition(e.clientX);
            }
        });
    }

    // Compteur de vues (inchangé)
    let viewCount = parseInt(localStorage.getItem('viewCount')) || 0;
    const lastViewTime = parseInt(localStorage.getItem('lastViewTime')) || 0;
    const currentTime = Date.now();
    const timeBetweenViews = 1000; 
    if (currentTime - lastViewTime > timeBetweenViews) {
        viewCount++;
        localStorage.setItem('viewCount', viewCount);
        localStorage.setItem('lastViewTime', currentTime);
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) { viewCountElement.textContent = viewCount; }
        const levelProgress = document.querySelector('.level-progress');
        if (levelProgress) {
            const progress = Math.min((viewCount % 100) / 100 * 100, 100);
            levelProgress.style.width = `${progress}%`;
            levelProgress.classList.add('animate-progress');
            setTimeout(() => {
                levelProgress.classList.remove('animate-progress');
            }, 1000);
        }
    }

    // Formulaire mail (modifié pour redirection)
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', function() {
            const emailSection = document.querySelector('.bg-white\\/5.p-8.rounded-xl.backdrop-blur-sm.border.border-white\\/10');
            if (emailSection) {
                emailSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Toggle option vidéo (inchangé)
    const videoTrigger = document.querySelector('.js-video-option-trigger');
    if (videoTrigger) {
        videoTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const details = document.querySelector('.js-video-option-details');
            this.classList.toggle('active');
            details.classList.toggle('open');
            details.classList.toggle('hidden');
        });
    }
    
    // Toggle option Pareto
    const paretoTrigger = document.querySelector('.js-pareto-option-trigger');
    if (paretoTrigger) {
        paretoTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const details = document.querySelector('.js-pareto-option-details');
            this.classList.toggle('active');
            details.classList.toggle('open');
            details.classList.toggle('hidden');
        });
    }
    
    document.addEventListener('click', function(e) {
        const videoTrigger = document.querySelector('.js-video-option-trigger');
        const videoDetails = document.querySelector('.js-video-option-details');
        const paretoTrigger = document.querySelector('.js-pareto-option-trigger');
        const paretoDetails = document.querySelector('.js-pareto-option-details');
        
        if (videoTrigger && videoDetails && !videoTrigger.contains(e.target) && !videoDetails.contains(e.target)) {
            videoTrigger.classList.remove('active');
            videoDetails.classList.remove('open');
            videoDetails.classList.add('hidden');
        }
        
        if (paretoTrigger && paretoDetails && !paretoTrigger.contains(e.target) && !paretoDetails.contains(e.target)) {
            paretoTrigger.classList.remove('active');
            paretoDetails.classList.remove('open');
            paretoDetails.classList.add('hidden');
        }
    });

    // NavLink actif (adapté pour mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('text-main-light');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-main-light');
            }
        });
    });

    // Animation des badges (inchangé)
    const badges = document.querySelectorAll('.badge');
    if (badges.length) {
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px)';
            badge.style.transition = `all 0.5s ease ${index * 0.1}s`;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(badge);
        });
    }

    // Animation des projets au scroll
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // Gestion des animations au scroll
    const animatedElements = document.querySelectorAll('.animate-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.visibility = 'visible';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.visibility = 'hidden';
        observer.observe(element);
    });
    
    // Gestion des sections d'expertise cliquables
    const expertiseCards = document.querySelectorAll('.expertise-card');
    expertiseCards.forEach(card => {
        card.addEventListener('click', function() {
            const content = this.querySelector('.expertise-content');
            const hint = this.querySelector('.expertise-hint');
            
            // Basculer entre visible et caché sans modifier la disposition
            content.classList.toggle('hidden');
            
            // Effet visuel pour indiquer l'état actif/inactif
            if (!content.classList.contains('hidden')) {
                this.classList.add('border-main-accent');
                this.classList.add('bg-white/10');
                
                // Animation de rotation de la flèche vers le bas (90 degrés)
                if (hint) {
                    hint.style.transform = 'rotate(90deg)';
                    hint.style.color = '#3ddc97'; // Couleur d'accent plus simple pour meilleure performance
                }
            } else {
                this.classList.remove('border-main-accent');
                this.classList.remove('bg-white/10');
                
                // Réinitialisation de la rotation
                if (hint) {
                    hint.style.transform = 'rotate(0deg)';
                    hint.style.color = '';
                }
            }
        });
    });
    
    // Gestion de la FAQ interactive
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const progressBar = document.querySelector('.faq-progress .progress-bar');
    const faqCounter = document.querySelector('.faq-counter');
    
    // Pour suivre les questions vues
    let questionsViewed = new Set();
    let activeQuestion = null;
    
    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const chevron = this.querySelector('.fa-chevron-down');
            
            // Si cette question est déjà active, on la ferme
            if (activeQuestion === faqItem) {
                // Fermer la réponse active
                answer.style.maxHeight = '0';
                chevron.style.transform = 'rotate(0deg)';
                faqItem.classList.remove('border-main-accent');
                faqItem.classList.remove('bg-white/10');
                activeQuestion = null;
                return;
            }
            
            // Fermer la question active précédente, si elle existe
            if (activeQuestion) {
                const activeAnswer = activeQuestion.querySelector('.faq-answer');
                const activeChevron = activeQuestion.querySelector('.fa-chevron-down');
                
                activeAnswer.style.maxHeight = '0';
                activeChevron.style.transform = 'rotate(0deg)';
                activeQuestion.classList.remove('border-main-accent');
                activeQuestion.classList.remove('bg-white/10');
            }
            
            // Ouvrir la nouvelle question
            answer.style.maxHeight = answer.scrollHeight + 'px';
            chevron.style.transform = 'rotate(180deg)';
            faqItem.classList.add('border-main-accent');
            faqItem.classList.add('bg-white/10');
            
            // Ajouter un effet sonore subtil
            playSoundEffect();
            
            // Enregistrer cette question comme vue
            questionsViewed.add(index);
            
            // Mettre à jour la barre de progression
            updateProgress();
            
            // Définir cette question comme active
            activeQuestion = faqItem;
            
            // Animation d'apparition
            answer.addEventListener('transitionend', function onEnd() {
                answer.classList.add('highlight-animation');
                answer.removeEventListener('transitionend', onEnd);
                
                // Retirer l'animation après qu'elle soit terminée
                setTimeout(() => {
                    answer.classList.remove('highlight-animation');
                }, 1000);
            }, { once: true });
        });
    });
    
    // Fonction pour mettre à jour la barre de progression
    function updateProgress() {
        const progress = (questionsViewed.size / faqQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        faqCounter.textContent = `${questionsViewed.size}/${faqQuestions.length} questions explorées`;
        
        // Si toutes les questions ont été vues, ajouter un effet de réussite
        if (questionsViewed.size === faqQuestions.length) {
            setTimeout(() => {
                const faqSection = document.querySelector('#faq');
                showCompletionEffect(faqSection);
            }, 500);
        }
    }
    
    // Effet sonore pour le clic (à activer uniquement si l'utilisateur a interagi avec la page)
    function playSoundEffect() {
        // Cette fonction peut être développée si nécessaire pour ajouter de l'audio
        // Pour l'instant, nous la laissons vide pour éviter d'affecter l'expérience utilisateur
    }
    
    // Effet de confetti lorsque toutes les questions ont été explorées
    function showCompletionEffect(element) {
        faqCounter.innerHTML = `<span class="text-main font-bold">5/5 questions explorées - Félicitations ! 🎉</span>`;
        progressBar.classList.add('pulse-animation');
        
        // Créer un effet de pulsation autour du conteneur FAQ
        element.classList.add('completion-glow');
        setTimeout(() => element.classList.remove('completion-glow'), 2000);
    }
});