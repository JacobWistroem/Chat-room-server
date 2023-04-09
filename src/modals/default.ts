import { Schema, model, Document, Types } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  type: number;
  created_ts: Date;
};

export interface Message extends Document {
  user_id: User['_id'];
  created_ts: Date;
  content: string;
};

export interface Room extends Document {
  uuid: string;
  name: string;
  users: Types.ObjectId[];
  messages: Message[];
  created_ts: Date;
  status: string;
};

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: false },
  type: { type: Number, required: true },
  created_ts: { type: Date, default: Date.now },
}, { strictQuery: true });

const messageSchema = new Schema<Message>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_ts: { type: Date, default: Date.now },
  content: { type: String },
}, { strictQuery: true });

const roomSchema = new Schema<Room>({
  uuid: { type: String, required: true },
  name: { type: String, required: false },
  users: [{ type: Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  created_ts: { type: Date, default: Date.now },
  status: { type: String },
}, { strictQuery: true });

export const UserModel = model<User>('User', userSchema);
export const RoomModel = model<Room>('Room', roomSchema);
export const MessageModel = model<Message>('Message', messageSchema);
