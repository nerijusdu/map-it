import { Document, model, Schema } from 'mongoose';
import authService from '../services/authService';
import { IRoadmap } from './roadmap';

export interface IUser extends Document {
  email: string;
  comparePasswords: (pass: string) => boolean;
  roadmaps: [IRoadmap];
}

const UserSchema = new Schema({
  email: String,
  password: {
    type: String,
    select: false
  },
  roadmaps: [{
    type: Schema.Types.ObjectId,
    ref: 'Roadmap'
  }]
});

UserSchema.methods.comparePasswords = function(pass: string) {
  return authService.verifyPassword(pass, this.password);
};

export const User =  model<IUser>('User', UserSchema);
