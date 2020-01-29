FROM node:12

ENV NODE_ENV docker-dev
ENV PORT 9091

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tslint.json .

RUN npm install

CMD ["npm", "run", "watch"]
EXPOSE 9091
