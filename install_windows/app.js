const express = require('express');
const { execSync, spawnSync, exec } = require('child_process'); // Utilisé pour exécuter des commandes système

const yaml = require('yaml');
const path = require('path');
const fs = require('fs');

const app = express();
// const open = require('open');  // Importer la bibliothèque open
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;




// Variables globales
const folderServeur = "serveur-frontend";
const folderRelServeur = process.env.folder_rel_serveur || path.join(__dirname, '..', folderServeur);
const folderRelBase = process.env.folder_rel_serveur || path.join(__dirname, '..');
// const folderRelServeur = process.env.folder_rel_serveur || path.resolve(__dirname, '../folderServeur');

const folderRelData = process.env.folder_rel_data || path.join(__dirname, '..', 'database');
const versionNodeJS = '22';
const versionSymfony = '7.1.*';
const layout = path.join(__dirname, 'install');


// Middleware pour servir le fichier HTML
app.use(express.static('public')); // Le dossier 'public' contiendra votre index.html

io.on('connection', (socket) => {
    console.log('A client connected');

    // Vous pouvez émettre des messages à la page HTML
    socket.emit('log', 'Hello from server!');

    // Exemple de log envoyé toutes les 5 secondes
    setInterval(() => {
        socket.emit('log', `Server Log: ${new Date()}`);
    }, 5000);
});

function runCommand(command, options = {}) {
    try {
        console.log(`Exécution : ${command}`);
        execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
        console.error(`Erreur lors de l'exécution : ${error.message}`);
        process.exit(1);
    }
}

function executeCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            callback(`Erreur: ${stderr}`);
        } else {
            callback(stdout);
        }
    });
}

// Route pour exécuter une action
app.get('/run-action/:action', async (req, res) => {
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
            await installSymfony(); // Exemple pour une installation complète
            break;
        case 'S':
            command = 'Installation de TS et SCSS';
            installScssTs(); // Exemple pour une installation complète
            break;
        case 'D':
            command = 'docker-compose down'; // Exemple pour réinitialiser la DB
            break;
        case 'B':
            command = 'docker-compose build'; // Exemple pour rebuild
            break;
        case 'L':
            command = 'docker-compose up -d'; // Exemple pour lancer les serveurs
            await serveur();
            break;
        case 'Q':
            return res.send('Quitter l\'application.');
        default:
            return res.send('Action inconnue.');
    }

    // Exécution de la commande système
    executeCommand(command, (output) => {
        res.send(`<pre>${output}</pre>`);
    });
});

async function installSymfony() {
    console.log('Installation de Symfony');
    if (fs.existsSync(folderRelServeur)) {
        fs.rmdirSync(path.join(folderRelServeur), { recursive: true });
    }
    if (!fs.existsSync(folderRelServeur)) {
        fs.mkdirSync(folderRelServeur, { recursive: true });
    }
    process.chdir(folderRelBase);


    runCommand(`composer create-project symfony/skeleton:"${versionSymfony}" ${folderServeur}`);

    process.chdir(folderRelServeur);

    runCommand('composer require phpstan/phpdoc-parser:^1.32 --with-all-dependencies');
    runCommand('composer require symfony/property-info --with-all-dependencies');
    runCommand('composer require webapp');


    runCommand('composer require symfonycasts/sass-bundle');
    runCommand('composer require sensiolabs/typescript-bundle');
    // runCommand('');
    // runCommand('');


    // Chemin vers le fichier .symfony.local.yaml
    let filePath = '.symfony.local.yaml';

    // Initialiser une configuration par défaut si le fichier n'existe pas
    let config = {};

    if (fs.existsSync(filePath)) {
        // Lire le contenu existant du fichier YAML
        const fileContent = fs.readFileSync(filePath, 'utf8');
        config = yaml.parse(fileContent) || {};
    } else {
        console.log(`Le fichier ${filePath} n'existe pas, un nouveau sera créé.`);
    }

    // S'assurer que la clé workers existe
    config.workers = config.workers || {};

    // Ajouter ou mettre à jour la configuration typescript
    config.workers.typescript = {
        cmd: ['symfony', 'console', 'typescript:build', '--watch']
    };

    // Ajouter ou mettre à jour la configuration sass
    config.workers.sass = {
        cmd: ['symfony', 'console', 'sass:build', '--watch']
    };

    // Écrire ou créer le fichier YAML avec la configuration mise à jour
    fs.writeFileSync(filePath, yaml.stringify(config), 'utf8');

    console.log(`✅ Le fichier ${filePath} a été créé/mis à jour avec les sections "workers.typescript" et "workers.sass".`);





    // Chemin vers le fichier asset_mapper.yaml
    filePath = 'config/packages/asset_mapper.yaml';

    // Initialiser une configuration par défaut si le fichier n'existe pas
    config = {};

    if (fs.existsSync(filePath)) {
        // Lire le contenu existant du fichier YAML
        const fileContent = fs.readFileSync(filePath, 'utf8');
        config = yaml.parse(fileContent) || {};
    } else {
        console.log(`Le fichier ${filePath} n'existe pas, un nouveau sera créé.`);
    }

    // S'assurer que la section framework existe
    config.framework = config.framework || {};

    // S'assurer que la section asset_mapper existe
    config.framework.asset_mapper = config.framework.asset_mapper || {};

    // Ajouter ou mettre à jour la section paths
    if (!config.framework.asset_mapper.paths) {
        config.framework.asset_mapper.paths = ['assets/'];
    } else if (!config.framework.asset_mapper.paths.includes('assets/')) {
        config.framework.asset_mapper.paths.push('assets/');
    }

    // Ajouter ou mettre à jour la section excluded_patterns
    config.framework.asset_mapper.excluded_patterns = [
        '*/assets/styles/_*.scss',
        '*/assets/styles/**/_*.scss'
    ];

    // Écrire ou créer le fichier YAML avec la configuration mise à jour
    fs.writeFileSync(filePath, yaml.stringify(config), 'utf8');

    console.log(`✅ Le fichier ${filePath} a été créé/mis à jour avec les configurations "paths" et "excluded_patterns".`);


    // === 🛠️ Mise à jour de app.js ===
    installScssTs();

}

