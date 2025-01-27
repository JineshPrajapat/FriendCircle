import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  userName: string;
  fullName: string;
  password: string;
  profileImage: string;
  friends: mongoose.Types.ObjectId[];
  freindRequestSent: mongoose.Types.ObjectId[];
  friendRequestRecieved: mongoose.Types.ObjectId[];
  interest: string[];
  refreshToken: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date;
}

const UserSchema: Schema = new Schema({
  userName: {
    type: String,
    require: true,
    unique:true,
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  fullName: {
    type: String,
    require: true
  },
  profileImage: {
    type: String,
    // require: true
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  freindRequestSent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  friendRequestRecieved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  interest: [
    {
      type: String
    }
  ],

},
  {
    timestamps: true
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
