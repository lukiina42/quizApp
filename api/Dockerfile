
FROM maven:3-openjdk-11 AS build

WORKDIR /build

COPY pom.xml pom.xml
RUN mvn dependency:resolve

COPY src src
RUN mvn package

FROM openjdk:11 AS app

COPY --from=build /build/target/api.jar quiz-app-api.jar

CMD ["java","-jar","quiz-app-api.jar"]
