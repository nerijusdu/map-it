import { model, Schema } from 'mongoose';

const RoadmapSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required.']
    },
    description: String
});

export default model('Roadmap', RoadmapSchema);
