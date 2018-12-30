import { User } from '../../models';

declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
       user?: User;
    }
  }
}
