import { Router } from 'express';
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

export const AccountController = router;
