# Utiliser une image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code de l'application
COPY . .

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]