"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const open_1 = __importDefault(require("open"));
const symfony_1 = require("./typescript/symfony");
const wordpress_1 = require("./typescript/wordpress");
const installScssTs_1 = require("./typescript/installScssTs");
const command_1 = require("./typescript/command");
const lancementServeur_1 = require("./typescript/lancementServeur");
const variables_1 = require("./typescript/variables");
// Initialisation de l'application Express et du serveur HTTP
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
/**
 * Middleware pour servir des fichiers statiques (comme index.html).
 * Ce middleware sert le dossier 'public' qui contient les fichiers front-end.
 */
app.use(express_1.default.static('public'));
/**
 * Route pour exécuter une action donnée.
 * @param {string} action - L'action à exécuter (par exemple, 'C', 'R', 'I', etc.).
 * @returns {Promise<void>} - Une promesse qui se résout lorsque la commande est exécutée.
 */
app.get('/run-action/:action', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, symfony_1.installSymfony)(); // Exemple pour une installation complète
            (0, installScssTs_1.installScssTs)(); // Mise à jour de app.js
            break;
        case 'P':
            command = 'Installation de WordPress';
            yield (0, wordpress_1.installWordpress)(); // Exemple pour une installation complète
            break;
        case 'S':
            command = 'Installation de TS et SCSS';
            (0, installScssTs_1.installScssTs)(); // Exemple pour une installation complète
            break;
        case 'D':
            command = 'docker-compose down'; // Exemple pour réinitialiser la DB
            break;
        case 'B':
            command = 'docker-compose build'; // Exemple pour rebuild
            break;
        case 'L':
            command = 'serveur Symfony'; // Exemple pour lancer le serveur Symfony
            yield (0, lancementServeur_1.lancementServeur)("front");
            break;
        case 'W':
            command = 'serveur WordPress'; // Exemple pour lancer le serveur WordPress
            yield (0, lancementServeur_1.lancementServeur)("back", 9900);
            break;
        case 'Q':
            command = 'Quitter l\'application.';
            break;
        default:
            command = 'Action inconnue.';
    }
    // Exécution de la commande système
    (0, command_1.executeCommand)(command, (output) => {
        res.send(`<pre>${output}</pre>`);
    });
}));
/**
 * Démarre le serveur Express et ouvre automatiquement l'URL dans le navigateur.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque le serveur est démarré.
 */
server.listen(variables_1.port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running at http://localhost:${variables_1.port}`);
    // Ouvrir le navigateur sur l'URL de localhost dès que le serveur démarre
    try {
        (0, open_1.default)(`http://localhost:${variables_1.port}`);
    }
    catch (err) {
        console.error('Failed to open the browser:', err);
    }
}));
