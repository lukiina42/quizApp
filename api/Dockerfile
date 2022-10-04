#
#BUILD STAGE
FROM openjdk:11 as buildstage
#setting working directory
WORKDIR /app
#copying and moving necessary files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN ./mvnw package
COPY target/*.jar app.jar

#RUN STAGE - don't want all the files, so copy only JAR file here
FROM openjdk:11
COPY --from=buildstage /app/app.jar .
ENTRYPOINT ["java", "-jar", "/app.jar"]

#FROM openjdk:11
#
#WORKDIR /app
#
##COPY .mvn/ .mvn
#COPY pom.xml ./
#RUN ./mvnw dependency:go-offline
#
#COPY src ./src
#
#CMD ["./mvnw", "spring-boot:run"]
#
# #syntax=docker/dockerfile:1.4
#
##FROM openjdk:11
#RUN mvn package
##COPY target/*.jar app.jar
##ENTRYPOINT ["java", "-jar", "/app.jar"]
