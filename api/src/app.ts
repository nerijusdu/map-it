import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import {PORT} from './config';
import {AccountController, CategoryController, RoadmapController, TaskController} from './controllers';
import * as auth from './middleware/auth';
import ErrorHandler from './middleware/errorHandler';
import * as database from './services/databaseService';

database.init();

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(auth.verifyUser);

app.use(express.static('public'));
app.use('/api/roadmaps', RoadmapController);
app.use('/api/account', AccountController);
app.use('/api/tasks', TaskController);
app.use('/api/categories', CategoryController);
app.get('/api/health', (req, res) => {
  res.json(true);
});

app.use(ErrorHandler);

if (!(process.env.NODE_ENV || '').trim().startsWith('test')) {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
}

export default app;
