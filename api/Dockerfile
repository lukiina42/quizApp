# #
# #BUILD STAGE
# FROM openjdk:11 as buildstage
# #setting working directory
# WORKDIR /app
# #copying and moving necessary files
# COPY mvnw .
# COPY .mvn .mvn
# COPY pom.xml .
# COPY src src
# COPY target/*.jar app.jar

# #RUN STAGE - don't want all the files, so copy only JAR file here
# FROM openjdk:11
# COPY --from=buildstage /app/app.jar .
# ENTRYPOINT ["java", "-jar", "/app.jar"]

FROM maven:3-openjdk-11 AS build

WORKDIR /build

COPY pom.xml pom.xml
RUN mvn dependency:resolve

COPY src src
RUN mvn package

FROM tomcat:8.0.51-jre8-alpine AS app

COPY --from=build /build/target/api.war /usr/local/tomcat/webapps/

CMD [ "catalina.sh", "run" ]
