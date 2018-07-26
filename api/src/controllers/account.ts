import { Request, Response, Router } from 'express';
import User from '../models/user';
import authService from '../services/authService';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  User
    .findOne()
    .where('email', email)
    .then(async (user) => {
      if (!user) {
        throw new Error('Email is incorrect.');
      }
      const pass = await user.comparePasswords(password);
      if (!user || !pass) {
        throw new Error('Password is incorrect.');
      }
      return user;
    })
    .then((user) => {
      res.send({
        email: user.email,
        token: authService.createToken({ payload: user })
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

export const AccountController = router;
