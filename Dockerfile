FROM node:17-alpine

RUN npm install nodemon -g

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
