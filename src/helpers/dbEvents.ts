import { Server } from "socket.io";
import { ChangeStream } from "mongodb";


/* Handles all events emitted from the database */
export const handleDbEvents = (io: Server, changeStream: ChangeStream) => {
    changeStream.on('change', async next => {
        switch (next.operationType) {
            case 'insert': {
                io.emit('message', 'addMessage', next.fullDocument);
                break;
            }
            case 'update': {
                console.log('Update', next.fullDocument);
                break;
            }
        }
    })
};