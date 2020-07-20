# article_todo
Установка
Клонирование репозитория:
git clone https://github.com/surizmen/article_todo.git
Перемещение .env:
cp .env.example .env

##Обновить настройки в .env:
DB_DATABASE (Название БД, i.e. "article")
DB_USERNAME (Имя бд, i.e. "root")
DB_PASSWORD (Пароль от БД, i.e. "")
HASHIDS_SALT (Используйте app key)
Установить PHP зависимости:
composer install

##Сгенерировать app key:
php artisan key:generate
Generate JWT keys for the .env file:
php artisan jwt:secret
Run the database migrations:
php artisan migrate
##Установить Javascript зависимости:
npm install

##Дополнительные настройки
Сгенерировать тестовые миграции:

php artisan migrate:refresh --seed --force

Кастомный пользователь
После выполнения seed будет доступен пользователь:

Email: user@test.test Password: password
