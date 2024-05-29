import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  subscriptionId: string;
  amount: number;
  transactionDate: Date;
  status: string;
}

const PaymentSchema: Schema = new Schema({
  userId: { type: String, required: true },
  subscriptionId: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, required: true },
  status: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
