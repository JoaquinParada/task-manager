# Dockerfile
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el proyecto (si usás TypeScript)
RUN npm run build

# Exponer el puerto de NestJS (ajustá si usás otro)
EXPOSE 3000

# Comando para correr la app
CMD ["npm", "run", "start:prod"]
