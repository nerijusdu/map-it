import { Document, model, Schema } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  color: string;
}

const CategorySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  color: {
    type: String,
    required: [true, 'Color is required.']
  }
});

export const Category = model<ICategory>('Category', CategorySchema);
