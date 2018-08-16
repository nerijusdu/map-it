import { Document, model, Schema } from 'mongoose';
import { ICategory, ITask } from './';

export interface IRoadmap extends Document {
  title: string;
  description?: string;
  tasks: [ITask];
  categories: [ICategory];
}

const RoadmapSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  description: String,
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  ownerId: {
    type: String,
    select: false
  }
});

export const Roadmap = model<IRoadmap>('Roadmap', RoadmapSchema);
