import account from './account';
import roadmap from './roadmap';
import category from './category';
import milestone from './milestone';
import epic from './epic';
import task from './task';

export default {
  ...account,
  ...roadmap,
  ...category,
  ...milestone,
  ...epic,
  ...task
};
