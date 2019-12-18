FROM node:10

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

ADD . /usr/src/app

CMD ["npm", "run", "dev"]
EXPOSE 9090