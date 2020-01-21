import { dialogflow, SimpleResponse } from 'actions-on-google';

const app = dialogflow();

app.intent('Get roadmaps', (conv) => {
  conv.ask(new SimpleResponse({
    text: 'Some response text',
    speech: 'Here are your roadmaps'
  }));
});

export default app;
