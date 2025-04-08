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

    // Nouveau menu mobile - version simplifiée et moderne
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }

        // Ferme le menu quand on clique sur un lien
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });
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
            createConfetti();

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
                background: ${['#3ddc97','#5ef0c1','#2cca61','#217a4a','#ff6b6b','#4cc9f0','#f8961e'][Math.floor(Math.random()*7)]};
                opacity: ${Math.random() * 0.5 + 0.1};
                animation-duration: ${Math.random() * 20 + 10}s;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
    }

    // Confetti (inchangé)
    function createConfetti() {
        const colors = ['#3ddc97','#5ef0c1','#2cca61','#217a4a','#ff6b6b','#4cc9f0','#f8961e'];
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
    document.addEventListener('click', function(e) {
        const trigger = document.querySelector('.js-video-option-trigger');
        const details = document.querySelector('.js-video-option-details');
        if (trigger && details && !trigger.contains(e.target) && !details.contains(e.target)) {
            trigger.classList.remove('active');
            details.classList.remove('open');
            details.classList.add('hidden');
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

    // Crée des particules (inchangé)
    createParticles('particles-js', 50);

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
});