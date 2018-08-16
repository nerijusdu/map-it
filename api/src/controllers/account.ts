import { Request, Response, Router } from 'express';
import { User } from '../models';
import authService from '../services/authService';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  User
    .findOne()
    .where('email', email)
    .select('+password')
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

router.get('/verify', (req: Request, res: Response) => {
  const tokenStr = (req.headers.authorization || '').substring('Bearer '.length);

  const user = authService.getPayload(tokenStr);

  res.send({
    email: user.email,
    token: tokenStr
  });
});

export const AccountController = router;
