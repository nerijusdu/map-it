import { Document, model, Schema } from 'mongoose';

export interface IRoadmap extends Document {
  title: string;
  description?: string;
}

const RoadmapSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  description: String
});

export default model('Roadmap', RoadmapSchema);
