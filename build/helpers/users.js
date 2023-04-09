"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByName = exports.createNewUser = exports.getUserByID = void 0;
const default_1 = require("../modals/default");
const userContstants_1 = __importDefault(require("./../constants/userContstants"));
const getUserByID = async (id) => {
    return await default_1.UserModel.findOne({ _id: id }).exec();
};
exports.getUserByID = getUserByID;
/**
 *
 * @param name The name of the user
 * @param email the email submitted
 * @param type The type of user to be created
 * @param createdTS
 */
const createNewUser = async (name, email, type, createdTS) => {
    try {
        const user = new default_1.UserModel(Object.assign(Object.assign(Object.assign({ name: name }, (email) && { email: email }), { type: (type) ? type : userContstants_1.default.TYPE_DEFAULT }), (createdTS) && { created_ts: createdTS }));
        const userID = await user.save();
        return userID;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
};
exports.createNewUser = createNewUser;
/**
 * Get a user by the username
 * @param name The name to use in the query
 * @returns the user document
 */
const getUserByName = async (name) => {
    return await default_1.UserModel.findOne({ name: name }).exec();
};
exports.getUserByName = getUserByName;
