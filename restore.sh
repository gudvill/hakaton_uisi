#!/bin/bash

set -e
PROJECT_DIR="/root/hakaton_uisi"
BACKUP_DIR="/root/backups"

echo "Запуск восстановления"
cd "$PROJECT_DIR"
set -a
source .env
set +a
if [ ! -f "$BACKUP_DIR/db.dump" ]; then
    echo "Ошибка: файл дампа БД не найден:"
    echo "$BACKUP_DIR/db.dump"
    exit 1
fi
if [ ! -f "$BACKUP_DIR/media.tar.gz" ]; then
    echo "Ошибка: архив media не найден:"
    echo "$BACKUP_DIR/media.tar.gz"
    exit 1
fi

echo "Запуск контейнера базы данных..."
docker-compose up -d db
echo "Ожидание запуска PostgreSQL..."
sleep 10
echo "Остановка сервисов..."
docker-compose stop backend nginx
echo "Завершение активных подключений к базе данных..."
docker-compose exec -T db psql -U "$POSTGRES_USER" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$POSTGRES_DB' AND pid <> pg_backend_pid();"
echo "Удаление существующей базы данных..."
docker-compose exec -T db psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS \"$POSTGRES_DB\";"
echo "Создание новой базы данных..."
docker-compose exec -T db psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\";"
echo "Восстановление базы данных..."
docker-compose exec -T db pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges < "$BACKUP_DIR/db.dump"

MEDIA_DIR="$PROJECT_DIR/backend/media"
if [ -d "$MEDIA_DIR" ]; then
    TARGET="$PROJECT_DIR/backend/media_$(date +%Y%m%d_%H%M%S)"
    mv "$MEDIA_DIR" "$TARGET"
    echo "Существующая папка media переименована в:"
    echo "$TARGET"
fi

echo "Восстановление файлов media..."
tar -xzf "$BACKUP_DIR/media.tar.gz" -C "$PROJECT_DIR/backend"

echo "Запуск сервисов..."
docker-compose start backend nginx
echo "Восстановление успешно завершено"