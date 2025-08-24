FROM openjdk:17-jdk-slim

LABEL authors="abdel"
WORKDIR app/
COPY target/configServer-0.0.1-SNAPSHOT.jar config-server.jar

EXPOSE 8881

ENTRYPOINT ["java","-jar", "config-server.jar"]