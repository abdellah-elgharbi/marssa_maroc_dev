FROM openjdk:17-jdk-slim

LABEL author="abdella elgharbi"
WORKDIR /app
COPY  target/gateway-0.0.1-SNAPSHOT.jar gate-way.jar

EXPOSE 8083
ENTRYPOINT ["java","-jar","gate-way.jar"]

