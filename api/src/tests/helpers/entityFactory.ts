import shortid from 'shortid';
import { User } from '../../models';
import authService from '../../services/authService';
import { connection } from '../../services/databaseService';

const defaultPassword = 'Test123';

const createAccount = () => {
  const newUser = new User();
  newUser.name = shortid.generate();
  newUser.email = shortid.generate() + '@email.com';

  return authService
    .encryptPassword(defaultPassword)
    .then((pass) => {
      if (!pass) {
        throw new Error('Password hashing failed');
      }
      newUser.password = pass;

      return connection().manager.save(newUser);
    });
};

export default {
  defaultPassword,
  createAccount
};
