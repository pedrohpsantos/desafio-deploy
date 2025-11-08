# 1. Imagem Base
FROM node:25-alpine

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Copia e instala as dependências
COPY package*.json .
RUN npm install

# 4. Copia o resto do código da aplicação
COPY . .

# 5. Expõe a porta padrão do Next.js
EXPOSE 3000

# 6. Comando para rodar o servidor
CMD ["npm", "run", "dev"]