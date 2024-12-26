@echo off
cls

cd install_windows
set i=2

if %i% NEQ 1 (
    npm run start
) else (

    @REM Initialiser un projet npm si le fichier package.json n'existe pas déjà
    if 1 == 1 (
        echo Initialisation du projet npm...
        npm init -y

        @REM Installer Express si ce n'est pas déjà installé
        if 1 == 1 (
            echo Installation en cours...
            npm i express socket.io yaml fs

            if 1 == 1 (
                echo Installation des dépendances dev...
                npm i --save-dev typescript nodemon concurrently @types/node @types/yaml

                @REM Lancer le script Node.js
                echo Démarrage de l'application Node.js...
                @REM npm run dev
            )
        )
    )
    pause
)