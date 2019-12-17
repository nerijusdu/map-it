FROM node:10

ENV NODE_ENV docker-dev

WORKDIR /usr/src/app

RUN npm install

CMD ["npm", "run", "watch"]
EXPOSE 8081
