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
        const container = document.getElementById('header-3d-bg');
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
            camera = new THREE.PerspectiveCamera(10, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 12;
            camera.position.y = 0;
            camera.position.x = -9;

            // 3. Rendu (Renderer)
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // 4. Objet (Cube) - Nous allons utiliser un matériau plus riche pour réagir à la lumière
            createDeepLearningNetwork()

            // 5. Lumière (Nécessaire pour le MeshStandardMaterial)
            const light = new THREE.AmbientLight(0xffffff, 0.8); // Lumière ambiante douce
            scene.add(light);

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

            scene.rotation.x += (-mouseY/4 - scene.rotation.x) * 0.05;
            scene.rotation.y += (mouseX/4 - scene.rotation.y) * 0.01;

            scene.rotation.z += 0.0005;
            scene.position.x += (mouseX/4 - scene.position.x) * 0.01 + 0.001;
            scene.position.y += (-mouseY/4 - scene.position.y) * 0.01 + 0.001;
            


            // Remplacer les manipulations cube/sphere par :
            neurons.forEach(n => {
                const intensity = 0.5 + 0.2 * Math.sin(Date.now() * 0.002 + n.mesh.position.z);
                n.mesh.material.color.setHSL(0.55+0.01*mouseX, 0.5, intensity);
                n.mesh.scale.setScalar(0.8 + intensity * 0.2);
            });


            renderer.render(scene, camera);
        }

        function rgbToHex(r, g, b) {
            r = Math.floor(r * 255);
            g = Math.floor(g * 255);
            b = Math.floor(b * 255);
            return (r << 16) | (g << 8) | b;
        }

        let neurons = [];
        let connections = [];
        const layers = [4, 6, 5, 3]; // exemple : 4 entrées, 6 cachés 1, 5 cachés 2, 3 sorties
        const spacingZ = 4;   // distance entre les couches
        const spacingY = 1.5; // distance verticale entre neurones dans une couche
        const spreadX = 5;  // léger écart horizontal pour éviter un rendu complètement plat

        function createDeepLearningNetwork() {
            const neuronMaterial = new THREE.MeshStandardMaterial({
                color: 0x007bff,
                metalness: 0,
                roughness: 1
            });

            // Création des neurones par couche
            layers.forEach((count, layerIndex) => {
                const z = layerIndex * spacingZ - ((layers.length - 1) * spacingZ) / 2;
                for (let i = 0; i < count; i++) {
                    const y = (i - (count - 1) / 2) * spacingY;
                    const x = (Math.random() - 0.5) * spreadX; // léger décalage X aléatoire
                    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
                    const mesh = new THREE.Mesh(geometry, neuronMaterial.clone());
                    mesh.position.set(x, y, z);
                    neurons.push({ mesh, layer: layerIndex, index: i });
                    scene.add(mesh);
                }
            });

            // Connexions entre neurones des couches adjacentes
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3a8aad, transparent: true, opacity: 0.6 });
            neurons.forEach(n1 => {
                neurons.forEach(n2 => {
                    if (n2.layer === n1.layer + 1) {
                        const points = [n1.mesh.position.clone(), n2.mesh.position.clone()];
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, lineMaterial);
                        connections.push(line);
                        scene.add(line);
                    }
                });
            });
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