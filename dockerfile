FROM ubuntu:latest
RUN apt update
RUN apt install wget joe gnupg2 -y
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
RUN apt update
RUN echo "8 14" | apt-get install -y mongodb-org

RUN service mongod start

#EXPOSE 80
#RUN ["mongod"]

#docker run -p 30001:27017 --name mongo1 --net my-mongo-cluster mongo:latest mongod --replSet my-mongo-set