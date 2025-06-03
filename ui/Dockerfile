FROM node:20.16.0 AS development

WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

ENTRYPOINT ["./bin/docker-entrypoint"]

CMD ["npm", "run", "dev"]


# FROM development AS production

# RUN npm run build

# CMD ["npm", "run", "start"]
