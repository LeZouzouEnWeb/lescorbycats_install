#!/bin/bash
# Exectute > chmod +x ./install.sh && ./install.sh
clear
sudo test

layout="$PWD/install"
source "$layout/variables.sh"

chmod +x "$layout/script-init.sh"
source "$layout/script-init.sh"

echo "Menu :"
echo "-------------------------------"
echo
echo -e "\e[31m\e[1m[c]\e[0m - Docker  - Créer un nouveau Build"
echo -e "\e[31m\e[1m[r]\e[0m - Docker  - Recréer les containers (compose up)"
echo -e "\e[31m\e[1m[d]\e[0m - Docker  - Recréer des containers (composer) avec suppression et remise à zéro de la base de données"
echo -e "\e[31m\e[1m[i]\e[0m - Symfony - Docker - Nouvelle installation (tout supprimer et tout recréer)"
echo -e "\e[31m\e[1m[b]\e[0m - Docker  - Rebuild (supprimer les anciennes images et recréer le Build)"
echo -e "\e[31m\e[1m[l]\e[0m - Lancer les serveurs"
echo -e "\e[31m\e[1m[q]\e[0m - Quitter (default)"
read -n 1 -rp " > " val
line -t ""
#
if [[ ! ${val^^} == "L" ]]; then
    pause s 2 m

    if [[ ${val^^} == "I" ]]; then
        echo "Nouvelle Installation :"
        echo "----------"

    elif [[ ${val^^} == "R" ]]; then
        echo "Recreate containers (compose up) :"
        echo "----------"

    elif [[ ${val^^} == "D" ]]; then
        echo "Recreate containers (compose up) with recreate db:"
        echo "----------"

    elif [[ ${val^^} == "B" ]]; then
        echo "Rebuild :"
        echo "----------"
    elif [[ ${val^^} == "C" ]]; then
        echo "Create Build :"
        echo "-------------"
    else
        clear
        exit 1
    fi

    if [ -d "$folder_rel_data" ]; then
        case "$val" in
        [Rr] | [Bb] | [Cc])
            # Suppression de la base de donnée
            echo
            echo "Voulez-vous supprimer la base de donnée ? "
            read -n 1 -rp $'\e[31m\e[1m[Y]\e[0mes / \e[31m\e[1m[N]\e[0mo (is default) -- \e[31m\e[1m[Q]\e[0muitter> ' val_bd
            line
            line -t ""

            if [[ "${val^^}" == "Q" ]]; then
                clear
                exit 1
            fi

            case "$val_bd" in
            [Yy] | [Yy][Ee][Ss])
                sudo rm -rf $folder_rel_data
                ;;
            esac
            ;;
        esac
    fi
    case "$val" in
    [Rr] | [Bb] | [Cc])
        source $layout/script-default.sh
        ;;
    esac

    if [[ ${val^^} == "I" ]]; then
        source "$layout/installation.sh"

    elif [[ ${val^^} == "R" ]]; then
        source "$layout/composeup.sh"

    elif [[ ${val^^} == "D" ]]; then
        source "$layout/newsdb.sh"

    elif [[ ${val^^} == "B" ]]; then
        source "$layout/rebuild.sh"

    elif [[ ${val^^} == "C" ]]; then
        source "$layout/buildnews.sh"

    else
        exit 1

    fi
    pause s 2 m

    # if [ -d "$folder_rel_data" ]; then
    # sudo chown -R $user $folder_rel_data
    # fi

    echo -e "'\e[1m Nettoyage des images\e[0m'"
    echo "-----------------------------"
    my_array=("backend_$name" "<none>" "app-php")
    pause s 2 m

    # Boucle pour lire le tableau
    for element in "${my_array[@]}"; do
        docker rmi $(docker images | grep "$element" | awk '{print $3}')
    done

    docker volume prune --force
    echo "** Images nettoyées **"
    echo

    docker-desktop
    pause s 2 m

fi
echo
echo -e ' Lien pour ouvrir symfony (CTRL + clic): '
echo -e "\e[1m\e[34mhttp://localhost:$port_symfony\e[0m"
echo
echo
echo "---------------------------------"
echo "Veux tu lancer le serveur symfony ? "
echo -e "\e[31m\e[1m[y]\e[0mes / \e[31m\e[1m[n]\e[0mo > "
read -n 1 -rp " > " val
line -t ""
if [[ "${val^^}" == "Y" ]]; then
    php -S localhost:$port_symfony -t public
fi
pause s 2 m
