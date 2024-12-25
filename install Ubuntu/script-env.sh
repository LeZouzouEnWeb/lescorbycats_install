# Écrire le contenu par défaut dans le fichier .env
cat >"$file_rel_env" <<EOF
# Fichier de configuration .env par défaut
# In all environments, the following files are loaded if they exist,
# the latter taking precedence over the former:
# 
# * .env                contains default values for the environment variables needed by the app
# * .env.local          uncommitted file with local overrides
# * .env.\$APP_ENV       committed environment-specific defaults
# * .env.\$APP_ENV.local uncommitted environment-specific overrides
# 
# Real environment variables win over .env files.
# 
# DO NOT DEFINE PRODUCTION SECRETS IN THIS FILE NOR IN ANY OTHER COMMITTED FILES.
# https://symfony.com/doc/current/configuration/secrets.html
# 
# Run "composer dump-env prod" to compile .env files for production use (requires symfony/flex >=1.2).
# https://symfony.com/doc/current/best_practices.html#use-environment-variables-for-infrastructure-configuration
###> symfony/docker ###
#

NAME=$name
BASE=$basedb

###> MYSQL/ mariadb - adminer ###
#
DATABASE_NAME=\${NAME}_\${BASE}
MYSQL_HOST=database
MYSQL_ROOT_PASSWORD=P@ssW0rd!
MYSQL_DATABASE=\${NAME}
MYSQL_USER=user
MYSQL_PASSWORD=password

MYSQL_USER_API=api
MYSQL_PASSWORD_API=password


ADMINER_DEFAULT_SERVER=\${MYSQL_HOST}
ADMINER_DEFAULT_DRIVER=mySQL
ADMINER_DEFAULT_DB_NAME=\${MYSQL_DATABASE}

#
###< MYSQL/ mariadb - adminer ###


###> VERSIONS ###
BACKEND_VERSION=$version_default
MARIADB_VERSION=$version_mariadb
ADMINER_VERSION=$version_adminer
###< VERSIONS ###

###>  FOLDERS ###
FOLDER_BACK=$folder_serveur
FOLDER_DATA=database
FOLDER_DATASQL=\${FOLDER_DATA}/sql
FOLDER_DATABASE=\${FOLDER_DATA}/\${DATABASE_NAME}
###<  FOLDERS ###

###> PORTS ###
HTTP_DOCKER_PORT=80
HTTPS_DOCKER_PORT=443
HTTP3_DOCKER_PORT=443

HTTP_LOCALHOST_PORT=$port_symfony
HTTPS_LOCALHOST_PORT=443
HTTP3_LOCALHOST_PORT=443

SQL_DOCKER_PORT=3306
SQL_LOCALHOST_PORT=3388

ADMINER_DOCKER_PORT=8080
ADMINER_LOCALHOST_PORT=5088

MAILER_DOCKER_SMTP_PORT=1025
MAILER_LOCALHOST_SMTP_PORT=1025

MAILER_DOCKER_HTML_PORT=8025
MAILER_LOCALHOST_HTML_PORT=8025
###< PORTS ###


#
###< symfony/docker ###

###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=4c4ad78b8a9ed1347ed8113081a3f6cf
###< symfony/framework-bundle ###
###> doctrine/doctrine-bundle ###
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
## SERVER_NAME="\${SERVER_NAME:-localhost}:\${HTTP_LOCALHOST_PORT:-80}, php:\${HTTP_LOCALHOST_PORT}"
## MERCURE_PUBLISHER_JWT_KEY=\${CADDY_MERCURE_JWT_SECRET:-4c4ad78b8a9ed1347ed8113081a3f6cf}
## MERCURE_SUBSCRIBER_JWT_KEY=\${CADDY_MERCURE_JWT_SECRET:-4c4ad78b8a9ed1347ed8113081a3f6cf}
## TRUSTED_PROXIES=\${TRUSTED_PROXIES:-127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16}
## TRUSTED_HOSTS=^\${SERVER_NAME:-example\\.com|localhost}|php\$$
# Run "composer require symfony/mercure-bundle" to install and configure the Mercure integration
# MERCURE_URL=\${CADDY_MERCURE_URL:-http://php/.well-known/mercure}
# MERCURE_PUBLIC_URL=http://\${SERVER_NAME:-localhost}:\${HTTP_LOCALHOST_PORT:-443}/.well-known/mercure
# MERCURE_JWT_SECRET=\${CADDY_MERCURE_JWT_SECRET:-4c4ad78b8a9ed1347ed8113081a3f6cf}
# The two next lines can be removed after initial installation
## SYMFONY_VERSION=\${SYMFONY_VERSION:-7.0}
## STABILITY=\${STABILITY:-stable}
#
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
#
# DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
# DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=8.0.32&charset=utf8mb4"
# DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
DATABASE_URL="mysql://\${MYSQL_USER_API}:\${MYSQL_PASSWORD_API}@\${MYSQL_HOST}:\${SQL_DOCKER_PORT}/\${MYSQL_DATABASE}?serverVersion=\${MARIADB_VERSION}-MariaDB&charset=utf8mb4"
###< doctrine/doctrine-bundle ###


###> symfony/messenger ###
# Choose one of the transports below
# MESSENGER_TRANSPORT_DSN=amqp://guest:guest@localhost:5672/%2f/messages
# MESSENGER_TRANSPORT_DSN=redis://localhost:6379/messages
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
###< symfony/messenger ###

###> symfony/mailer ###
# MAILER_DSN=null://null
###< symfony/mailer ###

EOF
