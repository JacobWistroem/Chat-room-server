"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.RoomModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
;
;
;
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    type: { type: Number, required: true },
    created_ts: { type: Date, default: Date.now },
}, { strictQuery: true });
const messageSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    created_ts: { type: Date, default: Date.now },
    content: { type: String },
}, { strictQuery: true });
const roomSchema = new mongoose_1.Schema({
    uuid: { type: String, required: true },
    name: { type: String, required: false },
    users: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    messages: [messageSchema],
    created_ts: { type: Date, default: Date.now },
    status: { type: String },
}, { strictQuery: true });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
exports.RoomModel = (0, mongoose_1.model)('Room', roomSchema);
exports.MessageModel = (0, mongoose_1.model)('Message', messageSchema);
