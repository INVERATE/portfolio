document.addEventListener('DOMContentLoaded', function () {

    // --- Code pour le bouton simple (inchangé) ---
    const monBouton = document.getElementById('monBouton');
    const messageP = document.getElementById('message');
    let compteurClics = 0;
    let message = "";

    if (monBouton) {
        monBouton.addEventListener('click', function () {
            compteurClics++;
            message += "Youpi ! ";

            messageP.textContent = message;

            if (compteurClics >= 5) {
                messageP.textContent = "Vous avez l'air content !";
            }

            if (compteurClics >= 15) {
                message = "";
                compteurClics = 0;
            }

        });
    } else {
    console.error("Le bouton avec l'ID 'monBouton' n'a pas été trouvé.");
    }

});