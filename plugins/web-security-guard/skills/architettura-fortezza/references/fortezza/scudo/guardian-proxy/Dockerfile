FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
# Utente non-root: se lo scudo fosse compromesso, l'attaccante non è amministratore
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 8080
CMD ["node", "server.js"]
