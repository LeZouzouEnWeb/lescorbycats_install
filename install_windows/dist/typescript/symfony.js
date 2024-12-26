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
exports.installSymfony = installSymfony;
const path_1 = __importDefault(require("path"));
const command_1 = require("./command");
const folders_1 = require("./folders");
const variables_1 = require("./variables");
const express_1 = __importDefault(require("express"));
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
// Initialisation des serveurs
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Fonction d'installation Symfony
function installSymfony() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Installation de Symfony');
        // Étape 1 : Nettoyage et sauvegarde
        if (fs_1.default.existsSync(variables_1.folderRelServeur)) {
            try {
                (0, folders_1.cleanFolder)(variables_1.folderRelServeur, ['.git', '.vscode', '.github']);
                (0, folders_1.renameFolder)(variables_1.folderRelServeur, variables_1.backupFolder);
                console.log('✅ Opérations terminées avec succès.');
            }
            catch (err) {
                console.error('❌ Une erreur est survenue :', err);
            }
        }
        if (!fs_1.default.existsSync(variables_1.folderRelServeur)) {
            fs_1.default.mkdirSync(variables_1.folderRelServeur, { recursive: true });
        }
        process.chdir(variables_1.folderRelBase);
        (0, command_1.runCommand)(`composer create-project symfony/skeleton:"${variables_1.versionSymfony}" ${variables_1.folderServeur}`);
        if (fs_1.default.existsSync(variables_1.backupFolder)) {
            (0, folders_1.copyFolderContent)(variables_1.backupFolder, variables_1.folderRelServeur);
            fs_1.default.rmdirSync(path_1.default.join(variables_1.backupFolder), { recursive: true });
        }
        process.chdir(variables_1.folderRelServeur);
        (0, command_1.runCommand)('composer require phpstan/phpdoc-parser:^1.32 --with-all-dependencies');
        (0, command_1.runCommand)('composer require symfony/property-info --with-all-dependencies');
        (0, command_1.runCommand)('composer require webapp');
        (0, command_1.runCommand)('composer require symfonycasts/sass-bundle');
        (0, command_1.runCommand)('composer require sensiolabs/typescript-bundle');
        // Gestion de .symfony.local.yaml
        let filePath = '.symfony.local.yaml';
        let config = {};
        if (fs_1.default.existsSync(filePath)) {
            const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
            config = yaml_1.default.parse(fileContent) || {};
        }
        else {
            console.log(`Le fichier ${filePath} n'existe pas, un nouveau sera créé.`);
        }
        config.workers = config.workers || {};
        config.workers.typescript = { cmd: ['symfony', 'console', 'typescript:build', '--watch'] };
        config.workers.sass = { cmd: ['symfony', 'console', 'sass:build', '--watch'] };
        fs_1.default.writeFileSync(filePath, yaml_1.default.stringify(config), 'utf8');
        console.log(`✅ Le fichier ${filePath} a été créé/mis à jour avec les sections "workers.typescript" et "workers.sass".`);
        // Gestion de config/packages/asset_mapper.yaml
        filePath = 'config/packages/asset_mapper.yaml';
        config = {};
        if (fs_1.default.existsSync(filePath)) {
            const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
            config = yaml_1.default.parse(fileContent) || {};
        }
        else {
            console.log(`Le fichier ${filePath} n'existe pas, un nouveau sera créé.`);
        }
        config.framework = config.framework || {};
        config.framework.asset_mapper = config.framework.asset_mapper || {};
        config.framework.asset_mapper.paths = config.framework.asset_mapper.paths || ['assets/'];
        if (!config.framework.asset_mapper.paths.includes('assets/')) {
            config.framework.asset_mapper.paths.push('assets/');
        }
        config.framework.asset_mapper.excluded_patterns = [
            '*/assets/styles/_*.scss',
            '*/assets/styles/**/_*.scss'
        ];
        fs_1.default.writeFileSync(filePath, yaml_1.default.stringify(config), 'utf8');
        console.log(`✅ Le fichier ${filePath} a été créé/mis à jour avec les configurations "paths" et "excluded_patterns".`);
    });
}
