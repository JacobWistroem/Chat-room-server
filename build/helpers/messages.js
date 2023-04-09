"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateMessageEvent = exports.addMessageToRoom = exports.getAllMessagesFromRoomId = void 0;
const default_1 = require("../modals/default");
const database_1 = require("./database");
const getAllMessagesFromRoomId = async (id) => {
    const room = await default_1.RoomModel.findOne({ _id: id }).exec();
    if (!room)
        throw new Error('The provided room id doesnt exist.');
    return room === null || room === void 0 ? void 0 : room.messages;
};
exports.getAllMessagesFromRoomId = getAllMessagesFromRoomId;
/**
 * Adds a message to an existing room
 * @param userID ID of the sending user
 * @param roomID ID for the target room
 * @param content The text content being sent to the chat room
 * @param createdTS The create timestamp to be set
 * @returns Returns the state of the message creation.
 */
const addMessageToRoom = async (userID, roomID, content, createdTS) => {
    try {
        const message = new default_1.MessageModel(Object.assign(Object.assign({ user_id: userID }, (createdTS) && { created_ts: createdTS }), { content: content }));
        const room = await default_1.RoomModel.findOne({ _id: roomID });
        if (!room)
            throw new Error('Unknown room id has been provided.');
        room.messages.push(message);
        await room.save();
        return message.toObject();
    }
    catch (e) {
        console.log(e);
    }
};
exports.addMessageToRoom = addMessageToRoom;
/**
 * Called on new message event from a client
 * @param socket the current context
 * @param myRoomID the room to add our new message
 * @param content The text message to be created as a message
 * @returns returns our message object
 */
const handleCreateMessageEvent = async (socket, roomID, content) => {
    if (!roomID)
        throw new Error("No roomID has been defined - This function has been aborted");
    const message = await (0, exports.addMessageToRoom)(await socket.data.userID, roomID, content);
    console.log(message);
    if (message) {
        const filteredMessage = (0, database_1.convertObjectIdsToStrings)(message);
        socket.to(roomID).emit('message', 'addMessage', filteredMessage);
    }
    return message;
};
exports.handleCreateMessageEvent = handleCreateMessageEvent;
