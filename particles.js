document.addEventListener('DOMContentLoaded', function() {
    // Configuration pour particlesJS
    particlesJS("tsparticles", {
        "particles": {
            "number": {
                "value": 15,
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
                "value": 0.8,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1.2,
                    "opacity_min": 0.3,
                    "sync": false
                }
            },
            "size": {
                "value": 2,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 0.8,
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
                    "distance": 80,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 5
                }
            }
        },
        "retina_detect": false
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