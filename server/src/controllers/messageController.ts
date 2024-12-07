import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
// server/src/models/Message.ts
import { IUser } from '../models/User';

export interface IMessage extends Document {
  content: string;
  userId: PopulatedDoc<mongoose.Types.ObjectId | IUser>;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export interface IMessagePopulated extends IMessage {
  userId: IUser;
}

export default mongoose.model<IMessage>('Message', MessageSchema);