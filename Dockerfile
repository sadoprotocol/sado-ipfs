FROM node:20-alpine3.19

WORKDIR /app

COPY src ./src
COPY package-lock.json .
COPY package.json .
COPY tsconfig.json .

RUN npm install
RUN npm run build

CMD 

EXPOSE 3000
