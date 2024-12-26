"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionSymfony = exports.versionNodeJS = exports.folderRelData = exports.backupFolderBack = exports.folderRelServeurBack = exports.folderServeurBack = exports.backupFolder = exports.folderRelServeur = exports.folderServeur = exports.folderRelBase = exports.port = void 0;
const path_1 = __importDefault(require("path"));
// Variables globales
/**
 * Le port sur lequel le serveur doit écouter.
 * @constant
 * @type {number}
 */
exports.port = 3000;
/**
 * Chemin relatif vers la racine du serveur. Si la variable d'environnement 'folder_rel_serveur' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
exports.folderRelBase = process.env.folder_rel_serveur || path_1.default.join(__dirname, '..', '..', '..');
/**
 * Nom du dossier du serveur frontend.
 * @constant
 * @type {string}
 */
exports.folderServeur = "serveur-frontend";
/**
 * Chemin relatif vers le dossier du serveur frontend. Si la variable d'environnement 'folder_rel_serveur' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
exports.folderRelServeur = process.env.folder_rel_serveur || path_1.default.join(exports.folderRelBase, exports.folderServeur);
console.log("ADRESSE DU SERVEUR : " + exports.folderRelServeur);
/**
 * Dossier de sauvegarde pour le serveur frontend.
 * @constant
 * @type {string}
 */
exports.backupFolder = exports.folderRelServeur + '_backup';
/**
 * Nom du dossier du serveur backend.
 * @constant
 * @type {string}
 */
exports.folderServeurBack = "serveur-backend";
/**
 * Chemin relatif vers le dossier du serveur backend. Si la variable d'environnement 'folder_rel_serveur' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
exports.folderRelServeurBack = process.env.folder_rel_serveur || path_1.default.join(exports.folderRelBase, exports.folderServeurBack);
/**
 * Dossier de sauvegarde pour le serveur backend.
 * @constant
 * @type {string}
 */
exports.backupFolderBack = exports.folderRelServeurBack + '_backup';
/**
 * Chemin relatif vers le dossier de la base de données. Si la variable d'environnement 'folder_rel_data' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
exports.folderRelData = process.env.folder_rel_data || path_1.default.join(exports.folderRelBase, 'database');
/**
 * Version de Node.js à utiliser.
 * @constant
 * @type {string}
 */
exports.versionNodeJS = '22';
/**
 * Version de Symfony à utiliser.
 * @constant
 * @type {string}
 */
exports.versionSymfony = '7.1.*';
/**
 * Chemin vers le dossier contenant le layout d'installation.
 * @constant
 * @type {string}
 */
// export const layout: string = path.join(__dirname, 'install');
