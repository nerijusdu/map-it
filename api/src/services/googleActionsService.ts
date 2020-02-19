import { BasicCard, dialogflow } from 'actions-on-google';
import { GoogleActionsClientId } from '../config';
import googleAuth from '../utils/googleAuth';
import accountService from './accountService';
import roadmapService from './roadmapService';
import categoryService from './categoryService';

const app = dialogflow({
  clientId: GoogleActionsClientId
});

app.fallback((conv) => {
  conv.ask(`I couldn't understand. Can you say that again?`);
});

app.intent('Get roadmaps', async (conv) => {
  const user = await googleAuth(conv);
  if (!user) { return; }

  const roadmaps = await roadmapService(user)
    .getAll();

  conv.ask('Here are your roadmaps');
  conv.ask(new BasicCard({
    title: roadmaps.length > 0 ? 'Roadmaps:' : 'There are no roadmaps.',
    text : roadmaps.map((x) => `- ${x.title}`).join('  \n')
  }));
});

app.intent('Get categories', async (conv, params) => {
  const user = await googleAuth(conv);
  if (!user) { return; }

  const roadmap = await roadmapService(user)
    .getByName(params.roadmap as string)
    .catch(() => {
      conv.ask('Sorry, I coudn\'t find this roadmap.');
      return null;
    });

  if (!roadmap) { return; }

  const categories = await categoryService(user)
    .getForRoadmap(roadmap.id);
  
  if (categories.length == 0) {
    conv.ask('Sorry I didn\'t find any categories for this roadmap.');
    return;
  }

  conv.ask('Here are your categories');
  conv.ask(new BasicCard({
    title: 'Categories:',
    text : categories.map((x) => `- ${x.title}`).join('  \n')
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

app.intent('Create a task', async (conv, params) => {
  const user = await googleAuth(conv);
  if (!user) { return; }

  console.log(params.title, params.startDate, params.endDate);
  conv.ask('Yeet!');
});

export default app;
