"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFolder = cleanFolder;
exports.renameFolder = renameFolder;
exports.copyFolderContent = copyFolderContent;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Vide un dossier tout en conservant certains fichiers/dossiers.
 * @param folderPath - Chemin du dossier à nettoyer.
 * @param keepList - Liste des fichiers/dossiers à conserver.
 */
function cleanFolder(folderPath, keepList) {
    if (!fs_1.default.existsSync(folderPath)) {
        console.warn(`⚠️ Le dossier "${folderPath}" n'existe pas.`);
        return;
    }
    fs_1.default.readdirSync(folderPath).forEach(item => {
        const itemPath = path_1.default.join(folderPath, item);
        const isDirectory = fs_1.default.statSync(itemPath).isDirectory();
        if (!keepList.includes(item)) {
            if (isDirectory) {
                fs_1.default.rmSync(itemPath, { recursive: true, force: true });
            }
            else {
                fs_1.default.unlinkSync(itemPath);
            }
            console.log(`🗑️ Supprimé : ${itemPath}`);
        }
    });
}
/**
 * Renomme un dossier.
 * @param oldPath - Chemin actuel du dossier.
 * @param newPath - Nouveau chemin du dossier.
 */
function renameFolder(oldPath, newPath) {
    if (fs_1.default.existsSync(newPath)) {
        fs_1.default.rmSync(newPath, { recursive: true, force: true });
        console.log(`🔄 Dossier existant supprimé : ${newPath}`);
    }
    fs_1.default.renameSync(oldPath, newPath);
    console.log(`📁 Dossier renommé de "${oldPath}" à "${newPath}"`);
}
/**
 * Copie le contenu d'un dossier vers un autre.
 * @param src - Chemin source du dossier.
 * @param dest - Chemin de destination du dossier.
 */
function copyFolderContent(src, dest) {
    if (!fs_1.default.existsSync(dest)) {
        fs_1.default.mkdirSync(dest, { recursive: true });
    }
    fs_1.default.readdirSync(src).forEach(item => {
        const srcPath = path_1.default.join(src, item);
        const destPath = path_1.default.join(dest, item);
        if (fs_1.default.statSync(srcPath).isDirectory()) {
            copyFolderContent(srcPath, destPath);
        }
        else {
            fs_1.default.copyFileSync(srcPath, destPath);
        }
        console.log(`📦 Copié : ${srcPath} → ${destPath}`);
    });
}
