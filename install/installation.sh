#!/bin/bash

# echo $folder_rel_serveur
clear

sed -i "s/--show-private/--show-hidden/g" ~/.vscode/extensions/thenouillet.symfony-vscode-1.0.2/out/symfony/provider/ConsoleContainerProvider.js

cd $myfolder

if [ -d "$folder_rel_serveur" ]; then
    cd $folder_rel_serveur
    echo "remove-orphans"
    echo "--------------------------------"
    docker compose down --remove-orphans
    echo " ** Opération effectuée **"
    echo
    cd $myfolder
fi

# Définition du tableau
my_array=("$myfolder/symfony-docke" "$folder_rel_serveur" "$folder_rel_data" "TutoSymfony")

# Boucle pour lire le tableau
for element in "${my_array[@]}"; do
    if [ -d "$element" ]; then
        echo "suppression de '$element'"
        echo "--------------------------------"
        pause s 1
        sudo rm -rf $element
        echo " ** suppression effectuée **"
        echo
    fi
done

# mise à jour de node JS
# Mise à jour des dépôts et installation de Node.js
sudo apt update

# Installation de NVM (Node Version Manager)

echo -e "'\e[1m Mise à jour du NodeJS'\e[0m'"
echo "---------------------------------------------------"
pause s 5

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Charger NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

pause s 30
echo -e "'\e[1m Dossier NVM \e[0m'"
echo "---------------------------------------------------"
echo $NVM_DIR

pause s 30
echo -e "'\e[1m Liste des fichiers NVM \e[0m'"
echo "---------------------------------------------------"
ls -la $NVM_DIR

pause s 30
echo -e "'\e[1m Installation de node $version_nodejs\e[0m'"
echo "---------------------------------------------------"
nvm install $version_nodejs
nvm use node 22

pause s 30

echo -e "'\e[1m Ajout d'un module php 8.3 '$folder_serveur'\e[0m'"
echo "---------------------------------------------------"
pause s 5

sudo apt install php8.3 -y
pause s 5
sudo apt install php8.3-xml -y
echo
echo "** module php 8.3 est prêt **"
echo

echo -e "'\e[1m Installation de Symfony \e[0m'"
echo "---------------------------------------------------"
pause s 5

mkdir $folder_rel_serveur
cd $folder_rel_serveur

composer create-project symfony/skeleton:"$version_symfony" .

pause s 5
composer require webapp --quiet

pause s 5
composer require "symfony/var-exporter:7.0.4"

pause s 5
composer require symfony/webpack-encore-bundle

pause s 5
composer require symfony/stimulus-bundle

pause s 5
npm install sass-loader sass --save-dev

pause s 5
npm install typescript ts-loader --save-dev

pause s 5
rm -rf node_modules/ package-lock.json
npm i -f

pause s 5
echo " ** Installation effectué**"
echo

echo -e "'\e[1m Écrire le contenu par défaut dans le fichier tsconfig et webpack\e[0m'"
echo "---------------------------------------------------"
pause s 5
# Écrire le contenu par défaut dans les fichiers tsconfig et webpack
source "$layout/script-npm.sh"
echo "** Fichier tsconfig et webpack sont prêt **"
echo

# Mise à jour de env et n° de version
source "$layout/script-default.sh"

echo -e "'\e[1m Mise à jour de compose.yaml\e[0m'"
echo "-----------------------------"
pause s 5
source "$layout/script-compose.sh"
echo "** Fichier compose.yaml est prêt **"
echo

echo "Voulez-vous générer Docker ? "
read -n 1 -rp $'\e[31m\e[1m[Y]\e[0mes / \e[31m\e[1m[N]\e[0mo (is default) > ' valdb
line
line -t ""

echo ${valdb^^}
pause s 5

if [[ "${valdb^^}" == "Y" ]]; then
    echo -e "'\e[1m Creation des éléments Docker\e[0m'"
    echo "-----------------------------"
    pause s 5
    source "$layout/buildnews.sh"
fi

pause s 5
cd $folder_rel_serveur

pause s 5
