# lescorbycats_install

## Windows

- installer WampServer
- installer composer
- git
- Docker Desktop
- *NodeJs*
- [Scoop](https://scoop.sh/)
- [Symfony CLI](https://symfony.com/download)

NOTE

METTRE LES DOSSIERS

- SYMFONY
- COMPOSER
- NODEJS
- NVM
- NPM
 DANS LES VARIABLES d'environnement

### Persister la connexion Git avec Github

```bash
    Set-Service -Name ssh-agent -StartupType Automatic
    Start-Service ssh-agent
```

```bash
    eval $(ssh-agent -s)
```

```bash
ssh-add c:/users/<name user windows>/.ssh/home
ssh-add c:/users/<name user windows>/.ssh/work
```
