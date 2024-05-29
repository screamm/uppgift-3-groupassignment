import mongoose, { Schema, Document } from 'mongoose';

export interface ILevel extends Document {
  name: string;
  price: number;
}

const LevelSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ILevel>('Level', LevelSchema);
