FROM node:lts-alpine

WORKDIR /express-app

EXPOSE 5000

COPY package.json ./

RUN npm install --silent && npm install -g nodemon

CMD ["npm", "run", "dev"]