# Dockerfile (inside cloud_backend/)
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/cloud-backend-0.0.1-SNAPSHOT.jar"]
