import { ChangeStream } from "mongodb";
import { Server, Socket } from "socket.io";
import { Message, MessageModel, Room, RoomModel } from "../modals/default"
import { convertObjectIdsToStrings } from "./database";

export const getAllMessagesFromRoomId = async (id: string): Promise<Message[]> => {
    const room = await RoomModel.findOne({ _id: id }).exec();
    if (!room) throw new Error('The provided room id doesnt exist.');
    return room?.messages;
}

/**
 * Adds a message to an existing room
 * @param userID ID of the sending user
 * @param roomID ID for the target room
 * @param content The text content being sent to the chat room
 * @param createdTS The create timestamp to be set
 * @returns Returns the state of the message creation.
 */
export const addMessageToRoom = async (userID: string, roomID: string, content: string, createdTS?: Date): Promise<Message | undefined> => {
    try {
        const message = new MessageModel({
            user_id: userID,
            ...(createdTS) && { created_ts: createdTS },
            content: content
        });
        const room = await RoomModel.findOne({ _id: roomID })

        if (!room) throw new Error('Unknown room id has been provided.');


        room.messages.push(message)
        await room.save();
        return message.toObject();

    } catch (e) {
        console.log(e);
    }

}

/**
 * Called on new message event from a client
 * @param socket the current context
 * @param myRoomID the room to add our new message
 * @param content The text message to be created as a message
 * @returns returns our message object
 */
export const handleCreateMessageEvent = async (socket: Socket, roomID: string, content: string) => {
    if (!roomID) throw new Error("No roomID has been defined - This function has been aborted")
    const message = await addMessageToRoom(await socket.data.userID, roomID, content)
    console.log(message);
    if (message) {
        const filteredMessage = convertObjectIdsToStrings(message);

        socket.to(roomID).emit('message', 'addMessage', filteredMessage);
    }
    return message;
}