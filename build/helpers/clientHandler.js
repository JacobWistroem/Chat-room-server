"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketInstances = void 0;
const messages_1 = require("./messages");
const rooms_1 = require("./rooms");
const users_1 = require("./users");
/* Manage socket connections */
const handleSocketInstances = (io) => {
    io.on('connection', async (socket) => {
        console.log(`Client ${socket.id} has been connected`);
        socket.leave(socket.id);
        socket.on('getUser', async (username, callback) => {
            const user = await (0, users_1.getUserByName)(username);
            if (!user) {
                const newUser = await (0, users_1.createNewUser)(username);
                console.log(`New user '${newUser.name}' has been created and is now online!`);
                socket.data.userID = newUser._id;
                callback(newUser);
            }
            else {
                console.log(`Existing user '${user.name}' has been logged in and is now online!`);
                socket.data.userID = user._id;
                callback(user);
            }
        });
        socket.on("initChatRoom", async (roomID, callback) => {
            callback(await (0, messages_1.getAllMessagesFromRoomId)(roomID));
            socket.join(roomID);
        });
        /**
         * Get further details of the specified room
         */
        socket.on("getRoom", async (roomID, callback) => {
            callback(await (0, rooms_1.getRoomByID)(roomID));
        });
        /* When requested - send all rooms */
        socket.on("getAllRooms", async (callback) => {
            callback(await (0, rooms_1.getAllRooms)());
        });
        /* When requested - send all rooms */
        socket.on("getJoinedUsers", async (roomID, callback) => {
            callback(await (0, rooms_1.getAllJoinedUsersFromRoomID)(roomID));
        });
        /* When requested - send all joined rooms */
        socket.on("getJoinedRooms", async (userID, callback) => {
            if (!userID)
                throw new Error("userID is empty - This function cannot continue");
            callback(await (0, rooms_1.getJoinedRooms)(userID));
        });
        socket.on("createRoom", async (name, callback) => {
            callback(await (0, rooms_1.createRoom)(name));
        });
        socket.on("joinRoom", async (roomID, userID, callback) => {
            callback(await (0, rooms_1.joinRoomByID)(roomID, userID));
        });
        socket.on("deleteRoom", async (name, callback) => {
            callback(await (0, rooms_1.deleteRoomByID)(name));
        });
        /* Create new messages from client */
        socket.on("createMessage", (content, roomID) => (0, messages_1.handleCreateMessageEvent)(socket, roomID, content));
        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} has been disconnected - Reason ${reason}`);
        });
    });
};
exports.handleSocketInstances = handleSocketInstances;
