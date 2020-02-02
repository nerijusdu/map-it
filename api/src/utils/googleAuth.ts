import { Contexts, DialogflowConversation, SignIn } from 'actions-on-google';
import accountService from '../services/accountService';

export default async (conv: DialogflowConversation<unknown, unknown, Contexts>) => {
  const {payload} = conv.user.profile;
  if (!payload) {
    conv.ask(new SignIn('To access this data'));
    return null;
  }

  return accountService().getByUniqueIdentifier(payload.sub);
};
