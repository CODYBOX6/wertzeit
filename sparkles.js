/**
 * Effet Sparkles - Version JavaScript vanilla
 * Adapté du composant React SparklesCore
 */

function createSparklesEffect(containerId, options = {}) {
  // Options par défaut
  const config = {
    background: options.background || 'transparent',
    minSize: options.minSize || 0.6,
    maxSize: options.maxSize || 1.4,
    particleDensity: options.particleDensity || 100,
    particleColor: options.particleColor || '#FFFFFF',
    speed: options.speed || 1,
    zIndex: options.zIndex || 5
  };

  // Récupérer ou créer le conteneur
  let container = document.getElementById(containerId);
  if (!container) {
    console.error(`Le conteneur avec l'ID ${containerId} n'existe pas.`);
    return;
  }

  // S'assurer que le conteneur a une position relative
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  // Créer le canvas pour les particules
  const canvas = document.createElement('canvas');
  canvas.id = `${containerId}-canvas`;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = config.zIndex;
  canvas.style.pointerEvents = 'none'; // Permet de cliquer à travers le canvas
  container.appendChild(canvas);

  // Créer les gradients si besoin
  if (options.gradients) {
    const gradients = options.gradients;
    gradients.forEach((gradient, index) => {
      const gradientEl = document.createElement('div');
      gradientEl.style.position = 'absolute';
      gradientEl.style.inset = gradient.inset || 'auto';
      gradientEl.style.background = gradient.background;
      gradientEl.style.height = gradient.height || 'auto';
      gradientEl.style.width = gradient.width || 'auto';
      gradientEl.style.blur = gradient.blur ? `blur(${gradient.blur})` : 'none';
      gradientEl.style.zIndex = config.zIndex + 1;
      container.appendChild(gradientEl);
    });
  }

  // Obtenir le contexte de rendu 2D
  const ctx = canvas.getContext('2d');

  // Variables pour les particules
  let particles = [];
  let animationFrame;
  let width, height;

  // Fonction pour redimensionner le canvas
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  }

  // Classe Particule
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
      this.speed = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.increasingOpacity = Math.random() > 0.5;
      this.opacitySpeed = (Math.random() * 0.02 + 0.005) * config.speed;
      this.color = config.particleColor;
    }

    update() {
      // Mettre à jour l'opacité
      if (this.increasingOpacity) {
        this.opacity += this.opacitySpeed;
        if (this.opacity >= 0.8) {
          this.increasingOpacity = false;
        }
      } else {
        this.opacity -= this.opacitySpeed;
        if (this.opacity <= 0.2) {
          this.increasingOpacity = true;
        }
      }

      // Déplacer légèrement la particule
      this.y -= this.speed;
      
      // Réinitialiser la particule si elle sort du conteneur
      if (this.y < -this.size * 2) {
        this.x = Math.random() * width;
        this.y = height + this.size * 2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
    }
  }

  // Initialiser les particules
  function initParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / (10000 / config.particleDensity));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Fonction d'animation
  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    
    // Dessiner toutes les particules
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    animationFrame = requestAnimationFrame(animate);
  }

  // Initialisation
  function init() {
    resizeCanvas();
    initParticles();
    animate();
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // Démarrer l'effet
  init();

  // Retourner une fonction pour nettoyer l'effet si nécessaire
  return {
    destroy: () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      container.removeChild(canvas);
      window.removeEventListener('resize', resizeCanvas);
    }
  };
} 