"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertObjectIdsToStrings = exports.filterObjectID = exports.createMongoAdapter = exports.connectMongo = exports.connectMongoose = void 0;
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_adapter_1 = require("@socket.io/mongo-adapter");
const mongodb_1 = require("mongodb");
const databaseContants_1 = require("../constants/databaseContants");
/* const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}; */
const connectMongoose = async () => {
    try {
        const mongooseDB = await mongoose_1.default.connect(databaseContants_1.databaseContants.MONGO_URI);
        console.log('Mongoose connected');
        return mongooseDB;
    }
    catch (err) {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    }
};
exports.connectMongoose = connectMongoose;
const connectMongo = async () => {
    try {
        const mongoDB = await new mongodb_1.MongoClient(databaseContants_1.databaseContants.MONGO_URI).connect();
        /* const db = mongoDB.db('chat'); */
        console.log('MongoDB connected');
        return mongoDB;
    }
    catch (err) {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
};
exports.connectMongo = connectMongo;
/* Create default Socket.io adapter collection, if it doesnt exist and create the adapter */
const createMongoAdapter = async (mongo, io) => {
    try {
        await mongo.db(databaseContants_1.databaseContants.DEFAULT_DATABASE).createCollection(databaseContants_1.databaseContants.DEFAULT_SOCKETIO_ADAPTER_COLLECTION, {
            capped: true,
            size: 1e6
        });
    }
    catch (e) {
        // collection already exists
    }
    /* Create Socketio adapter as a seperate collection */
    const mongoCollection = mongo.db(databaseContants_1.databaseContants.DEFAULT_DATABASE).collection(databaseContants_1.databaseContants.DEFAULT_SOCKETIO_ADAPTER_COLLECTION);
    io.adapter((0, mongo_adapter_1.createAdapter)(mongoCollection));
    return mongo;
};
exports.createMongoAdapter = createMongoAdapter;
const filterObjectID = async (document) => {
    document._id.toString();
};
exports.filterObjectID = filterObjectID;
const convertObjectIdsToStrings = (doc) => {
    return JSON.parse(JSON.stringify(doc));
};
exports.convertObjectIdsToStrings = convertObjectIdsToStrings;
