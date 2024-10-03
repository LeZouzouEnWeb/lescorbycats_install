#!/bin/bash

version_default="1.0.00"
version_symfony="7.0.*"
version_mariadb="11.3.2"
version_adminer="4.8.1"

port_symfony=8088

name="lescorbycats"
basedb="mariabd"
dataname="${name}_${basedb}"
user=$LOGNAME

myfolder=$PWD
home=~
layout="$PWD/install"

# Vérifier si le fichier .env n'existe pas
file_env=".env"

folder_rel_bin=~/bin
folder_serveur="serveur-frontend"
folder_rel_serveur="$myfolder/$folder_serveur"
folder_rel_env=$folder_rel_serveur/
folder_rel_data=$myfolder/database/$dataname

file_rel_bashrc=~/.bashrc
file_rel_bashal=~/.bash_aliases
file_rel_URL=$folder_rel_bin/URL
file_rel_env="$folder_rel_serveur/$file_env"
file_rel_compose="$folder_rel_serveur/compose.yaml"
file_rel_compose_o="$folder_rel_serveur/compose.override.yaml"
file_rel_dockerfile="$folder_rel_serveur/Dockerfile"

if [ -f "$file_rel_env" ]; then
    current_version=$(grep '^BACKEND_VERSION=' $file_rel_env | cut -d '=' -f2)
fi

# Définir l'indentation

line() {
    local ttxt="${1}"
    local txt="${2}"
    # Effacer la ligne après la fin du compte à rebours
    printf "\r"
    printf "\033[J"
    # Afficher un message final
    if [[ "$ttxt" == "-t" ]]; then
        printf "$txt\n"
    fi
}

pause() {
    declare -a tab
    # Lecture et conversion de la chaîne en tableau
    read -r -a tab <<<"$@"

    pause="p"
    stop="stop"
    clear="c"
    sleep="s"
    nomessage="m"

    test= in_array "${tab[*]}" "$pause"
    result=$?
    test= in_array "${tab[*]}" "$sleep"
    is_sleep=$?
    test= in_array "${tab[*]}" "$nomessage"
    is_nomessage=$?

    # echo "result : $result"
    if [[ "$result" == "0" && "$is_sleep" == "0" ]]; then
        read -p "Appuyez sur'Entrée' pour continuer ou [s] pour stopper > " text
        case "$text" in
        [Qq] | [Ss] | [Ss][Tt][Oo][Pp])
            exit 1
            ;;
        esac
    fi

    test= in_array "${tab[*]}" "$sleep"
    is_pause=$?
    # echo "is_pause : $is_pause"
    if [[ "$is_pause" == "1" ]]; then
        index=-1
        for ((i = 0; i < ${#tab[@]}; i++)); do
            if [[ "${tab[$i]}" == "$sleep" ]]; then
                index=$((i + 1))
                break
            fi
        done
        # echo "index : $index"
        if [[ "$index" != "-1" ]]; then
            num=${tab[$index]}
            # echo "num = $num"
            echo "$num" | egrep -q '^[-+]?[0-9]+$'
            result=$?
            # echo "result if '$num' is number : $result"
            if [[ "$result" == "0" ]]; then
                # Compte à rebours de 10 à 1
                for ((i = $num; i >= 1; i--)); do
                    # Efface la ligne précédente
                    printf "\r"
                    printf "\033[J"
                    # Affiche le message de patientez
                    if [[ "$is_nomessage" == "1" ]]; then
                        printf "Merci de patienter \033[31;1m%ds\033[0m ... " "$i"

                    else
                        printf "Appuyez sur [\033[36;5mc\033[0m] pour continuer (\033[31;1m%ds\033[0m) ou [\033[36;5mq\033[0m] pour quitter > " "$i"
                    fi
                    # Attendre 1 seconde
                    read -t 1 -n 1 key             # Lire une touche en temps limité (1 seconde)
                    if [[ ${key^^} == "Q" ]]; then # Si "q" est pressé, quitter
                        printf "\n"
                        # Effacer la ligne après la fin du compte à rebours
                        printf "\r"
                        printf "\033[J"
                        # Afficher un message final
                        printf "Le processus est arrêté.\n"
                        exit 1
                    elif [[ ${key^^} == "C" ]]; then # Si "Entrée" est pressée, sortir de la boucle
                        break
                    fi
                done

                # Effacer la ligne après la fin du compte à rebours
                line
            fi
        fi

    fi

    test= in_array "${tab[*]}" "$stop"
    result=$?
    # echo "result : $result"
    if [[ "$result" == "1" ]]; then
        echo "Procédure stoppée !"
        exit 1
    fi

    test= in_array "${tab[*]}" "$clear"
    result=$?
    # echo "result : $result"
    if [[ "$result" == "1" ]]; then
        clear
    fi
}

function in_array() {
    local tableau=("$1")
    local comparaison="$2"
    # echo "Tableau: ${tableau[@]}"
    # echo "Élément de comparaison: $comparaison"

    if echo "${tableau[@]}" | grep -qw "$comparaison"; then
        return 1
    else
        return 0
    fi
}
