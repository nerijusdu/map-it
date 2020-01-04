import { Router } from 'express';
import { User } from '../models';
import accountService from '../services/accountService';
import response from '../utils/response';

const router = Router();

router.post('/login', response(async (req, res) => {
  const { email, password } = req.body;

  const result = await accountService().login(email, password);
  return res.json(result);
}));

router.get('/verify', response((req, res) => {
  const result = accountService().verify(req.headers.authorization);
  return res.json(result);
}));

router.post('/refresh', response(async (req, res) => {
  const result = await accountService().refresh(req.body.email, req.body.refreshToken);
  return res.json(result);
}));

router.post('/logout', response(async (req, res) => {
  await accountService().logout(req.body.email, req.body.refreshToken);
  return res.json({});
}));

router.post('/register', response(async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.name = req.body.name;

  const result = await accountService().register(user);
  return res.json(result);
}));

export default router;
