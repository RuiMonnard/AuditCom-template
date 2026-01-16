
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('downloadForm');
    const msg = document.getElementById('messageContainer');
    const submit = form && form.querySelector('button[type="submit"]');

    if (!form || !msg) return;

    // chemin du fichier à télécharger — adapte si besoin
    const downloadUrl = '/files/rapport.pdf';

    const showMessage = (text, type = 'info') => {
        msg.textContent = text;
        msg.className = ''; // reset classes
        msg.classList.add('message', `message--${type}`);
        msg.setAttribute('role', 'status');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // validation HTML5
        if (!form.checkValidity()) {
            form.reportValidity();
            showMessage('Merci de remplir correctement le formulaire.', 'error');
            return;
        }

        if (submit) {
            submit.disabled = true;
            submit.setAttribute('aria-busy', 'true');
        }
        showMessage('Préparation du téléchargement…', 'info');

        try {
            // optionnel : vérifier la disponibilité du fichier
            const head = await fetch(downloadUrl, { method: 'HEAD' });
            if (!head.ok) throw new Error('Fichier non disponible');

            // lancer le téléchargement côté client
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.setAttribute('download', 'rapport.pdf');
            document.body.appendChild(a);
            a.click();
            a.remove();

            showMessage('Merci — le téléchargement va démarrer.', 'success');
            form.reset();
        } catch (err) {
            console.error(err);
            showMessage("Une erreur est survenue lors du téléchargement. Réessayez plus tard.", 'error');
        } finally {
            if (submit) {
                submit.disabled = false;
                submit.removeAttribute('aria-busy');
            }
            // effacer le message automatiquement après quelques secondes
            setTimeout(() => {
                msg.textContent = '';
                msg.className = '';
            }, 6000);
        }
    });
});


