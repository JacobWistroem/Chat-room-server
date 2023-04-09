"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseContants = void 0;
exports.databaseContants = {
    DEFAULT_DATABASE: 'chat',
    DEFAULT_SOCKETIO_ADAPTER_COLLECTION: 'socket.io-adapter-events',
    MONGO_URI: 'mongodb://127.0.0.1:30001/chat?replicaSet=chat-cluster-set&directConnection=true',
    MESSAGE_COLLECTION: 'messages',
    USERS_COLLECTION: 'users',
    ROOMS_COLLECTION: 'rooms',
};
