import { BasicCard, dialogflow } from 'actions-on-google';
import moment from 'moment';
import { GoogleActionsClientId } from '../config';
import { Task } from '../models';
import resources from '../resources';
import googleAuth from '../utils/googleAuth';
import accountService from './accountService';
import categoryService from './categoryService';
import roadmapService from './roadmapService';
import taskService from './taskService';

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

  const roadmap = await roadmapService(user).getByName(params.roadmap as string);

  if (!roadmap) {
    conv.ask(resources.Assistant_EntityNotFound('roadmap'));
    return;
  }

  const categories = await categoryService(user)
    .getForRoadmap(roadmap.id);

  if (categories.length === 0) {
    conv.ask('Sorry I didn\'t find any categories for this roadmap.');
    return;
  }

  conv.ask(`Here are the categories for ${params.roadmap}`);
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
  console.log(params.title, params.category, params.roadmap);

  const roadmap = await roadmapService(user).getByName(params.roadmap as string);
  if (!roadmap) {
    conv.ask(resources.Assistant_EntityNotFound('roadmap'));
    return;
  }

  const category = await categoryService(user).getByName(params.category as string);
  if (!category) {
    conv.ask(resources.Assistant_EntityNotFound('category'));
    return;
  }

  const task = new Task();
  task.title = params.title as string;
  task.categoryId =  category.id;
  task.roadmapId = roadmap.id;
  task.startDate = moment().toDate();
  task.endDate = moment().add(1, 'day').toDate();

  const newTask = await taskService(user)
    .save(task)
    .catch((err) => {
      conv.ask(err.message);
      return null;
    });

  if (!newTask) { return; }

  conv.ask(`Created a task ${task.title} in ${roadmap.title} with category ${category.title}`);
});

export default app;
