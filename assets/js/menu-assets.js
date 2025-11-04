// menu-assets.js
// Affiche le menu latéral en injectant le contenu HTML depuis un fichier externe

document.addEventListener('DOMContentLoaded', () => {

    const menuToggleBtn = document.getElementById('menu-toggle');

    // lors du clic du bouton de menu, affiche le menu latéral
    if (menuToggleBtn) {
        const menuHtmlPath = '/pages/side-menu.html';

        fetch(menuHtmlPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de chargement du menu latéral.');
                }
                return response.text();
            })
            .then(html => {
                // Insère le contenu du menu dans le corps du document
                document.body.insertAdjacentHTML('beforeend', html);

                // Récupère les éléments du menu latéral

                const sideMenu = document.getElementById('side-menu');
                const overlay = document.getElementById('overlay');
                const menuCloseBtn = document.getElementById('menu-close-btn');

                if (sideMenu) {

                    function openMenu() {
                        sideMenu.classList.add('is-open');
                        overlay.classList.add('is-active');
                    }

                    function closeMenu() {
                        sideMenu.classList.remove('is-open');
                        overlay.classList.remove('is-active');
                    }

                    // Événements d'ouverture/fermeture
                    menuToggleBtn.addEventListener('click', openMenu);
                    menuCloseBtn.addEventListener('click', closeMenu);
                    overlay.addEventListener('click', closeMenu);

                    // Fermeture du menu après clic sur un lien interne et touche Échap
                    document.querySelectorAll('#menu-links a').forEach(link => {
                        link.addEventListener('click', closeMenu);
                    });
                    document.addEventListener('keydown', (event) => {
                        if (event.key === 'Escape' && sideMenu.classList.contains('is-open')) {
                            closeMenu();
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Erreur lors de l\'injection du menu latéral:', error);
            });
    } else {
        console.warn('Bouton #menu-toggle non trouvé. La logique du menu n\'a pas pu être initialisée.');
    }
});