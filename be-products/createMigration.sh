#!/bin/bash

show_usage() {
    echo "correct usage is: ./createMigration.sh [generate|create] [MIGRATION_NAME]"
    exit
}

COMAND="$1"
MIGRATION_NAME="$2"

if [ -z "$1" ]; then
    COMAND="generate"
elif [ "$1" != "create" ] && [ "$1" != "generate" ]; then
    show_usage
fi

if [ -z "$2" ]; then
    MIGRATION_NAME="Migration"
fi

export MYSQL_HOST="localhost"
export MYSQL_PORT="33306"
export MYSQL_DATABASE="mie-products"
export MYSQL_HOST="localhost"
export MYSQL_USER="mie-products"
export MYSQL_PASSWORD="pwd-mie-products"
export MYSQL_MIGRATION_TABEL_NAME="typeorm_migration"

echo "typeorm migration:$COMAND -n $MIGRATION_NAME"

typeorm migration:"$COMAND" -n "$MIGRATION_NAME"
