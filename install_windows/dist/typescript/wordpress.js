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
exports.installWordpress = installWordpress;
const path_1 = __importDefault(require("path"));
const command_1 = require("./command");
const folders_1 = require("./folders");
const variables_1 = require("./variables");
const fs_1 = __importDefault(require("fs"));
/**
 * Installe WordPress en utilisant Bedrock.
 */
function installWordpress() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Installation de WordPress');
        if (fs_1.default.existsSync(variables_1.folderRelServeurBack)) {
            try {
                // 1. Vider le dossier en conservant certains fichiers/dossiers
                (0, folders_1.cleanFolder)(variables_1.folderRelServeurBack, ['.git', '.vscode', '.github']);
                // 2. Renommer le dossier
                (0, folders_1.renameFolder)(variables_1.folderRelServeurBack, variables_1.backupFolderBack);
                console.log('✅ Opérations terminées avec succès.');
            }
            catch (err) {
                console.error('❌ Une erreur est survenue :', err);
            }
        }
        if (!fs_1.default.existsSync(variables_1.folderRelServeurBack)) {
            fs_1.default.mkdirSync(variables_1.folderRelServeurBack, { recursive: true });
        }
        process.chdir(variables_1.folderRelBase);
        // 3. Créer un projet WordPress avec Composer
        (0, command_1.openTerminal)(`composer create-project roots/bedrock ./${variables_1.folderServeurBack}`);
        // 4. Copier le contenu du dossier de sauvegarde
        if (fs_1.default.existsSync(variables_1.backupFolderBack)) {
            (0, folders_1.copyFolderContent)(variables_1.backupFolderBack, variables_1.folderRelServeurBack);
            fs_1.default.rmdirSync(path_1.default.join(variables_1.backupFolderBack), { recursive: true });
        }
        process.chdir(variables_1.folderRelServeurBack);
    });
}
