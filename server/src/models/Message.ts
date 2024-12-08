import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { IUser } from './User';

export interface IMessage extends Document {
  content: string;
  userId: PopulatedDoc<IUser & mongoose.Document>;
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
  userId: IUser; // Esto asegura que userId es del tipo IUser cuando se utiliza populate
}

export default mongoose.model<IMessage>('Message', MessageSchema);