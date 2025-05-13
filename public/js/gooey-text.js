/**
 * Effet de texte "Gooey" - Version JavaScript vanilla
 * Adapté de l'exemple React en version pure JS pour sites statiques
 */

function createGooeyTextEffect(containerId, textsArray, options = {}) {
  // Options par défaut
  const config = {
    morphTime: options.morphTime || 1,
    cooldownTime: options.cooldownTime || 0.25,
    textClass: options.textClass || '',
    fontSize: options.fontSize || '60px'
  };

  // Récupérer le conteneur
  const container = document.getElementById(containerId);
  if (!container) return;

  // Styles du conteneur
  container.style.position = 'relative';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.overflow = 'visible';
  container.style.padding = '0';
  container.style.width = 'auto';
  container.style.margin = '0 auto';
  container.style.height = '60px';

  // Créer les éléments texte
  const text1 = document.createElement('span');
  const text2 = document.createElement('span');

  // Styles communs
  [text1, text2].forEach(el => {
    el.style.display = 'inline-block';
    el.style.position = 'absolute';
    el.style.fontSize = config.fontSize;
    el.style.fontWeight = 'bold';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.width = 'auto';
    el.style.height = 'auto';
    el.style.whiteSpace = 'nowrap';
    el.style.background = 'transparent';
    el.style.textShadow = '0 0 0 transparent';
    el.style.transform = 'translateX(-50%)';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.textAlign = 'center';
    
    // Appliquer les classes CSS si spécifiées
    if (config.textClass) {
      config.textClass.split(' ').forEach(cls => {
        if (cls.trim() !== '') el.classList.add(cls.trim());
      });
    }
  });

  // Positionner le premier texte avec opacité 0
  text1.style.opacity = '0%';
  text1.style.filter = '';
  
  // Positionner le deuxième texte avec opacité 100%
  text2.style.opacity = '100%';
  text2.style.filter = '';
  
  // Définir le contenu initial
  text1.textContent = textsArray[0];
  text2.textContent = textsArray[1 % textsArray.length];
  
  // Ajouter les éléments au conteneur
  container.appendChild(text1);
  container.appendChild(text2);

  // Variables d'animation
  let textIndex = 0;
  let time = new Date();
  let morph = 0;
  let cooldown = config.cooldownTime;

  // Fonctions d'animation
  function setMorph(fraction) {
    // Effet de flou et d'opacité pour text2
    text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    // Effet inverse pour text1
    fraction = 1 - fraction;
    text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  }

  function doCooldown() {
    morph = 0;
    text2.style.filter = '';
    text2.style.opacity = '100%';
    text1.style.filter = '';
    text1.style.opacity = '0%';
  }

  function doMorph() {
    morph -= cooldown;
    cooldown = 0;
    let fraction = morph / config.morphTime;

    if (fraction > 1) {
      cooldown = config.cooldownTime;
      fraction = 1;
    }

    setMorph(fraction);
  }

  // Fonction pour mettre à jour les dimensions et positions si nécessaire
  function updateDimensions() {
    // Assurer que les éléments texte ont bien leur taille naturelle
    text1.style.width = 'auto';
    text2.style.width = 'auto';
  }

  // Fonction d'animation principale
  function animate() {
    requestAnimationFrame(animate);
    
    const newTime = new Date();
    const shouldIncrementIndex = cooldown > 0;
    const dt = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex = (textIndex + 1) % textsArray.length;
        text1.textContent = textsArray[textIndex % textsArray.length];
        text2.textContent = textsArray[(textIndex + 1) % textsArray.length];
        updateDimensions(); // Mettre à jour les dimensions après changement de texte
      }
      doMorph();
    } else {
      doCooldown();
    }
  }

  // Lancer l'animation
  updateDimensions();
  animate();

  // Renvoyer une fonction pour arrêter l'animation si nécessaire
  return {
    stop: () => {
      // Pour l'instant, il n'y a pas de mécanisme direct pour arrêter requestAnimationFrame
      // Pour une implémentation complète, il faudrait stocker l'ID retourné et utiliser cancelAnimationFrame
    },
    update: (newTexts) => {
      textsArray = newTexts;
    }
  };
} 