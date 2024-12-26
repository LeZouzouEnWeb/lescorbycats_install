import path from "path";

// Variables globales

/**
 * Le port sur lequel le serveur doit écouter.
 * @constant
 * @type {number}
 */
export const port: number = 3000;

/**
 * Chemin relatif vers la racine du serveur. Si la variable d'environnement 'folder_rel_serveur' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
export const folderRelBase: string = process.env.folder_rel_serveur || path.join(__dirname, '..', '..', '..');
/**
 * Nom du dossier du serveur frontend.
 * @constant
 * @type {string}
 */
export const folderServeur: string = "serveur-frontend";

/**
 * Chemin relatif vers le dossier du serveur frontend. Si la variable d'environnement 'folder_rel_serveur' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
export const folderRelServeur: string = process.env.folder_rel_serveur || path.join(folderRelBase, folderServeur);
console.log("ADRESSE DU SERVEUR : " + folderRelServeur);
/**
 * Dossier de sauvegarde pour le serveur frontend.
 * @constant
 * @type {string}
 */
export const backupFolder: string = folderRelServeur + '_backup';

/**
 * Nom du dossier du serveur backend.
 * @constant
 * @type {string}
 */
export const folderServeurBack: string = "serveur-backend";

/**
 * Chemin relatif vers le dossier du serveur backend. Si la variable d'environnement 'folder_rel_serveur' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
export const folderRelServeurBack: string = process.env.folder_rel_serveur || path.join(folderRelBase, folderServeurBack);

/**
 * Dossier de sauvegarde pour le serveur backend.
 * @constant
 * @type {string}
 */
export const backupFolderBack: string = folderRelServeurBack + '_backup';



/**
 * Chemin relatif vers le dossier de la base de données. Si la variable d'environnement 'folder_rel_data' est définie, elle est utilisée, sinon un chemin par défaut est généré.
 * @constant
 * @type {string}
 */
export const folderRelData: string = process.env.folder_rel_data || path.join(folderRelBase, 'database');

/**
 * Version de Node.js à utiliser.
 * @constant
 * @type {string}
 */
export const versionNodeJS: string = '22';

/**
 * Version de Symfony à utiliser.
 * @constant
 * @type {string}
 */
export const versionSymfony: string = '7.1.*';

/**
 * Chemin vers le dossier contenant le layout d'installation.
 * @constant
 * @type {string}
 */
// export const layout: string = path.join(__dirname, 'install');
