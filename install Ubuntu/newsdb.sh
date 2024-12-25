#!/bin/bash

# "Recreate :"

echo "remove-orphans"
echo "--------------------------------"
docker compose down --remove-orphans
echo " ** Opération effectuée **"
echo
pause s 2 m

docker volume prune --force
pause s 2 m

if [ -d "$folder_rel_data" ]; then
    echo "suppression base de données"
    echo "--------------------------------"
    pause s 2 m
    sudo rm -rf $folder_rel_data
    echo " ** suppression effectuée **"
    echo
fi

cd $folder_rel_serveur
echo "compose up pull"
echo "--------------------------------"
pause s 2 m
docker compose up --pull always -d --wait
docker-compose up --force-recreate -d
echo " ** compose up effectuée **"
echo
pause s 2 m
