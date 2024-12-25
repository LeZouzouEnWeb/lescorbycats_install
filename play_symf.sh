#!/bin/bash
# Exectute > chmod +x ./play_symf.sh && ./play_symf.sh
clear

layout="$PWD/install Ubuntu"
source "$layout/variables.sh"
docker-desktop() {
    /opt/docker-desktop/bin/docker-desktop
}

if ! docker images >/dev/null 2>&1; then
    echo "Lancement de Docker desktop"
    echo "--------------------------------"
    pause s 1 m
    docker-desktop
    echo " ** Lancement en cours ... **"

    i=0
    while true; do
        ((i++))
        printf "\r"
        printf "\033[J"
        printf "Appuyez sur [\033[36;5mq\033[0m] pour quitter (%ds) > " "$i"

        read -t 1 -n 1 -s keys # Lire un seul caractère en mode silencieux

        if [[ "${keys^^}" == "Q" ]]; then
            printf "\n"
            printf "\r"
            printf "\033[J"
            echo "Attente annulée"
            exit 1
        fi

        if docker images >/dev/null 2>&1; then
            printf "\n"
            printf "\r"
            printf "\033[J"
            echo "Lancement effectué"
            break
        fi
    done

fi

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
