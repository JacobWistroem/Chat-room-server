import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectMongoose, connectMongo, createMongoAdapter } from './helpers/database'
import { databaseContants } from './constants/databaseContants';
import { getAllMessagesFromRoomId } from "./helpers/messages";
import { MessageModel, Room, User } from "./modals/default";
import { handleDbEvents } from "./helpers/dbEvents";
import { handleSocketInstances } from "./helpers/clientHandler";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    allowedHeaders: [],
    credentials: true
  }
});


const main = async () => {
  try {
    await connectMongoose();
    const mongoClient = await connectMongo().then((mongo) => createMongoAdapter(mongo, io));

    /* Start watching our message collection */
    const messageCollection = mongoClient.db(databaseContants.DEFAULT_DATABASE).collection('messages');
    const changeStream = messageCollection.watch();

    handleDbEvents(io, changeStream);
    handleSocketInstances(io);
  } catch (e) {
    console.error(e);
  }
};


main();
httpServer.listen(3000);