async function serveur(port = 8000) {
    process.chdir(folderRelServeur);
    const open = await import('open');
    open.default(`http://localhost:${port}`);

    // runCommand('php -S localhost:8088 -t public');
    runCommand(`symfony server:start --port=${port}`);
}


function installScssTs() {
    process.chdir(folderRelServeur);
    // Chemins des fichiers
    const appJsPath = 'assets/app.js';
    const appTsPath = 'assets/app.ts';
    const appCssPath = 'assets/styles/app.css';
    const appScssPath = 'assets/styles/app.scss';

    // === 🛠️ Mise à jour de app.js ===

    if (fs.existsSync(appJsPath)) {
        let appJsContent = fs.readFileSync(appJsPath, 'utf8');

        // Remplacer l'import CSS par SCSS
        const updatedContent = appJsContent.replace(
            /import\s+['"]\.\/styles\/app\.css['"];/,
            `import './styles/app.scss';`
        );

        // Écrire les modifications dans le fichier
        fs.writeFileSync(appJsPath, updatedContent, 'utf8');
        console.log(`✅ Le fichier ${appJsPath} a été mis à jour : 'app.css' remplacé par 'app.scss'.`);
    } else {
        console.warn(`⚠️ Le fichier ${appJsPath} n'existe pas. Aucune modification appliquée.`);
    }

    console.log('🚀 Mise à jour terminée avec succès !');



    // === 🛠️ Renommer le fichier app.js en app.ts ===

    if (fs.existsSync(appJsPath)) {
        fs.renameSync(appJsPath, appTsPath);
        console.log(`✅ Le fichier a été renommé : ${appJsPath} → ${appTsPath}`);
    } else {
        console.warn(`⚠️ Le fichier ${appJsPath} n'existe pas. Aucune action effectuée.`);
    }

    // === 🛠️ Renommer le fichier app.css en app.scss ===

    if (fs.existsSync(appCssPath)) {
        fs.renameSync(appCssPath, appScssPath);
        console.log(`✅ Le fichier a été renommé : ${appCssPath} → ${appScssPath}`);
    } else {
        console.warn(`⚠️ Le fichier ${appCssPath} n'existe pas. Aucune action effectuée.`);
    }

    // === 🛠️ Mettre à jour les références dans les autres fichiers ===

    // Fonction pour rechercher et remplacer les références dans les fichiers
    function updateReferencesInFile(filePath, searchValue, replaceValue) {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ Référence mise à jour dans ${filePath}`);
        }
    }

    // Exemple de mise à jour dans des fichiers potentiels
    const filesToUpdate = [
        'importmap.php'
    ];

    filesToUpdate.forEach(file => {
        updateReferencesInFile(file, 'app.js', 'app.ts');
    });

    console.log('🚀 Renommage et mise à jour des références terminés avec succès !');




    runCommand(`php bin/console sass:build --watch`);
    runCommand(`php bin/console typescript:build --watch`);
    runCommand(`php bin/console asset-map:compile`);


}




// Démarrage du serveur
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    // Ouvrir le navigateur sur l'URL de localhost dès que le serveur démarre
    try {
        const open = await import('open');
        open.default(`http://localhost:${port}`);
    } catch (err) {
        console.error('Failed to open the browser:', err);
    }
});