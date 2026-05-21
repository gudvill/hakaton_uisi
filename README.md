# hakaton_uisi

## [ПЕ-21б] Гудвилл АМ, Коновалова СД 

---

## Работа с Git

### Отправить на Git:
```bash
git add .
git commit -m "комментарий"

git pull origin main # Подтянуть изменения с гита, если они были

git push origin main # Запушить свои изменения
```
### Подтянуть с Git:
```bash
git pull origin main

# Далее можно вносить свои изменения в файлы
```
### Добавить определенную папку:
```bash
git add frontend/
```
### Если фронтенд новые зависимости:
```bash
docker-compose exec frontend npm install
```
### Если backend новые зависимости: 
```bash
docker-compose exec backend pip install -r requirements.txt
```
---
