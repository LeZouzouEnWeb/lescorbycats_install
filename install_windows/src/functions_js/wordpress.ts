import path from "path";
import { runCommandWithLogs } from "./command";
import { cleanFolder, copyFolderContent, renameFolder } from "./folders";
import { backupFolderBack, folderRelBase, folderRelServeurBack, folderServeurBack } from "./variables";
import { Server } from 'socket.io';
import express, { Express } from 'express';
import fs from 'fs';
import http from 'http';

const app: Express = express();
const server: http.Server = http.createServer(app);
const io = new Server(server);
/**
 * Installe WordPress en utilisant Bedrock.
 */

export async function installWordpress(): Promise<void> {
    console.log('Installation de WordPress');

    if (fs.existsSync(folderRelServeurBack)) {
        try {
            // 1. Vider le dossier en conservant certains fichiers/dossiers
            cleanFolder(folderRelServeurBack, ['.git', '.vscode', '.github']);

            // 2. Renommer le dossier
            renameFolder(folderRelServeurBack, backupFolderBack);

            console.log('✅ Opérations terminées avec succès.');
        } catch (err) {
            console.error('❌ Une erreur est survenue :', err);
        }
    }

    if (!fs.existsSync(folderRelServeurBack)) {
        fs.mkdirSync(folderRelServeurBack, { recursive: true });
    }

    process.chdir(folderRelBase);

    // 3. Créer un projet WordPress avec Composer
    await runCommandWithLogs(`composer create-project`, [`roots/bedrock`, ` ${folderServeurBack}`], io);

    // 4. Copier le contenu du dossier de sauvegarde
    if (fs.existsSync(backupFolderBack)) {
        copyFolderContent(backupFolderBack, folderRelServeurBack);
        fs.rmdirSync(path.join(backupFolderBack), { recursive: true });
    }

    process.chdir(folderRelServeurBack);
}
