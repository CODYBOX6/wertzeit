/**
 * Effet de curseur fluide - Version JavaScript vanilla (optimisée)
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
  
  // Initialisation du Canvas WebGL
  const canvas = document.getElementById('fluid-cursor');
  
  // Vérifier si WebGL est disponible (avec options réduites)
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

  // Redimensionner le canvas pour la performance
  function resizeCanvas() {
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Variables de suivi de la souris
  let pointerX = 0;
  let pointerY = 0;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let pointerColor = { r: 0.5, g: 0.8, b: 1.0 };
  let isPointerDown = false;

  // Générer une couleur aléatoire
  function randomColor() {
    return {
      r: Math.random() * 0.5 + 0.2,
      g: Math.random() * 0.5 + 0.3,
      b: Math.random() * 0.5 + 0.5
    };
  }

  // Créer les shaders
  function createShaderProgram() {
    const vsSource = 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }';
    const fsSource = 'precision mediump float; uniform vec3 color; void main() { gl_FragColor = vec4(color, 0.35); }';

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    return program;
  }

  const program = createShaderProgram();
  gl.useProgram(program);

  // Préparer un cercle en triangle fan (segments réduits)
  const segments = 20;
  const vertices = new Float32Array((segments + 2) * 2);
  vertices[0] = 0; // centre
  vertices[1] = 0;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices[(i + 1) * 2] = Math.cos(angle) * 0.5;
    vertices[(i + 1) * 2 + 1] = Math.sin(angle) * 0.5;
  }

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const posAttrib = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttrib);
  gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

  const colorUniform = gl.getUniformLocation(program, 'color');

  // Fonction de rendu
  function render() {
    if (!isPointerDown && Math.abs(pointerX - prevPointerX) < 1 && Math.abs(pointerY - prevPointerY) < 1) {
      requestAnimationFrame(render);
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform3f(colorUniform, pointerColor.r, pointerColor.g, pointerColor.b);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, segments + 2);

    prevPointerX = pointerX;
    prevPointerY = pointerY;
    if (Math.random() > 0.985) {
      pointerColor = randomColor();
    }

    requestAnimationFrame(render);
  }

  // Événements souris / tactile
  const updatePointer = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = (x - rect.left) / rect.width * 2 - 1;
    pointerY = -((y - rect.top) / rect.height * 2 - 1);
  };

  window.addEventListener('mousemove', e => updatePointer(e.clientX, e.clientY));
  window.addEventListener('mousedown', () => { isPointerDown = true; pointerColor = randomColor(); });
  window.addEventListener('mouseup', () => { isPointerDown = false; });

  window.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    updatePointer(t.clientX, t.clientY);
  }, { passive: false });
  window.addEventListener('touchstart', () => { isPointerDown = true; pointerColor = randomColor(); });
  window.addEventListener('touchend', () => { isPointerDown = false; });

  // Démarrer l'animation
  render();
}); 