import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  level: string;
  description: string;
  title: string;
  createdAt: Date;
}

const ArticleSchema: Schema = new Schema({
  level: { type: String, required: true },
  description: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IArticle>('Article', ArticleSchema);