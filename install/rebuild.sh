#!/bin/bash

echo "remove-orphans"
echo "--------------------------------"
docker compose down --remove-orphans
echo " ** Opération effectuée **"
echo

echo "image rm _$name"
echo "--------------------------------"
pause s 1 m
docker rmi $(docker images | grep backend_$name | awk '{print $3}')
echo " ** Opération effectuée **"
echo

echo "build --pull"
echo "--------------------------------"
pause s 1 m
docker compose build --pull --no-cache
echo " ** Opération effectuée **"
echo

# docker-compose up --force-recreate -d

echo "compose up pull"
echo "--------------------------------"
pause s 1 m
docker compose up --pull always -d --wait
echo " ** Opération effectuée **"
echo
