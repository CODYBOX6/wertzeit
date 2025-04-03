// script.js
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
    
    // Initial trigger
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Animation spécifique pour les highlights
    const aboutSection = document.querySelector('#about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const highlights = entry.target.querySelectorAll('[class^="highlight-"]');
                highlights.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.backgroundPosition = '100% 0';
                    }, index * 150);
                });
            }
        });
    }, { threshold: 0.3 });

    if (aboutSection) observer.observe(aboutSection);

    // Menu mobile amélioré
    const menuButton = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.querySelector('.hidden.md\\:flex');
    
    if (menuButton && mobileMenu) {
        // Transforme le menu existant en menu mobile
        mobileMenu.classList.add('mobile-menu');
        
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('text-main-accent');
        });
        
        // Ferme le menu quand on clique sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuButton.classList.remove('text-main-accent');
            });
        });
    }

    // Formulaire WhatsApp
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
            createConfetti();
            
            // Feedback visuel
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

    // Effets de particules
    function createParticles(containerId, count = 30) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                width: ${Math.random() * 5 + 1}px;
                height: ${Math.random() * 5 + 1}px;
                left: ${Math.random() * 100}%;
                bottom: -${Math.random() * 5 + 1}px;
                background: ${['#3ddc97', '#5ef0c1', '#2cca61', '#217a4a', '#ff6b6b', '#4cc9f0', '#f8961e'][Math.floor(Math.random() * 7)]};
                opacity: ${Math.random() * 0.5 + 0.1};
                animation-duration: ${Math.random() * 20 + 10}s;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
    }

    // Confetti
    function createConfetti() {
        const colors = ['#3ddc97', '#5ef0c1', '#2cca61', '#217a4a', '#ff6b6b', '#4cc9f0', '#f8961e'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}vw;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-duration: ${Math.random() * 3 + 2}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), (Math.random() * 3 + 2) * 1000);
        }
    }

    // Effet de morphing
    document.querySelectorAll('.morph-effect').forEach(el => {
        setInterval(() => {
            el.style.borderRadius = `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% / ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`;
        }, 3000);
    });

    // Effet de parallaxe
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.parallax').forEach(el => {
            el.style.backgroundPositionY = `-${window.scrollY * 0.3}px`;
        });
    });

    // Barre de progression de défilement
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('nav-progress');
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollProgress.style.width = (window.scrollY / scrollHeight) * 100 + '%';
        }
    });

    // Initialisation
    createParticles('particles-js', 50);

    // Gestion du compteur de vues
    let viewCount = parseInt(localStorage.getItem('viewCount')) || 0;
    const lastViewTime = parseInt(localStorage.getItem('lastViewTime')) || 0;
    const currentTime = Date.now();
    const timeBetweenViews = 1000; // 1 secondes minimum entre chaque vue

    // Vérifier si assez de temps s'est écoulé depuis la dernière vue
    if (currentTime - lastViewTime > timeBetweenViews) {
        viewCount++;
        localStorage.setItem('viewCount', viewCount);
        localStorage.setItem('lastViewTime', currentTime);
        
        // Mettre à jour l'affichage
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            viewCountElement.textContent = viewCount;
        }

        // Calculer et mettre à jour la jauge de progression
        const levelProgress = document.querySelector('.level-progress');
        if (levelProgress) {
            // Calculer le pourcentage de progression (max 100%)
            const progress = Math.min((viewCount % 100) / 100 * 100, 100);
            levelProgress.style.width = `${progress}%`;
            
            // Ajouter une classe pour l'animation
            levelProgress.classList.add('animate-progress');
            
            // Retirer la classe après l'animation
            setTimeout(() => {
                levelProgress.classList.remove('animate-progress');
            }, 1000);
        }
    }

    // Gestion du formulaire mail
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', function() {
            const name = document.getElementById('name').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !subject || !message) {
                alert("Veuillez remplir tous les champs obligatoires");
                return;
            }
            
            // Créer le lien mailto avec les informations pré-remplies
            const email = 'sonnybox@hotmail.com';
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Bonjour Sonny,\n\nJe m'appelle ${name}.\n\n${message}\n\nCordialement,\n${name}`)}`;
            
            // Ouvrir le client de messagerie
            window.location.href = mailtoLink;
            
            // Feedback visuel
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Application mail ouverte !';
            this.classList.replace('bg-main-gradient', 'bg-green-500');
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.replace('bg-green-500', 'bg-main-gradient');
            }, 3000);
        });
    }

    // Toggle pour l'option vidéo
    const videoTrigger = document.querySelector('.js-video-option-trigger');
    if (videoTrigger) {
        videoTrigger.addEventListener('click', function(e) {
            e.stopPropagation(); // Empêche la fermeture immédiate
            const details = document.querySelector('.js-video-option-details');
            this.classList.toggle('active');
            details.classList.toggle('open');
            details.classList.toggle('hidden');
        });
    }

    // Ferme les détails quand on clique ailleurs
    document.addEventListener('click', function(e) {
        const trigger = document.querySelector('.js-video-option-trigger');
        const details = document.querySelector('.js-video-option-details');
        
        if (trigger && details && !trigger.contains(e.target) && !details.contains(e.target)) {
            trigger.classList.remove('active');
            details.classList.remove('open');
            details.classList.add('hidden');
        }
    });
});