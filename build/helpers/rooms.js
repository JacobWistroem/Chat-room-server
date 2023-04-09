"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomByID = exports.joinRoomByID = exports.createRoom = exports.getRoomByUUID = exports.getRoomByID = exports.getAllJoinedUsersFromRoomID = exports.getJoinedRooms = exports.getAllRooms = void 0;
const mongoose_1 = require("mongoose");
const default_1 = require("../modals/default");
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("./database");
/**
 * Get all rooms
 * @returns returns array of rooms
 */
const getAllRooms = async () => {
    return (0, database_1.convertObjectIdsToStrings)(await default_1.RoomModel.find({}).exec());
};
exports.getAllRooms = getAllRooms;
/**
 * Get all rooms
 * @param userID the user to find in rooms
 * @returns returns array of rooms
 */
const getJoinedRooms = async (userID) => {
    return (0, database_1.convertObjectIdsToStrings)(await default_1.RoomModel.find({ users: userID }).populate('users').exec());
};
exports.getJoinedRooms = getJoinedRooms;
/**
 * Get all users joined to a specific room.
 * @param roomID The specified room.
 * @returns
 */
const getAllJoinedUsersFromRoomID = async (roomID) => {
    const room = await default_1.RoomModel.findOne({ _id: roomID }).populate('users').exec();
    if (!room) {
        throw new Error(`Room could not be identified with ID: ${roomID}`);
    }
    return (0, database_1.convertObjectIdsToStrings)(room.users);
};
exports.getAllJoinedUsersFromRoomID = getAllJoinedUsersFromRoomID;
/**
 * Get a chat room by ID
 * @param id The mongo standard _id identifier
 * @returns The selected room object
 */
const getRoomByID = async (id) => {
    return (0, database_1.convertObjectIdsToStrings)(await default_1.RoomModel.findOne({ _id: id }).exec());
};
exports.getRoomByID = getRoomByID;
/**
 * Get a chat room by UUID
 * @param id The mongo standard _id identifier
 * @returns The selected room object
 */
const getRoomByUUID = async (id) => {
    return (0, database_1.convertObjectIdsToStrings)(await default_1.RoomModel.find({ uuid: id }).exec());
};
exports.getRoomByUUID = getRoomByUUID;
const createRoom = async (name, status = 'open', users = []) => {
    const room = new default_1.RoomModel(Object.assign(Object.assign({ uuid: crypto_1.default.randomUUID() }, (name) && { name: name }), { status: status, users: users }));
    return (0, database_1.convertObjectIdsToStrings)(await room.save());
};
exports.createRoom = createRoom;
/**
 * Adds a user and returns the room object
 * @param roomID Which room to join
 * @param userID Which user to add to the room
 * @returns the room object
 */
const joinRoomByID = async (roomID, userID) => {
    const room = await default_1.RoomModel.findOne({ _id: roomID }).exec();
    if (!room) {
        throw new Error('Room could not be found by the provided UUID');
    }
    /*  */
    /* room.users.push(userID); */
    room.users.push(new mongoose_1.Types.ObjectId(userID));
    room.save();
    return (0, database_1.convertObjectIdsToStrings)(room);
};
exports.joinRoomByID = joinRoomByID;
/**
 * Delete the specified room by ID
 * @param roomID Which room to join
 * @returns
 */
const deleteRoomByID = async (roomID) => {
    const room = await default_1.RoomModel.deleteOne({ _id: roomID }).exec();
    if (!room.deletedCount) {
        throw new Error('Room could not be deleted');
    }
    return (0, database_1.convertObjectIdsToStrings)(room);
};
exports.deleteRoomByID = deleteRoomByID;
