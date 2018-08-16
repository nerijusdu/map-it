import { Document, model, Schema } from 'mongoose';
import { ICategory } from './';

export interface ITask extends Document {
  title: string;
  description?: string;
  category: ICategory;
  startDate: Date;
  endDate: Date;
}

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  description: String,
  startDate: Schema.Types.Date,
  endDate: Schema.Types.Date,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  ownerId: {
    type: String,
    select: false
  }
});

export const Task = model<ITask>('Task', TaskSchema);
