# ---------------------------
# Création du fichier URL
# ---------------------------
shopt -s expand_aliases
source $file_rel_bashrc
source $file_rel_bashal

if [ ! -f "$file_rel_URL" ]; then
    echo "Création du fichier $file_rel_URL"
    echo "--------------------------------"
    pause s 1 m
    echo $file_rel_URL
    sudo echo "#!/bin/sh" >$file_rel_URL
    sudo echo " " >>$file_rel_URL
    sudo echo " navigateur=\"firefox\"" >>$file_rel_URL
    sudo echo " if dpkg-query -l \"google-chrome-stable\" >/dev/null 2>&1; then" >>$file_rel_URL
    sudo echo "    navigateur=\"google-chrome-stable\"" >>$file_rel_URL
    sudo echo " fi" >>$file_rel_URL
    sudo echo #"echo " >>$file_rel_URL
    sudo echo "\$navigateur \"\$@\"" >>$file_rel_URL

    sudo chmod +x $file_rel_URL
    echo " ** Création effectuée **"
    echo

fi

if ! dpkg-query -l docker-desktop >/dev/null 2>&1; then
    echo "Docker desktop n'est pas installer."
    echo " ** Veux tu l'installer ?"
    echo -e "\e[31m\e[1m[y]\e[0mes / \e[31m\e[1m[n]\e[0mo > "
    read -n 1 -rp " > " val
    line -t ""
    if [[ "${val^^}" == "Y" ]]; then
        echo "Installation de Docker Desktop Ubuntu"
        echo "--------------------------------"
        pause s 1 m

        dl_docker="https://desktop.docker.com/linux/main/amd64/139021/docker-desktop-4.28.0-amd64.deb?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-linux-amd64"
        WGET -O $myfolder/install/docker-desktop.deb $dl_docker
        sudo apt-get -y install $myfolder/install/docker-desktop.deb
        echo " ** Création effectuée **"
        echo

    else
        echo
        echo "Installation interrompu !!!"
        echo "Il faut installer Docker Desktop : "
        echo " * Ubuntu : https://docs.docker.com/desktop/install/ubuntu/"
        echo " * Windows et Mac : https://www.docker.com/products/docker-desktop/"
        echo
        exit 1
    fi
fi

# add line docker-desktop in bashrc
title_bashal="# ALIAS DOKER"
line_bashal='docker-desktop() {\n\    \/opt\/docker-desktop\/bin\/docker-desktop\n}'
test=$(grep "$title_bashal" "$file_rel_bashal")
if [[ -z "$test" ]]; then
    echo "Création du fichier $file_rel_bashal"
    echo "--------------------------------"
    pause s 1 m
    echo $line_bashal >>$file_rel_bashal
    source $file_rel_bashal
    echo " ** Création effectuée **"
    echo
fi
# source $file_rel_bashrc
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
clear
