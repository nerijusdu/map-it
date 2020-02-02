import { BasicCard, dialogflow, SignIn } from 'actions-on-google';
import { GoogleActionsClientId } from '../config';
import googleAuth from '../utils/googleAuth';
import accountService from './accountService';
import roadmapService from './roadmapService';

const app = dialogflow({
  clientId: GoogleActionsClientId
});

app.intent('Get roadmaps', async (conv) => {
  const user = await googleAuth(conv);
  if (!user) { return; }

  const roadmaps = await roadmapService(user)
    .getAll();

  conv.ask('Here are your roadmaps');
  conv.ask(new BasicCard({
    title: roadmaps.length > 0 ? 'Roadmaps:' : 'There are no roadmaps',
    text : roadmaps.map((x) => `- ${x.title}  \n`).join()
  }));
});

app.intent('Get Signin', async (conv, params, signin: any) => {
  if (signin?.status === 'OK') {
    const payload = conv.user.profile.payload!;

    const user = await accountService().getOrCreate(payload.sub, {
      email: payload.email!,
      name: payload.name!
    });

    conv.ask(`I got your account details, ${user.name}. What do you want to do next?`);
  } else {
    conv.ask(`Sorry, sign in failed.`);
  }
});

export default app;
