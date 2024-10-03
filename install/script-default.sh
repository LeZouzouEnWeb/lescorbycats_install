#!/bin/bash

# Vérifier si le fichier .env n'existe pas

echo -e "'\e[1m Écrire le contenu par défaut dans le fichier .env\e[0m'"
echo "---------------------------------------------------"
pause s 1 m
# Écrire le contenu par défaut dans le fichier .env
source "$layout/script-env.sh"
echo "** Fichier .env est prêt **"
echo

echo -e "'\e[1m Mise à jour du n° de version \e[0m'"
echo "---------------------------------------------------"
pause s 1 m
# Extraire le numéro de version actuel
if [[ "$current_version" == "" ]]; then
    current_version=$version_default
fi

# Séparer le numéro de version en parties (major, minor, patch)
major=$(echo "$current_version" | cut -d'.' -f1)
minor=$(echo "$current_version" | cut -d'.' -f2)
patch=$(echo "$current_version" | cut -d'.' -f3)

# Incrémenter la partie patch
patch=$((patch + 1))
# Formater le patch pour qu'il soit sur deux chiffres
patch=$(printf "%02d" $patch)

if [[ "$path" == "100" ]]; then
    patch=0
    minor=$((minor + 1))
    if [[ "$minor" == "10" ]]; then
        patch=0
        major=$((major + 1))
    fi
fi

# Reconstruire le numéro de version mis à jour
new_version="$major.$minor.$patch"

# Remplacer la valeur de BACKEND_VERSION dans le fichier .env
sed -i "s/^BACKEND_VERSION=.*/BACKEND_VERSION=$new_version/" $file_rel_env

echo " ** La version a été mise à jour à $new_version **"
echo
