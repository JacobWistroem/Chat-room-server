"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDbEvents = void 0;
/* Handles all events emitted from the database */
const handleDbEvents = (io, changeStream) => {
    changeStream.on('change', async (next) => {
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
    });
};
exports.handleDbEvents = handleDbEvents;
