import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  subscriptionId: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  subscriptionId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
