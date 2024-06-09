import { ISubscription } from './Subscription';
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import Subscription from '../models/Subscription'; // Import the Subscription model

export interface IUser extends Document {
  _id: string;
  subscriptionId: string; // Add a subscriptionId field to store the Subscription document ID
  subscription: ISubscription; // Add a subscription field to store the associated Subscription document
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  stripeId: string;
  stripeSessionId?: string; // Add stripeSessionId to store the Stripe session ID
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  subscriptionId: { type: String },
  subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' }, // Add a subscription field to store the associated Subscription document
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  stripeId: { type: String },
  stripeSessionId: { type: String }, // Add stripeSessionId field
}, {
  timestamps: true,
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('stripeId')) {
    return next();
  }

  const subscription = await Subscription.findOne({ userId: this._id });
  if (subscription) {
    subscription.stripeId = this.stripeId;
    await subscription.save();
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);


// import { ISubscription } from './Subscription';
// import mongoose, { Schema, Document } from 'mongoose';
// import bcrypt from 'bcryptjs';
// import Subscription from '../models/Subscription'; // Import the Subscription model

// export interface IUser extends Document {
//   _id: string;
//   subscriptionId: string; // Add a subscriptionId field to store the Subscription document ID
//   subscription: ISubscription; // Add a subscription field to store the associated Subscription document
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
//   role: string;
//   stripeId: string;
//   matchPassword(enteredPassword: string): Promise<boolean>;
// }

// const UserSchema: Schema<IUser> = new Schema({
//   subscriptionId: { type: String },
//   subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' }, // Add a subscription field to store the associated Subscription document
//   email: { type: String, required: true, unique: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   password: { type: String, required: true },
//   role: { type: String, required: true },
//   stripeId: { type: String },
// }, {
//   timestamps: true,
// });

// UserSchema.methods.matchPassword = async function (enteredPassword: string) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// UserSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// UserSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('stripeId')) {
//     return next();
//   }

//   const subscription = await Subscription.findOne({ userId: this._id });
//   if (subscription) {
//     subscription.stripeId = this.stripeId;
//     await subscription.save();
//   }
//   next();
// });

// export default mongoose.model<IUser>('User', UserSchema);