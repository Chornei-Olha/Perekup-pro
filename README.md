# 📦 ДЕПЛОЙ ПРОЕКТА NEXT.JS НА VPS

🔹 Название проекта: Essence (Next.js 15 + Tailwind + Express)
🔹 Что требуется: VPS с доступом по SSH, установленный Node.js (v18+)

---

## 🔧 ШАГИ ПО УСТАНОВКЕ И ЗАПУСКУ

1️⃣ Подключитесь по SSH к серверу:

ssh user@IP_СЕРВЕРА

(или используйте Web-консоль в панели Hyperhost)

---

2️⃣ Разархивируйте проект:

unzip essence.zip -d essence
cd essence

---

3️⃣ Установите Node.js (если ещё не установлен):

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install --lts

Проверьте версии:

node -v
npm -v

---

4️⃣ Установите зависимости проекта:

npm install

---

5️⃣ Создайте файл `.env.production`, если нужно (переменные окружения):

Пример:

SUPABASE_URL=https://...
SUPABASE_KEY=...
NEXT_PUBLIC_API_URL=https://example.com/api

---

6️⃣ Соберите проект:

npm run build

---

7️⃣ Запустите проект:

npm start

После этого сайт будет доступен на http://localhost:3000

---

🌀 (РЕКОМЕНДУЕМО) Используйте PM2 для постоянной работы:

npm install -g pm2
pm2 start npm --name essence -- start
pm2 save
pm2 startup

---

🌐 (ОПЦИОНАЛЬНО) Настройте домен через NGINX:

Пример конфига (если используется домен):

server {
listen 80;
server_name yourdomain.com;

      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

}

Перезапуск NGINX:

sudo nginx -t
sudo systemctl restart nginx

---

🔒 (ОПЦИОНАЛЬНО) Установка SSL-сертификата:

sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com

---
