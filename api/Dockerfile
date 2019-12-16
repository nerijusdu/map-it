FROM node:10

ENV NODE_ENV docker-dev

WORKDIR /usr/src/app

# COPY package.json .
# COPY package-lock.json .

RUN npm install

# ADD . /usr/src/app
# RUN npm run build

# CMD ["npm", "start"]
CMD ["npm", "run", "watch"]
EXPOSE 8081
