#!/bin/bash

set -e
PROJECT_DIR="/home/user/hakaton_uisi"
BACKUP_DIR="/home/user/backups"
mkdir -p "$BACKUP_DIR"

echo "Запуск резервного копирования"
cd "$PROJECT_DIR"
set -a
source .env
set +a

echo "Создание дампа базы данных..."
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$BACKUP_DIR/db.dump"

echo "Архивация папки media..."
tar -czf "$BACKUP_DIR/media.tar.gz" -C "$PROJECT_DIR/backend" media

echo "Резервное копирование успешно завершено"
echo "Дамп БД: $BACKUP_DIR/db.dump"
echo "Медиа:   $BACKUP_DIR/media.tar.gz"
du -sh "$BACKUP_DIR/db.dump" "$BACKUP_DIR/media.tar.gz"