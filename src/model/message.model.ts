import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  messageType: string; 
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'], 
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
