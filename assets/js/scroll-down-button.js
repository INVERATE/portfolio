document.addEventListener('DOMContentLoaded', function () {

    // --- Code pour le bouton simple (inchangé) ---
    const scrollDownButton = document.getElementById('scroll-down-button');

    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', function () {
            window.scrollTo({
                top: window.innerHeight*0.1,
                behavior: 'smooth'
            });
            console.log('Bouton cliqué !');
        });
    } else {
        console.error("Le bouton avec l'ID 'monBouton' n'a pas été trouvé.");
    }

});