FROM node:lts

WORKDIR /usr/src/app

ADD package*.json ./
RUN npm install
ADD . .
RUN npm run build

RUN npm install -g ts-node
RUN npm install -g typeorm

CMD npm run start:prod
