FROM node:17
WORKDIR /code
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm install
RUN npm install ts-node