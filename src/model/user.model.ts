import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    avatar: {
      type: String,
      default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
