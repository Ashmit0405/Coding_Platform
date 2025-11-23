FROM eclipse-temurin:17-jdk

RUN apt-get update && apt-get install -y time \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/myapp