// Variable pour stocker la position normalisée (entre -1 et 1)
let mouseX = 0;
let mouseY = 0;

// Facteur de sensibilité du gyroscope (ajustez cette valeur)
const GYRO_SENSITIVITY = 0.5;

// --- 1. Gestion du Gyroscope (Orientation de l'Appareil) ---
function setupDeviceOrientation() {

    // Vérifie d'abord si l'événement 'DeviceOrientationEvent' est supporté
    if (!window.DeviceOrientationEvent) {
        console.warn("DeviceOrientationEvent non supporté sur cet appareil.");
        return;
    }

    // Demander la permission d'accès (Obligatoire sur iOS 13+ pour la sécurité)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Crée un bouton (ou utilise un événement) pour déclencher la permission sur iOS
        // NOTE: Cette action doit être initiée par un clic utilisateur !
        window.addEventListener('click', function requestPermissionHandler() {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        // Permission accordée, on peut ajouter l'écouteur
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        console.error('Accès au gyroscope refusé par l\'utilisateur.');
                    }
                })
                .catch(console.error);

            // Retirer l'écouteur après le premier clic
            window.removeEventListener('click', requestPermissionHandler);
        }, { once: true });

        // Vous devez informer l'utilisateur de cliquer pour activer le mouvement 3D.
        console.log("Cliquez n'importe où sur l'écran pour activer le gyroscope.");

    } else {
        // Pour les navigateurs Android/Desktop non-iOS (permission implicite)
        window.addEventListener('deviceorientation', handleOrientation);
    }
}

function handleOrientation(event) {
    // Les valeurs alpha (z), beta (x) et gamma (y) sont en degrés 

    // event.gamma : Mouvement gauche/droite (axe Y du navigateur)
    // event.beta : Mouvement avant/arrière (axe X du navigateur)

    // Normalisation de gamma (x) et beta (y)
    // On utilise gamma pour l'axe X (gauche/droite) et beta pour l'axe Y (haut/bas).

    // Normalisation X (de -1 à 1) : gamma varie de -90 à 90 degrés
    // Note: On centre autour de 0, on divise par 90 pour avoir +/- 1, puis on applique la sensibilité.
    const normX = (event.gamma / 90) * GYRO_SENSITIVITY;
    mouseX = Math.min(1, Math.max(-1, normX)); // Clampe la valeur entre -1 et 1

    // Normalisation Y (de -1 à 1) : beta varie de -180 à 180 (on utilise un range plus petit)
    // Note: On prend la moitié du range (90) pour éviter les valeurs extrêmes et on inverse pour Three.js.
    const normY = -(event.beta / 90) * GYRO_SENSITIVITY;
    mouseY = Math.min(1, Math.max(-1, normY)); // Clampe la valeur entre -1 et 1
}


// --- 2. Gestion de la Souris (Desktop) ---
document.addEventListener('mousemove', (event) => {
    // Si nous sommes sur un écran tactile, cette logique est ignorée après l'activation du gyroscope.
    if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission) {
        // Optionnel : Vous pouvez vérifier la présence du gyroscope ici pour désactiver la souris.
    }

    // Calcul de la position X normalisée (-1 à 1)
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;

    // Calcul de la position Y normalisée (-1 à 1), inversée pour Three.js
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

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
            camera = new THREE.PerspectiveCamera(1, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 150;
            camera.position.y = 0;
            camera.position.x = 150;
            camera.lookAt(0, 0, 0);

            // 3. Rendu (Renderer)
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // 4. Objet (Cube) - Nous allons utiliser un matériau plus riche pour réagir à la lumière
            createDeepLearningNetwork()

            // 5. Lumière (Nécessaire pour le MeshStandardMaterial)
            const light = new THREE.AmbientLight(0xffffff, 1); // Lumière ambiante douce
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

            scene.rotation.x += (-mouseY/4 - scene.rotation.x) * 0.01;
            scene.rotation.y += (mouseX/4 - scene.rotation.y) * 0.01;

            scene.rotation.z += Math.sin(Date.now() * 0.0002) * 0.001;
            scene.position.x += (mouseX/4 - scene.position.x) * 0.05;
            scene.position.y += (-mouseY/4 - scene.position.y) * 0.05;
            


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
        const layers = [4, 5, 6, 4, 4]; // exemple : 4 entrées, 6 cachés 1, 5 cachés 2, 3 sorties
        const spacingZ = 3;   // distance entre les couches
        const spacingY = 1; // distance verticale entre neurones dans une couche
        const spreadX = 1;  // léger écart horizontal pour éviter un rendu complètement plat

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