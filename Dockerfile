FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000

CMD ["sh", "-lc", "CI=true npm install --legacy-peer-deps && npx next dev --turbopack -H 0.0.0.0 -p 3000"]

# MSYS_NO_PATHCONV=1 docker run -d --name assignment5-frontend-container --network assignment5-network --env-file .env -e CHOKIDAR_USEPOLLING=1 -e CHOKIDAR_INTERVAL=300 -e WATCHPACK_POLLING=true -p 3000:3000 -v "$PWD:/app" -v assignment5-frontend-node_modules:/app/node_modules -w //app assignment5-frontend:latest sh -lc "CI=true npm install --legacy-peer-deps && npx next dev --turbopack -H 0.0.0.0 -p 3000"