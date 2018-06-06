FROM node:9.11.1-alpine
RUN npm install -g node-static
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY ./app /home/node/app
