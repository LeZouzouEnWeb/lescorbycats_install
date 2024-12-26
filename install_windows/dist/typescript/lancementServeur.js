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
exports.lancementServeur = lancementServeur;
const command_1 = require("./command");
const variables_1 = require("./variables");
const open_1 = __importDefault(require("open"));
/**
 * Lance le serveur en fonction de la plateforme spécifiée.
 *
 * @param {string} serveur - Le type de serveur à lancer : "front" pour le serveur frontend ou autre pour le backend.
 * @param {number} [port=8000] - Le port sur lequel le serveur sera lancé (par défaut 8000).
 *
 * @returns {Promise<void>} Une promesse qui se résout lorsque la commande est exécutée et que la page est ouverte dans le navigateur.
 */
function lancementServeur(serveur_1) {
    return __awaiter(this, arguments, void 0, function* (serveur, port = 8000) {
        if (serveur === "front") {
            // Changer le répertoire de travail vers le dossier du serveur frontend
            process.chdir(variables_1.folderRelServeur);
            // Ouvrir un nouveau terminal pour démarrer le serveur Symfony
            (0, command_1.openTerminal)(`symfony server:start --port=${port}`);
        }
        else {
            // Changer le répertoire de travail vers le dossier du serveur backend
            process.chdir(variables_1.folderRelServeurBack);
            // Ouvrir un nouveau terminal pour démarrer un serveur PHP
            (0, command_1.openTerminal)(`php -S localhost:${port} -t web`);
            // runCommand('php -S localhost:8088 -t public');
        }
        // Importer le module open et ouvrir l'URL dans le navigateur
        yield (0, open_1.default)(`http://localhost:${port}`);
    });
}
