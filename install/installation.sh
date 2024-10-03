#!/bin/bash

# echo $folder_rel_serveur
clear
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
        pause s 1 m
        sudo rm -rf $element
        echo " ** suppression effectuée **"
        echo
    fi
done

echo -e "'\e[1m Ajout d'un module php 8.3 '$folder_serveur'\e[0m'"
echo "---------------------------------------------------"
pause s 1 m

sudo apt install php8.3 -y
pause s 1 m
sudo apt install php8.3-xml -y
echo
echo "** module php 8.3 est prêt **"
echo

echo -e "'\e[1m Installation de Symfony \e[0m'"
echo "---------------------------------------------------"
pause s 1 m
mkdir $folder_rel_serveur
cd $folder_rel_serveur
composer create-project symfony/skeleton:"$version_symfony" .

pause s 1 m
composer require webapp --quiet

pause s 2 m
composer require "symfony/var-exporter:7.0.4"

pause s 1 m
echo " ** Installation effectué**"
echo

# Mise à jour de env et n° de version
source "$layout/script-default.sh"

echo -e "'\e[1m Mise à jour de compose.yaml\e[0m'"
echo "-----------------------------"
pause s 1 m
source "$layout/script-compose.sh"
echo "** Fichier compose.yaml est prêt **"
echo

echo "Voulez-vous générer Docker ? "
read -n 1 -rp $'\e[31m\e[1m[Y]\e[0mes / \e[31m\e[1m[N]\e[0mo (is default) > ' val_bd
line
line -t ""

if [[ "${val^^}" == "Y" ]]; then
    source "$layout/buildnews.sh"
fi
cd $folder_rel_serveur

pause s 5 m
