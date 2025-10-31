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

});