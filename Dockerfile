FROM node:lts-alpine

WORKDIR /express-app

EXPOSE 5000

COPY package.json ./

RUN npm install --silent

CMD ["npx", "prisma", "db", "push"]
CMD ["npm", "run", "dev"]