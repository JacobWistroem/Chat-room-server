import { User, UserModel } from "../modals/default"
import userTypes from "./../constants/userContstants"

export const getUserByID = async (id: string): Promise<User | null> => {
    return await UserModel.findOne({ _id: id }).exec();
}

/**
 * 
 * @param name The name of the user
 * @param email the email submitted
 * @param type The type of user to be created
 * @param createdTS 
 */
export const createNewUser = async (name: string, email?: string, type?: number, createdTS?: Date): Promise<User> => {
    try {
        const user = new UserModel({
            name: name,
            ...(email) && { email: email },
            type: (type) ? type : userTypes.TYPE_DEFAULT,
            ...(createdTS) && { created_ts: createdTS }
        });
        const userID = await user.save();

        return userID;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

/**
 * Get a user by the username
 * @param name The name to use in the query
 * @returns the user document
 */
export const getUserByName = async (name: string): Promise<User | null> => {
    return await UserModel.findOne({ name: name }).exec();
}