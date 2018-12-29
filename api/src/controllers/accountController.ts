import { Router } from 'express';
import { User } from '../models';
import accountService from '../services/accountService';

const router = Router();

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  accountService()
    .login(email, password)
    .then((result) => res.send(result))
    .catch(next);
});

router.get('/verify', (req, res) => {
  const result = accountService().verify(req.headers.authorization);

  res.send(result);
});

router.post('/register', (req, res, next) => {
  const user = new User();
  user.email = req.body.email;
  user.password = req.body.password;

  accountService()
    .register(user)
    .then((result) => res.send(result))
    .catch(next);
});

export const AccountController = router;
