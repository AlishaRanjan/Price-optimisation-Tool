FROM node:18.14.0

WORKDIR /app

COPY package*.json .

COPY tsconfig.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]