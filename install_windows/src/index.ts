import express, { Request, Response } from 'express';
import http from 'http';
import { installSymfony } from './functions_js/symfony';
import open from 'open';
import { installWordpress } from './functions_js/wordpress';
import { installScssTs } from './functions_js/installScssTs';
import { lancementServeur } from './functions_js/lancementServeur';
import { folderRelBase, port, portBackend, portFrontend } from './functions_js/variables';
import { createEnvBase } from './functions_js/file_env';
import { Server } from 'socket.io';
import { createDockerCompose } from './functions_js/docker-compose';
import { SoftwareManager } from './functions_js/ouverture_fichier';
import { runCommandWithLogs } from './functions_js/command';

// Initialisation de l'application Express et du serveur HTTP
const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server);

// Rediriger console.log vers Socket.IO et la console
const originalConsoleLog = console.log;

console.log = (...args) => {

    const timestamp = new Date().toLocaleTimeString(); // Obtient l'heure au format HH:mm:ss
    const logMessage = `[${timestamp}] ${args.join(' ')}`; // Ajoute l'heure au début du message

    originalConsoleLog(logMessage); // Affiche toujours dans la console du serveur
    io.emit('consoleMessage', logMessage); // Envoie au client via Socket.IO
};

// Écouter les connexions socket
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');
    socket.on('disconnect', () => {
        console.log('Un utilisateur est déconnecté');
    });
});

/**
 * Route pour exécuter une action donnée.
 * @param {string} action - L'action à exécuter (par exemple, 'C', 'R', 'I', etc.).
 * @returns {Promise<void>} - Une promesse qui se résout lorsque la commande est exécutée.
 */
app.get('/run-action/:action', async (req: Request, res: Response): Promise<void> => {
    const action = req.params.action;

    let command = 'Lancement de : ';
    try {
        switch (action) {
            case 'IS':
                console.log('Installation complète de Symfony');
                await installSymfony();
                await installScssTs();
                break;
            case 'TS':
                console.log('Installation SCSS et TS pour Symfony');
                await installScssTs();
                break;
            case 'SE':
                console.log('Créer le .env de Symfony');
                createEnvBase('symfony');
                break;


            case 'WP':
                console.log('Installation complète de WordPress');
                await installWordpress();
                break;
            case 'WE':
                console.log('Créer le .env de WordPress');
                createEnvBase('wordpress');
                break;

            case 'DKEN':
                console.log('Créer le .env de Docker');
                createEnvBase('data');
                break;
            case 'DKCP':
                console.log('Installation de docker-compose');
                // createEnvBase('data');
                createDockerCompose();

                // Exemple d'utilisation avec Docker Desktop
                const dockerManager = new SoftwareManager({
                    name: 'Docker Desktop',
                    executableName: 'Docker Desktop.exe',
                    executablePath: 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe',
                    downloadUrl: 'https://www.docker.com/products/docker-desktop/',
                    readyCommand: 'docker info'
                });

                await dockerManager.run().catch((err: any) => console.error(err));
                process.chdir(folderRelBase);
                await runCommandWithLogs('docker-compose', ['up', '-d'], io);
                break;


            case 'LS':
                console.log('Lancement du  serveur Symfony');
                await lancementServeur("front", portFrontend);
                break;
            case 'LW':
                console.log('Lancement du  serveur WordPress');
                await lancementServeur("back", portBackend);
                break;


            case 'Q':
                console.log('Quitter l\'application.');
                shutdown();
                break;
            default:
                command = 'Action inconnue.';
        }
        res.send(`<pre>${command}</pre>`); // Envoie la réponse au client
    } catch (error) {
        console.error('Erreur lors de l\'exécution de l\'action:', error);
        res.status(500).send('Une erreur est survenue.');
    }
});

// Démarre le serveur Express et ouvre automatiquement l'URL dans le navigateur.
server.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // Ouvrir le navigateur sur l'URL de localhost dès que le serveur démarre
    try {

        // const open = (await import('open')).default;
        open(`http://localhost:${port}`);
    } catch (err) {
        console.error('Failed to open the browser:', err);
    }
});

function shutdown() {

    console.log('Arrêt du serveur en cours...');
    // Arrêter le serveur après 10 secondes
    // setTimeout(() => {
    //     server.close(() => {
    //         console.log('Serveur arrêté');
    //     });
    // }, 10000);  // Arrêt après 10 secondes
    setTimeout(() => {
        console.log('');
        console.log('Serveur Stoppé !');
        process.exit();
    }, 1000);  // Arrêt après 10 secondes
}