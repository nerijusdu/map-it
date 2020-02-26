import { Router } from 'express';
import { User } from '../models';
import accountService from '../services/accountService';
import googleAuthService from '../services/googleAuthService';
import response from '../utils/response';

const router = Router();

router.post('/login', response(async (req, res) => {
  const { email, password, code } = req.body;

  const result = code
    ? await accountService().loginWithCode(code)
    : await accountService().login(email, password);

  return res.json(result);
}, { isPublic: true }));

router.get('/verify', response((req, res) => {
  const result = accountService().verify(req.headers.authorization);
  return res.json(result);
}));

router.post('/refresh', response(async (req, res) => {
  const result = await accountService().refresh(req.body.email, req.body.refreshToken);
  return res.json(result);
}, { isPublic: true }));

router.post('/logout', response(async (req, res) => {
  await accountService().logout(req.body.email, req.body.refreshToken);
  return res.json({});
}, { isPublic: true }));

router.post('/register', response(async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.name = req.body.name;

  const result = await accountService().register(user);
  return res.json(result);
}, { isPublic: true }));

router.get('/callback', response(async (req, res) => {
  const redirectUrl = await googleAuthService().handleCallBack(req.query);

  res.redirect(redirectUrl);
}, { isPublic: true }));

router.get('/settings', response(async (req, res) => {
  const result = await accountService(req.user).getSettings();
  return res.json(result);
}));

export default router;
