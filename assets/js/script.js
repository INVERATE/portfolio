// Variables pour stocker la position normalisée (entre -1 et 1)
let mouseX = 0;
let mouseY = 0;

// Variables pour le gyroscope du téléphone
let gyroX = 0;
let gyroY = 0;
let isGyroActive = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Événement pour capturer la position de la souris
document.addEventListener('mousemove', (event) => {
    if (!isMobile) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
});

// Fonction pour demander la permission et initialiser le gyroscope
async function requestGyroPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                initGyroscope();
                return true;
            }
        } catch (error) {
            console.error('Erreur permission gyroscope:', error);
        }
        return false;
    } else {
        // Android ou navigateurs qui ne nécessitent pas de permission
        initGyroscope();
        return true;
    }
}

// Initialiser les événements du gyroscope
function initGyroscope() {
    window.addEventListener('deviceorientation', handleOrientation, true);
    isGyroActive = true;
}

// Gérer les données du gyroscope
function handleOrientation(event) {
    if (event.beta !== null && event.gamma !== null) {
        // beta: inclinaison avant/arrière (-180 à 180)
        // gamma: inclinaison gauche/droite (-90 à 90)

        // Convertir en valeurs normalisées (-1 à 1)
        gyroY = event.beta / 90;  // Inclinaison avant/arrière
        gyroX = event.gamma / 90;  // Inclinaison gauche/droite

        // Inverser si l'appareil est en mode paysage
        if (window.orientation === 90 || window.orientation === -90) {
            [gyroX, gyroY] = [-gyroY, gyroX];
        }
    }
}

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // Bouton pour activer le gyroscope sur mobile (iOS)
    if (isMobile && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const activateBtn = document.createElement('button');
        activateBtn.textContent = 'Activer le gyroscope';
        activateBtn.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:1000;padding:10px 20px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;';
        document.body.appendChild(activateBtn);

        activateBtn.addEventListener('click', async () => {
            const granted = await requestGyroPermission();
            if (granted) {
                activateBtn.remove();
            }
        });
    } else if (isMobile) {
        // Android: activation automatique
        initGyroscope();
    }

    // --- Code pour Three.js---
    // Afficher le fond en 3D
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('header-3d-bg');
        if (!container) {
            console.error("Le conteneur #header-3d-bg n'a pas été trouvé.");
            return;
        }

        let scene, camera, renderer;

        function init() {
            // 1. Scène
            scene = new THREE.Scene();

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

            // 4. Créer le réseau de neurones
            createDeepLearningNetwork();

            // 5. Lumière
            const light = new THREE.AmbientLight(0xffffff, 1);
            scene.add(light);

            // Gérer le redimensionnement
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        // 6. Animation
        function animate() {
            requestAnimationFrame(animate);

            // Utiliser gyroscope si mobile et actif, sinon souris
            const inputX = (isMobile && isGyroActive) ? gyroX*5 : mouseX*2;
            const inputY = (isMobile && isGyroActive) ? gyroY*5 : mouseY * 2;
            

            scene.rotation.x += (-inputY / 4 - scene.rotation.x) * 0.01;
            scene.rotation.y += (inputX / 4 - scene.rotation.y) * 0.01;
            scene.rotation.z += Math.sin(Date.now()*0.0002) * 0.0006;
            scene.position.x += (inputX / 4 - scene.position.x) * 0.05;
            scene.position.y += (-inputY / 4 - scene.position.y) * 0.05;

            neurons.forEach(n => {
                const intensity = 0.5 + 0.2 * Math.sin(Date.now() * 0.002 + n.mesh.position.z);
                n.mesh.material.color.setHSL(0.55 + 0.01 * inputX, 0.5, intensity);
                n.mesh.scale.setScalar(0.8 + intensity * 0.2);
            });

            renderer.render(scene, camera);
        }

        let neurons = [];
        let connections = [];
        const layers = [4, 5, 6, 4, 4, 3];
        const spacingZ = 3;
        const spacingY = 1;
        const spreadX = 1;

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
                    const x = (Math.random() - 0.5) * spreadX;
                    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
                    const mesh = new THREE.Mesh(geometry, neuronMaterial.clone());
                    mesh.position.set(x, y, z);
                    neurons.push({ mesh, layer: layerIndex, index: i });
                    scene.add(mesh);
                }
            });

            // Connexions entre neurones
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
        console.error("Three.js n'est pas défini. Vérifiez le lien CDN.");
        const container = document.getElementById('header-3d-bg');
        if (container) {
            container.innerHTML = "<p style='text-align:center; color: red;'>Impossible de charger la 3D.</p>";
        }
    }
});