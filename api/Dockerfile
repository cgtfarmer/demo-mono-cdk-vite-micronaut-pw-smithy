FROM gradle:8.4.0-jdk21 AS development

WORKDIR /usr/local/api

COPY . ./

RUN ./gradlew clean && \
  ./gradlew build

CMD ["./gradlew", "run"]


# FROM development AS build

# RUN npm run build


# FROM nginx:1.26.2 AS production

# COPY --from=build /home/node/app/build/* /usr/share/nginx/html/
