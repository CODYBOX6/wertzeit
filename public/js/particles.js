document.addEventListener('DOMContentLoaded', function() {
    // Configuration pour particlesJS
    particlesJS("tsparticles", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#ffffff", "#3ddc97", "#5ef0c1", "#a2fff3"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.9,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1.5,
                    "opacity_min": 0.3,
                    "sync": false
                }
            },
            "size": {
                "value": 2.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 3,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 1.2,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "repulse": {
                    "distance": 100,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 10
                }
            }
        },
        "retina_detect": true
    });

    // Rendre les particules visibles après chargement
    setTimeout(function() {
        const container = document.getElementById('tsparticles');
        if (container) {
            container.style.opacity = '1';
            container.style.zIndex = '10';
        }
    }, 300);
}); 