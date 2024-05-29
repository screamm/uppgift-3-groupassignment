import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  level: string;
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
}

const SubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  level: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
