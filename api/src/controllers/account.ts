import { Request, Response, Router } from 'express';
import User from '../models/user';
import authService from '../services/authService';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  User
    .findOne()
    .where('email', email)
    .then((user) => {
      if (!user || !user.comparePasswords(password)) {
        throw new Error('Email or password is incorrect.');
      }
      return user;
    })
    .then((user) => {
      res.send({
        token: authService.createToken({ payload: user })
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
});

export const AccountController = router;
