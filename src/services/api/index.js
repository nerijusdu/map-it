import account from './account';
import roadmap from './roadmap';
import category from './category';
import milestone from './milestone';
import epic from './epic';
import task from './task';
import user from './user';
import logs from './logs';
import notifications from './notifications';

export default {
  ...account,
  ...roadmap,
  ...category,
  ...milestone,
  ...epic,
  ...task,
  ...logs,
  ...user,
  ...notifications
};
