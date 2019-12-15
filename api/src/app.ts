import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {PORT} from './config';
import {
  AccountController,
  CategoryController,
  EpicController,
  MilestoneController,
  RoadmapController,
  TaskController,
  UserController
} from './controllers';
import * as auth from './middleware/auth';
import ErrorHandler from './middleware/errorHandler';
import * as database from './services/databaseService';
import swaggerDocument from './swagger.json';

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
app.use('/api/milestones', MilestoneController);
app.use('/api/epics', EpicController);
app.use('/api/users', UserController);
app.get('/api/health', (req, res) => {
  res.json(true);
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(ErrorHandler);

if (!(process.env.NODE_ENV || '').trim().startsWith('test')) {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
}

export default app;
