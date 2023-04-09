import { Types } from "mongoose";
import { Room, RoomModel, User } from "../modals/default"
import crypto from 'crypto';
import { convertObjectIdsToStrings } from "./database";


/**
 * Get all rooms
 * @returns returns array of rooms
 */
export const getAllRooms = async (): Promise<Room[]> => {
    return convertObjectIdsToStrings(await RoomModel.find({}).exec());
}

/**
 * Get all rooms
 * @param userID the user to find in rooms
 * @returns returns array of rooms
 */
export const getJoinedRooms = async (userID: string)/* : Promise<Room[]> */ => {
    return convertObjectIdsToStrings(await RoomModel.find({ users: userID }).populate('users').exec());
}

/**
 * Get all users joined to a specific room.
 * @param roomID The specified room.
 * @returns 
 */
export const getAllJoinedUsersFromRoomID = async (roomID: string): Promise<User[]> => {
    const room = await RoomModel.findOne({ _id: roomID }).populate('users').exec();

    if (!room) {
        throw new Error(`Room could not be identified with ID: ${roomID}`)
    }
    return convertObjectIdsToStrings(room.users);
};

/**
 * Get a chat room by ID
 * @param id The mongo standard _id identifier
 * @returns The selected room object
 */
export const getRoomByID = async (id: string): Promise<Room> => {
    return convertObjectIdsToStrings(await RoomModel.findOne({ _id: id }).exec());
}

/**
 * Get a chat room by UUID
 * @param id The mongo standard _id identifier
 * @returns The selected room object
 */
export const getRoomByUUID = async (id: string): Promise<Room[]> => {
    return convertObjectIdsToStrings(await RoomModel.find({ uuid: id }).exec());
}

export const createRoom = async (name?: string, status = 'open', users: Types.ObjectId[] = []): Promise<Room> => {
    const room = new RoomModel({
        uuid: crypto.randomUUID(),
        ...(name) && { name: name },
        status: status,
        users: users
    });

    return convertObjectIdsToStrings(await room.save());
}

/**
 * Adds a user and returns the room object
 * @param roomID Which room to join
 * @param userID Which user to add to the room
 * @returns the room object
 */
export const joinRoomByID = async (roomID: string, userID: string) => {
    const room = await RoomModel.findOne({ _id: roomID }).exec()

    if (!room) {
        throw new Error('Room could not be found by the provided UUID');
    }
    /*  */
    /* room.users.push(userID); */
    room.users.push(new Types.ObjectId(userID));
    room.save();

    return convertObjectIdsToStrings(room);
}

/**
 * Delete the specified room by ID
 * @param roomID Which room to join
 * @returns 
 */
export const deleteRoomByID = async (roomID: string) => {
    const room = await RoomModel.deleteOne({ _id: roomID }).exec()

    if (!room.deletedCount) {
        throw new Error('Room could not be deleted');
    }

    return convertObjectIdsToStrings(room);
}