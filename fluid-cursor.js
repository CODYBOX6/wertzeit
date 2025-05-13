/**
 * Effet de curseur fluide - Version JavaScript vanilla
 * Adapté du composant React SplashCursor
 */

document.addEventListener('DOMContentLoaded', function() {
  // Créer un canvas qui couvre toute la page
  const canvasEl = document.createElement('canvas');
  canvasEl.id = 'fluid-cursor';
  canvasEl.style.position = 'fixed';
  canvasEl.style.top = '0';
  canvasEl.style.left = '0';
  canvasEl.style.width = '100vw';
  canvasEl.style.height = '100vh';
  canvasEl.style.pointerEvents = 'none';
  canvasEl.style.zIndex = '99';
  
  // Ajouter le canvas au début du body
  document.body.prepend(canvasEl);
  
  // Configuration
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    TRANSPARENT: true
  };
  
  // Initialisation du Canvas WebGL
  const canvas = document.getElementById('fluid-cursor');
  
  // Vérifier si WebGL est disponible
  const gl = canvas.getContext('webgl2', { 
    alpha: true,
    premultipliedAlpha: false,
    antialias: false
  }) || canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false
  });
  
  if (!gl) {
    console.warn('WebGL non supporté - Effet de curseur désactivé');
    return;
  }

  // On utilise des dimensions plus petites pour éviter d'affecter les performances
  function resizeCanvas() {
    const { width, height } = canvas.getBoundingClientRect();
    
    // Utiliser un ratio plus bas pour de meilleures performances
    const dpr = Math.min(window.devicePixelRatio, 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Version simplifiée - Implémentation du suivi de la souris
  let pointerX = 0;
  let pointerY = 0;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let pointerColor = {r: 0.5, g: 0.8, b: 1.0};
  let isPointerDown = false;

  // Fonctions pour générer des couleurs aléatoires pour les éclaboussures
  function generateRandomColor() {
    return {
      r: Math.random() * 0.5 + 0.2,
      g: Math.random() * 0.5 + 0.3,
      b: Math.random() * 0.5 + 0.5
    };
  }

  // Créer un shader de base pour le rendu des effets de fluide
  function createShader() {
    // Créer un programme WebGL simple pour le rendu d'effets de fluide
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    // Shader source simple pour la démonstration
    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    const fragmentSource = `
      precision mediump float;
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 0.3);
      }
    `;
    
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    return program;
  }

  // Créer un simple shader program
  const shaderProgram = createShader();
  gl.useProgram(shaderProgram);
  
  // Points de base pour un cercle (représentant une goutte de fluide)
  const segments = 20; // Réduit pour éviter les problèmes de buffer
  const circleVertices = new Float32Array((segments + 2) * 2);
  
  // Point central du cercle
  circleVertices[0] = 0;
  circleVertices[1] = 0;
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * 0.5; // Rayon réduit à 0.5
    const y = Math.sin(theta) * 0.5;
    circleVertices[(i + 1) * 2] = x;
    circleVertices[(i + 1) * 2 + 1] = y;
  }
  
  // Créer le buffer pour le cercle
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, circleVertices, gl.STATIC_DRAW);
  
  // Obtenir les attributs et uniformes
  const positionAttrib = gl.getAttribLocation(shaderProgram, 'position');
  const colorUniform = gl.getUniformLocation(shaderProgram, 'color');
  
  // Configuration des attributs
  gl.enableVertexAttribArray(positionAttrib);
  gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

  // Fonction pour dessiner le fluide à la position du curseur
  function renderSplash() {
    if (!isPointerDown && Math.abs(pointerX - prevPointerX) < 1 && Math.abs(pointerY - prevPointerY) < 1) {
      // Ne rien faire si le mouvement est trop petit
      return;
    }
    
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Définir la couleur
    gl.uniform3f(colorUniform, pointerColor.r, pointerColor.g, pointerColor.b);
    
    // S'assurer que le bon buffer est lié avant de dessiner
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    // Réactiver et configurer l'attribut de position
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // Dessiner le cercle (triangle fan)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, segments + 2);
    
    // Désactiver l'attribut après le dessin pour la propreté (souvent facultatif mais bonne pratique)
    gl.disableVertexAttribArray(positionAttrib);

    // Mettre à jour les positions précédentes
    prevPointerX = pointerX;
    prevPointerY = pointerY;
    
    // Générer une nouvelle couleur périodiquement
    if (Math.random() > 0.98) {
      pointerColor = generateRandomColor();
    }
  }

  // Gestionnaires d'événements pour suivre la souris
  canvas.parentElement.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    // Convertir en coordonnées normalisées (-1 à 1)
    pointerX = (e.clientX - rect.left) / rect.width * 2 - 1;
    pointerY = -((e.clientY - rect.top) / rect.height * 2 - 1); // Y inversé en WebGL
  });
  
  canvas.parentElement.addEventListener('mousedown', function() {
    isPointerDown = true;
    pointerColor = generateRandomColor();
  });
  
  canvas.parentElement.addEventListener('mouseup', function() {
    isPointerDown = false;
  });
  
  // Également les événements tactiles pour les mobiles
  canvas.parentElement.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    pointerX = (touch.clientX - rect.left) / rect.width * 2 - 1;
    pointerY = -((touch.clientY - rect.top) / rect.height * 2 - 1);
  }, { passive: false });
  
  canvas.parentElement.addEventListener('touchstart', function(e) {
    isPointerDown = true;
    pointerColor = generateRandomColor();
  });
  
  canvas.parentElement.addEventListener('touchend', function() {
    isPointerDown = false;
  });

  // Boucle d'animation
  function animate() {
    renderSplash();
    requestAnimationFrame(animate);
  }

  // Démarrer l'animation
  animate();
}); 