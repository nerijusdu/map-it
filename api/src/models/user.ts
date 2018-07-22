import { Document, model, Schema } from 'mongoose';
import authService from '../services/authService';

export interface IUser extends Document {
  email: string;
  comparePasswords: (pass: string) => boolean;
}

const UserSchema = new Schema({
  email: String,
  password: String
});

UserSchema.methods.comparePasswords = function(pass: string) {
  return authService.verifyPassword(pass, this.password);
};

export default model<IUser>('User', UserSchema);
