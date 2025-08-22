# Use Node.js
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
