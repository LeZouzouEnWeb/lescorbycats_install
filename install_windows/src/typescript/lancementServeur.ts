import { openTerminal } from './command';
import { folderRelServeur, folderRelServeurBack } from './variables';
import open from 'open';


/**
 * Lance le serveur en fonction de la plateforme spécifiée.
 *
 * @param {string} serveur - Le type de serveur à lancer : "front" pour le serveur frontend ou autre pour le backend.
 * @param {number} [port=8000] - Le port sur lequel le serveur sera lancé (par défaut 8000).
 *
 * @returns {Promise<void>} Une promesse qui se résout lorsque la commande est exécutée et que la page est ouverte dans le navigateur.
 */
export async function lancementServeur(serveur: string, port: number = 8000): Promise<void> {
    if (serveur === "front") {
        // Changer le répertoire de travail vers le dossier du serveur frontend
        process.chdir(folderRelServeur);
        // Ouvrir un nouveau terminal pour démarrer le serveur Symfony
        openTerminal(`symfony server:start --port=${port}`);
    } else {
        // Changer le répertoire de travail vers le dossier du serveur backend
        process.chdir(folderRelServeurBack);
        // Ouvrir un nouveau terminal pour démarrer un serveur PHP
        openTerminal(`php -S localhost:${port} -t web`);
        // runCommand('php -S localhost:8088 -t public');
    }

    // Importer le module open et ouvrir l'URL dans le navigateur
    await open(`http://localhost:${port}`);
}
