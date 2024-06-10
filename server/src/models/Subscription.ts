import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  level: mongoose.Types.ObjectId; 
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  stripeId: string;
}

const SubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'level', required: true }, // Adjusted to ObjectId
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true },
  stripeId: { type: String, required: true },
}, {
  timestamps: true
});


export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
