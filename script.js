// Variable pour stocker la position normalisée de la souris (entre -1 et 1)
let mouseX = 0;
let mouseY = 0;

// Événement pour capturer la position de la souris
document.addEventListener('mousemove', (event) => {
    // Calculer la position X normalisée (-1 à 1)
    // event.clientX est la position actuelle en pixels
    // window.innerWidth est la largeur totale de la fenêtre
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;

    // Calculer la position Y normalisée (-1 à 1), inversée car l'axe Y du navigateur est inversé par rapport à Three.js
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {
    // --- Code pour le bouton simple (inchangé) ---
    const monBouton = document.getElementById('monBouton');
    const messageP = document.getElementById('message');
    let compteurClics = 0;

    if (monBouton) {
        monBouton.addEventListener('click', function () {
            compteurClics++;
            messageP.textContent = `Vous avez cliqué ${compteurClics} fois sur le bouton !`;
            console.log('Bouton cliqué !');
        });
    } else {
        console.error("Le bouton avec l'ID 'monBouton' n'a pas été trouvé.");
    }

    // --- Code pour Three.js ---
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('three-container');
        if (!container) {
            console.error("Le conteneur #three-container n'a pas été trouvé.");
            return;
        }

        let scene, camera, renderer, cube;

        function init() {
            // 1. Scène
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            // 2. Caméra
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 2;

            // 3. Rendu (Renderer)
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // 4. Objet (Cube) - Nous allons utiliser un matériau plus riche pour réagir à la lumière
            const geometry = new THREE.BoxGeometry(1, 1, 1);

            // On utilise MeshStandardMaterial pour réagir à la lumière
            const material = new THREE.MeshStandardMaterial({
                color: 0x007bff,
                metalness: 0.5,
                roughness: 0.5
            });
            cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            // 5. Lumière (Nécessaire pour le MeshStandardMaterial)
            const light = new THREE.AmbientLight(0xffffff, 0.8); // Lumière ambiante douce
            scene.add(light);

            const pointLight = new THREE.PointLight(0xffffff, 1); // Lumière ponctuelle pour les reflets
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);

            // Gérer le redimensionnement de la fenêtre
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        // 6. Animation (Mise à jour pour utiliser la souris)
        function animate() {
            requestAnimationFrame(animate);

            // Utiliser la position de la souris pour définir la rotation
            // On multiplie par Math.PI pour avoir un mouvement ample mais contrôlable.
            // La rotation est lissée par l'ajout de 0.05* au début.
            cube.rotation.x += (-mouseY * 2 - cube.rotation.x) * 0.1;
            cube.rotation.y += (mouseX * 2 - cube.rotation.y) * 0.05;

            renderer.render(scene, camera);
        }

        // Initialiser et animer la scène 3D
        init();
        animate();

    } else {
        console.error("Three.js n'est pas défini. Vérifiez le lien CDN dans index.html.");
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.innerHTML = "<p style='text-align:center; color: red;'>Impossible de charger la 3D. Vérifiez votre connexion ou le lien Three.js.</p>";
        }
    }
});