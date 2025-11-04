// Ouverture d'une modale de projet

document.addEventListener('DOMContentLoaded', function () {

    // Éléments de la Modale
    const modal = document.getElementById('project-modal');
    const modalContentContainer = document.getElementById('modal-project-content');
    const modalCloseBtn = document.getElementById('modal-close');
    const projectLinks = document.querySelectorAll('.cards-grid a.button-link');

    // Fonctions de Contrôle de la Modale

    function openModal() {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Bloquer le scroll principal de la page
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }


    // --- Fonction de Contrôle du Hash ---
    function checkUrlHash() {
        // Récupère l'ancre URL (ex: "#audit")
        const projectId = window.location.hash.substring(1);

        if (projectId) {
            // Chemin absolu vers le fichier HTML du projet (en utilisant l'ID comme nom de fichier)
            const projectUrl = `/pages/projects/${projectId}.html`;

            loadProjectContent(projectUrl); // Ouvre et charge le contenu
        } else {
            // Si l'ancre est vide ou inconnue, fermer le modal
            closeModal();
        }
    }


    // --- Mise à jour de la fonction loadProjectContent ---
    function loadProjectContent(url) {
        modalContentContainer.innerHTML = '<h2 >Chargement en cours...</h2>';
        openModal();

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    // Si le fichier n'existe pas, on revient à la page projets
                    throw new Error(`Erreur 404: Fichier ${url} non trouvé.`);
                }
                return response.text();
            })
            .then(html => {
                modalContentContainer.innerHTML = html;
            })
            .catch(error => {
                modalContentContainer.innerHTML = `<h2>Erreur de chargement</h2><p>Impossible de charger le contenu du projet.</p>`;
                // Réinitialiser le hash pour fermer la modale si erreur critique
                history.replaceState(null, null, ' ');
                console.error(error);
            });
    }


    // --- Événements (Dans le DOMContentLoaded) ---

    // 1. Intercepter le clic des liens (ils changent juste le hash)
    projectLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            // Laisse le comportement par défaut du lien s'exécuter, qui est de changer window.location.hash
        });
    });


    // 2. Écouter le changement d'ancre URL (Déclenche le chargement/fermeture)
    window.addEventListener('hashchange', checkUrlHash);

    // 3. Vérifier l'URL au chargement initial (pour les liens directs ou les recharges)
    document.addEventListener('DOMContentLoaded', checkUrlHash);


    // 4. Mettre à jour la fermeture du bouton pour vider le hash
    modalCloseBtn.addEventListener('click', function () {
        closeModal();
        history.replaceState(null, null, ' '); // Vider le hash -> Déclenche 'hashchange' -> Ferme la modale
    });
});