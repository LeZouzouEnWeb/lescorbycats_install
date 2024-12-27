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

## AJOUT DES IDENTIFIANTS GIT / GITHUB

Pour ajouter automatiquement vos clés SSH au SSH-Agent sur Windows, suivez ces étapes selon l'environnement que vous utilisez.

---

### ✅ **1. Automatiser avec Git Bash (`~/.bashrc` ou `~/.profile`)**

#### Ouvrez le fichier de configuration

Dans Git Bash, ouvrez le fichier `~/.bashrc` ou créez-le s'il n'existe pas :

```bash
nano ~/.bashrc
```

Ajoutez ces lignes :

```bash
# Démarre ssh-agent si ce n'est pas déjà actif
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/home
    ssh-add ~/.ssh/work
fi
```

- `-z "$SSH_AUTH_SOCK"` vérifie si `ssh-agent` est déjà lancé.  
- Les commandes `ssh-add` ajoutent vos clés au SSH-Agent.

**Rechargez le fichier de configuration :**
```bash
source ~/.bashrc
```

---

### ✅ **2. Automatiser avec PowerShell (Windows Terminal)**

#### Créez ou éditez le profil PowerShell

1. Ouvrez PowerShell et lancez :  
```powershell
notepad $PROFILE
```

2. Ajoutez ces lignes au fichier :

```powershell
# Démarre ssh-agent s'il n'est pas déjà en cours
if ($null -eq (Get-Service ssh-agent -ErrorAction SilentlyContinue)) {
    Start-Service ssh-agent
}

# Ajoute les clés SSH
ssh-add $HOME\.ssh\home
ssh-add $HOME\.ssh\work
```

3. **Enregistrez et fermez le fichier.**

4. Rechargez le profil :
```powershell
    .$PROFILE
```

---

### ✅ **3. Automatiser avec VS Code (Settings JSON)**

Si vous utilisez VS Code pour le terminal :

1. Allez dans **Paramètres** → **Settings.json** (`Ctrl + ,` → Tapez `settings.json`)  
2. Ajoutez les paramètres suivants :

```json
"terminal.integrated.shellArgs.windows": [
    "-NoExit",
    "-Command",
    "ssh-agent && ssh-add ~/.ssh/home && ssh-add ~/.ssh/work"
]
```

**Explication :**
- Cela démarre SSH-Agent et ajoute automatiquement les clés lorsque le terminal est ouvert.

---

### ✅ **4. Testez votre configuration**

Assurez-vous que vos clés sont correctement ajoutées :

```bash
ssh-add -l
```

Vous devriez voir une liste avec vos clés (`home` et `work`).

---

### 🚀 **C'est prêt !**

À chaque démarrage de Git Bash, PowerShell, ou VS Code, vos clés SSH seront automatiquement ajoutées au SSH-Agent. 😊