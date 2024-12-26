import express, { Request, Response } from 'express';
import http from 'http';
import open from 'open';
import { installSymfony } from './typescript/symfony';
import { installWordpress } from './typescript/wordpress';
import { installScssTs } from './typescript/installScssTs';
import { executeCommand } from './typescript/command';
import { lancementServeur } from './typescript/lancementServeur';
import { port } from './typescript/variables';


// Initialisation de l'application Express et du serveur HTTP
const app = express();
const server = http.createServer(app);


/**
 * Middleware pour servir des fichiers statiques (comme index.html).
 * Ce middleware sert le dossier 'public' qui contient les fichiers front-end.
 */
app.use(express.static('public'));

/**
 * Route pour exécuter une action donnée.
 * @param {string} action - L'action à exécuter (par exemple, 'C', 'R', 'I', etc.).
 * @returns {Promise<void>} - Une promesse qui se résout lorsque la commande est exécutée.
 */
app.get('/run-action/:action', async (req: Request, res: Response): Promise<void> => {
    const action = req.params.action;

    let command = '';
    switch (action) {
        case 'C':
            command = 'docker build .'; // Exemple pour créer un build Docker
            break;
        case 'R':
            command = 'docker-compose up'; // Exemple pour recréer les containers Docker
            break;
        case 'I':
            command = 'Installation de Symfony';
            await installSymfony(); // Exemple pour une installation complète
            installScssTs(); // Mise à jour de app.js
            break;
        case 'P':
            command = 'Installation de WordPress';
            await installWordpress(); // Exemple pour une installation complète
            break;
        case 'S':
            command = 'Installation de TS et SCSS';
            installScssTs(); // Exemple pour une installation complète
            break;
        case 'D':
            command = 'docker-compose down'; // Exemple pour réinitialiser la DB
            break;
        case 'B':
            command = 'docker-compose build'; // Exemple pour rebuild
            break;
        case 'L':
            command = 'serveur Symfony'; // Exemple pour lancer le serveur Symfony
            await lancementServeur("front");
            break;
        case 'W':
            command = 'serveur WordPress'; // Exemple pour lancer le serveur WordPress
            await lancementServeur("back", 9900);
            break;
        case 'Q':
            command = 'Quitter l\'application.';
            break;
        default:
            command = 'Action inconnue.';
    }

    // Exécution de la commande système
    executeCommand(command, (output) => {
        res.send(`<pre>${output}</pre>`);
    });
});

/**
 * Démarre le serveur Express et ouvre automatiquement l'URL dans le navigateur.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque le serveur est démarré.
 */
server.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // Ouvrir le navigateur sur l'URL de localhost dès que le serveur démarre
    try {
        open(`http://localhost:${port}`);
    } catch (err) {
        console.error('Failed to open the browser:', err);
    }
});
