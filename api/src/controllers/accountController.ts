import { Router } from 'express';
import { User } from '../models';
import accountService from '../services/accountService';
import respose from '../utils/respose';

const router = Router();

router.post('/login', respose(async (req, res) => {
  const { email, password } = req.body;

  const result = await accountService().login(email, password);
  return res.json(result);
}));

router.get('/verify', respose((req, res) => {
  const result = accountService().verify(req.headers.authorization);
  return res.json(result);
}));

router.post('/refresh', respose(async (req, res) => {
  const result = await accountService().refresh(req.body.email, req.body.refreshToken);
  return res.json(result);
}));

router.post('/logout', respose(async (req, res) => {
  await accountService().logout(req.body.email, req.body.refreshToken);
  return res.json({});
}));

router.post('/register', respose(async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.name = req.body.name;

  const result = await accountService().register(user);
  return res.json(result);
}));

router.get('/iamadmin', respose((req, res) => {
  return res.json(true);
}));

export default router;
