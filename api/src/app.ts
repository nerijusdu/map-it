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

app.use('/roadmaps', RoadmapController);
app.use('/account', AccountController);
app.use('/tasks', TaskController);
app.use('/categories', CategoryController);

app.use(ErrorHandler);

if (process.env.NODE_ENV!.trim() !== 'test') {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
}

export default app;
