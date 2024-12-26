"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installScssTs = installScssTs;
const fs_1 = __importDefault(require("fs"));
const command_1 = require("./command");
const variables_1 = require("./variables");
/**
 * Installe SCSS et TypeScript en ajustant les fichiers et configurations nécessaires.
 */
function installScssTs() {
    process.chdir(variables_1.folderRelServeur);
    // Chemins des fichiers
    const appJsPath = 'assets/app.js';
    const appTsPath = 'assets/app.ts';
    const appCssPath = 'assets/styles/app.css';
    const appScssPath = 'assets/styles/app.scss';
    // === 🛠️ Mise à jour de app.js ===
    if (fs_1.default.existsSync(appJsPath)) {
        const appJsContent = fs_1.default.readFileSync(appJsPath, 'utf8');
        const updatedContent = appJsContent.replace(/import\s+['"]\.\/styles\/app\.css['"];/, `import './styles/app.scss';`);
        fs_1.default.writeFileSync(appJsPath, updatedContent, 'utf8');
        console.log(`✅ Le fichier ${appJsPath} a été mis à jour : 'app.css' remplacé par 'app.scss'.`);
    }
    else {
        console.warn(`⚠️ Le fichier ${appJsPath} n'existe pas. Aucune modification appliquée.`);
    }
    console.log('🚀 Mise à jour terminée avec succès !');
    // === 🛠️ Renommer le fichier app.js en app.ts ===
    if (fs_1.default.existsSync(appJsPath)) {
        fs_1.default.renameSync(appJsPath, appTsPath);
        console.log(`✅ Le fichier a été renommé : ${appJsPath} → ${appTsPath}`);
    }
    else {
        console.warn(`⚠️ Le fichier ${appJsPath} n'existe pas. Aucune action effectuée.`);
    }
    // === 🛠️ Renommer le fichier app.css en app.scss ===
    if (fs_1.default.existsSync(appCssPath)) {
        fs_1.default.renameSync(appCssPath, appScssPath);
        console.log(`✅ Le fichier a été renommé : ${appCssPath} → ${appScssPath}`);
    }
    else {
        console.warn(`⚠️ Le fichier ${appCssPath} n'existe pas. Aucune action effectuée.`);
    }
    // === 🛠️ Mettre à jour les références dans les autres fichiers ===
    function updateReferencesInFile(filePath, searchValue, replaceValue) {
        if (fs_1.default.existsSync(filePath)) {
            const content = fs_1.default.readFileSync(filePath, 'utf8');
            const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
            fs_1.default.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ Référence mise à jour dans ${filePath}`);
        }
    }
    const filesToUpdate = ['importmap.php'];
    filesToUpdate.forEach(file => {
        updateReferencesInFile(file, 'app.js', 'app.ts');
    });
    console.log('🚀 Renommage et mise à jour des références terminés avec succès !');
    (0, command_1.runCommand)(`php bin/console sass:build --watch`);
    (0, command_1.runCommand)(`php bin/console typescript:build --watch`);
    (0, command_1.runCommand)(`php bin/console asset-map:compile`);
}
