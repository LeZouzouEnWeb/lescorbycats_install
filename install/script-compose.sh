cat >"$file_rel_compose" <<EOF
version: '3.8'

services:
# ##> BASE DE DONNÉES // ADMINER ET mariadb
  adminer:
    platform: linux/x86_64
    container_name: adminer_\${NAME}_\${ADMINER_VERSION}
    image: adminer:\${ADMINER_VERSION}
    restart: unless-stopped
    ports:
      - \${ADMINER_LOCALHOST_PORT}:\${ADMINER_DOCKER_PORT}
    env_file:
      - .env
    depends_on:
      - database


###> doctrine/doctrine-bundle ###
  database:
    platform: linux/x86_64
    container_name: mariadb_\${NAME}_\${MARIADB_VERSION}
    image: mariadb:\${MARIADB_VERSION}
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - ../\${FOLDER_DATASQL}:/docker-entrypoint-initdb.d/
      - ../\${FOLDER_DATABASE}:/var/lib/mysql:rw
    ports:
      - \${SQL_LOCALHOST_PORT}:\${SQL_DOCKER_PORT}
###< doctrine/doctrine-bundle ###
# ##< BASE DE DONNÉES // ADMINER ET mariadb


volumes:
###> doctrine/doctrine-bundle ###
  database:
###< doctrine/doctrine-bundle ###
 
EOF

cat >"$file_rel_compose_o" <<EOF
version: '3.8'

services:
###> doctrine/doctrine-bundle ###
  database:
    env_file:
      - .env
    ports:
      - \${SQL_LOCALHOST_PORT}:\${SQL_DOCKER_PORT}
###< doctrine/doctrine-bundle ###


###> symfony/mailer ###
  mailer:
    container_name: MAILPIT_\${NAME}
    image: axllent/mailpit
    ports:
      - \${MAILER_LOCALHOST_SMTP_PORT}:\${MAILER_DOCKER_SMTP_PORT}
      - \${MAILER_LOCALHOST_HTML_PORT}:\${MAILER_DOCKER_HTML_PORT}
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1
###< symfony/mailer ###

EOF

pause s 5
