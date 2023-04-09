/* eslint-disable no-console */
import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import { createAdapter } from '@socket.io/mongo-adapter';
import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';
import { databaseContants } from '../constants/databaseContants';
import { Types } from 'mongoose';

/* const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}; */

export const connectMongoose = async (): Promise<Mongoose> => {
  try {
    const mongooseDB: Mongoose = await mongoose.connect(databaseContants.MONGO_URI);

    console.log('Mongoose connected');

    return mongooseDB;

  } catch (err) {
    console.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  }
};

export const connectMongo = async (): Promise<MongoClient> => {
  try {
    const mongoDB: MongoClient = await new MongoClient(databaseContants.MONGO_URI).connect();

    /* const db = mongoDB.db('chat'); */
    console.log('MongoDB connected');

    return mongoDB;

  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  }
};


/* Create default Socket.io adapter collection, if it doesnt exist and create the adapter */
export const createMongoAdapter = async (mongo: MongoClient, io: Server): Promise<MongoClient> => {
  try {
    await mongo.db(databaseContants.DEFAULT_DATABASE).createCollection(databaseContants.DEFAULT_SOCKETIO_ADAPTER_COLLECTION, {
      capped: true,
      size: 1e6
    });
  } catch (e) {
    // collection already exists
  }

  /* Create Socketio adapter as a seperate collection */
  const mongoCollection = mongo.db(databaseContants.DEFAULT_DATABASE).collection(databaseContants.DEFAULT_SOCKETIO_ADAPTER_COLLECTION);
  io.adapter(createAdapter(mongoCollection));

  return mongo
}

export const filterObjectID = async (document: any) => {
  document._id.toString()
}


export const convertObjectIdsToStrings = (doc: any): any => {
  return JSON.parse(JSON.stringify(doc));
}