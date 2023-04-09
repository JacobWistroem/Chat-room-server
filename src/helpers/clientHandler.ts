import { Server, Socket } from "socket.io"
import { getAllMessagesFromRoomId, handleCreateMessageEvent } from "./messages";
import { createRoom, deleteRoomByID, getAllJoinedUsersFromRoomID, getAllRooms, getJoinedRooms, getRoomByID, joinRoomByID } from "./rooms";
import { createNewUser, getUserByName } from "./users";

/* Manage socket connections */
export const handleSocketInstances = (io: Server) => {
    io.on('connection', async (socket: Socket) => {
        console.log(`Client ${socket.id} has been connected`);
        socket.leave(socket.id);

        socket.on('getUser', async (username: string, callback) => {
            const user = await getUserByName(username);

            if (!user) {
                const newUser = await createNewUser(username);
                console.log(`New user '${newUser.name}' has been created and is now online!`)
                socket.data.userID = newUser._id
                callback(newUser);
            } else {
                console.log(`Existing user '${user.name}' has been logged in and is now online!`)
                socket.data.userID = user._id
                callback(user);
            }
        });

        socket.on("initChatRoom", async (roomID: string, callback) => {
            callback(await getAllMessagesFromRoomId(roomID));
            socket.join(roomID);
        });

        /**
         * Get further details of the specified room
         */
        socket.on("getRoom", async (roomID: string, callback) => {
            callback(await getRoomByID(roomID));
        });

        /* When requested - send all rooms */
        socket.on("getAllRooms", async (callback) => {
            callback(await getAllRooms());
        });

        /* When requested - send all rooms */
        socket.on("getJoinedUsers", async (roomID: string, callback) => {
            callback(await getAllJoinedUsersFromRoomID(roomID));
        });

        /* When requested - send all joined rooms */
        socket.on("getJoinedRooms", async (userID: string, callback) => {
            if (!userID) throw new Error("userID is empty - This function cannot continue");
            callback(await getJoinedRooms(userID));
        });

        socket.on("createRoom", async (name: string, callback) => {
            callback(await createRoom(name));
        });

        socket.on("joinRoom", async (roomID: string, userID: string, callback) => {
            callback(await joinRoomByID(roomID, userID));
        });

        socket.on("deleteRoom", async (name: string, callback) => {
            callback(await deleteRoomByID(name));
        });

        /* Create new messages from client */
        socket.on("createMessage", (content: string, roomID: string) => handleCreateMessageEvent(socket, roomID, content));


        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} has been disconnected - Reason ${reason}`);
        });
    });
};