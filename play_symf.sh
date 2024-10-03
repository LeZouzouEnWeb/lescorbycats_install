#!/bin/bash
# Exectute > chmod +x ./play_symf.sh && ./play_symf.sh
clear

layout="$PWD/install"
source "$layout/variables.sh"

if [ -d "$folder_rel_serveur" ]; then
    cd $folder_rel_serveur

    echo
    echo -e ' Lien pour ouvrir symfony (CTRL + clic): '
    echo -e "\e[1m\e[34mhttp://localhost:$port_symfony\e[0m"
    echo

    php -S localhost:$port_symfony -t public
    pause s 2 m
else
    chmod +x ./install.sh && ./install.sh
fi
