import { Request } from 'express';
import { IUser } from './user';

// tslint:disable-next-line:interface-name
export interface PublicRequest extends Request {
  user: IUser;
}
