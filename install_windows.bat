@echo off
cls

cd install_windows

@REM  Initialiser un projet npm si le fichier package.json n'existe pas déjà
if not exist package.json (

    echo Initialisation du projet npm...
    npm init -y

    @REM  Installer Express si ce n'est pas déjà installé
    if not exist node_modules\express (
        echo Installation d'Express...
        npm install express

        @REM  Installer socket_io si ce n'est pas déjà installé
        if not exist node_modules\socket.io (
            echo Installation de socket.io...
            npm install socket.io

            if not exist node_modules\open (
                echo Installation d'Open...
                npm install open
                if not exist node_modules\yaml (
                    echo Installation de Yaml...
                    npm install yaml fs

                    @REM  Lancer le script Node.js
                    echo Démarrage de l'application Node.js...
                    node app.js
                )
            )
        )
    )
)

@REM  Installer Express si ce n'est pas déjà installé
if not exist node_modules\express (
    echo Installation d'Express...
    npm install express

    @REM  Installer socket_io si ce n'est pas déjà installé
    if not exist node_modules\socket.io (
        echo Installation de socket.io...
        npm install socket.io

        if not exist node_modules\open (
            echo Installation d'Open...
            npm install open
            if not exist node_modules\yaml (
                echo Installation de Yaml...
                npm install yaml fs

                @REM  Lancer le script Node.js
                echo Démarrage de l'application Node.js...
                node app.js
            )
        )
    )
)



@REM  Installer socket_io si ce n'est pas déjà installé
if not exist node_modules\socket.io (
    echo Installation de socket.io...
    npm install socket.io

    if not exist node_modules\open (
        echo Installation d'Open...
        npm install open

        if not exist node_modules\yaml (
            echo Installation de Yaml...
            npm install yaml fs

            @REM  Lancer le script Node.js
            echo Démarrage de l'application Node.js...
            node app.js
        )
    )
)

if not exist node_modules\open (
    echo Installation d'Open...
    npm install open
    if not exist node_modules\yaml (
        echo Installation de Yaml...
        npm install yaml fs

        @REM  Lancer le script Node.js
        echo Démarrage de l'application Node.js...
        node app.js
    )

)

if not exist node_modules\yaml (
    echo Installation de Yaml...
    npm install yaml fs

    @REM  Lancer le script Node.js
    echo Démarrage de l'application Node.js...
    node app.js
)

@REM cd install_windows

@REM  Lancer le script Node.js
echo Démarrage de l'application Node.js...
node app.js