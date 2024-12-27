import mongoose, { Schema, Document } from 'mongoose';
export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}
const ConversationSchema: Schema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  {
    timestamps: true, 
  }
);

// Tạo chỉ mục duy nhất dựa trên các participants để tránh trùng lặp cuộc trò chuyện
ConversationSchema.index(
  { participants: 1 }, 
  { unique: true } 
);

const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
export default Conversation;
