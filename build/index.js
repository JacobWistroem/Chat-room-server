"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const database_1 = require("./helpers/database");
const databaseContants_1 = require("./constants/databaseContants");
const dbEvents_1 = require("./helpers/dbEvents");
const clientHandler_1 = require("./helpers/clientHandler");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        allowedHeaders: [],
        credentials: true
    }
});
const main = async () => {
    try {
        await (0, database_1.connectMongoose)();
        const mongoClient = await (0, database_1.connectMongo)().then((mongo) => (0, database_1.createMongoAdapter)(mongo, io));
        /* Start watching our message collection */
        const messageCollection = mongoClient.db(databaseContants_1.databaseContants.DEFAULT_DATABASE).collection('messages');
        const changeStream = messageCollection.watch();
        (0, dbEvents_1.handleDbEvents)(io, changeStream);
        (0, clientHandler_1.handleSocketInstances)(io);
    }
    catch (e) {
        console.error(e);
    }
};
main();
httpServer.listen(3000);
