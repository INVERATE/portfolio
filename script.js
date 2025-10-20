// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {
    const monBouton = document.getElementById('monBouton');
    const messageP = document.getElementById('message');
    let compteurClics = 0;

    // Ajouter un écouteur d'événement au bouton
    if (monBouton) {
        monBouton.addEventListener('click', function () {
            compteurClics++;
            messageP.textContent = `Vous avez cliqué ${compteurClics} fois sur le bouton !`;
            console.log('Bouton cliqué !'); // Affiché dans la console du navigateur
        });
    } else {
        console.error("Le bouton avec l'ID 'monBouton' n'a pas été trouvé.");
    }
});