import path from "path";
import { runCommandWithLogs } from "./command";
import { cleanFolder, copyFolderContent, renameFolder } from "./folders";
import { backupFolder, folderRelBase, folderRelServeurFront, folderServeurFront, versionSymfony } from "./variables";
import { Server } from 'socket.io';
import express, { Express } from 'express';
import yaml from 'yaml';
import fs from 'fs';
import http from 'http';

// Initialisation des serveurs
const app: Express = express();
const server: http.Server = http.createServer(app);
const io = new Server(server);


interface WorkerConfig {
    cmd: string[];
}

interface SymfonyConfig {
    workers?: {
        typescript?: WorkerConfig;
        sass?: WorkerConfig;
    };
    framework?: {
        asset_mapper?: {
            paths?: string[];
            excluded_patterns?: string[];
        };
    };
}

// Fonction d'installation Symfony
export async function installSymfony(): Promise<void> {
    console.log('Installation de Symfony');

    // Étape 1 : Nettoyage et sauvegarde
    if (fs.existsSync(folderRelServeurFront)) {
        try {
            cleanFolder(folderRelServeurFront, ['.git', '.vscode', '.github']);
            renameFolder(folderRelServeurFront, backupFolder);
            console.log('✅ Opérations terminées avec succès.');
        } catch (err) {
            console.error('❌ Une erreur est survenue :', err);
        }
    }

    if (!fs.existsSync(folderRelServeurFront)) {
        fs.mkdirSync(folderRelServeurFront, { recursive: true });
    }

    process.chdir(folderRelBase);

    await runCommandWithLogs(`composer`, [`create-project`, ` symfony/skeleton:"${versionSymfony}" ${folderServeurFront}`], io);

    if (fs.existsSync(backupFolder)) {
        copyFolderContent(backupFolder, folderRelServeurFront);
        fs.rmdirSync(path.join(backupFolder), { recursive: true });
    }

    process.chdir(folderRelServeurFront);
    await runCommandWithLogs('composer require', ['phpstan/phpdoc-parser:^1.32', ' --with-all-dependencies'], io);
    await runCommandWithLogs('composer require', ['symfony/property-info', ' --with-all-dependencies'], io);
    await runCommandWithLogs('composer require', ['webapp'], io);
    await runCommandWithLogs('composer require', ['symfonycasts/sass-bundle'], io);
    await runCommandWithLogs('composer require', ['sensiolabs/typescript-bundle'], io);

    // Gestion de .symfony.local.yaml
    let filePath: string = '.symfony.local.yaml';
    let config: SymfonyConfig = {};

    if (fs.existsSync(filePath)) {
        const fileContent: string = fs.readFileSync(filePath, 'utf8');
        config = yaml.parse(fileContent) || {};
    } else {
        console.log(`Le fichier ${filePath} n'existe pas, un nouveau sera créé.`);
    }

    config.workers = config.workers || {};
    config.workers.typescript = { cmd: ['symfony', 'console', 'typescript:build', '--watch'] };
    config.workers.sass = { cmd: ['symfony', 'console', 'sass:build', '--watch'] };

    fs.writeFileSync(filePath, yaml.stringify(config), 'utf8');
    console.log(`✅ Le fichier ${filePath} a été créé/mis à jour avec les sections "workers.typescript" et "workers.sass".`);

    // Gestion de config/packages/asset_mapper.yaml
    filePath = 'config/packages/asset_mapper.yaml';
    config = {};

    if (fs.existsSync(filePath)) {
        const fileContent: string = fs.readFileSync(filePath, 'utf8');
        config = yaml.parse(fileContent) || {};
    } else {
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

    fs.writeFileSync(filePath, yaml.stringify(config), 'utf8');
    console.log(`✅ Le fichier ${filePath} a été créé/mis à jour avec les configurations "paths" et "excluded_patterns".`);
}
