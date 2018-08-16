import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import {PORT} from './config';
import {AccountController, RoadmapController, TaskController} from './controllers';
import * as auth from './middleware/auth';
import ErrorHandler from './middleware/errorHandler';
import * as database from './services/databaseService';

database.init();

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(auth.verifyUser);

app.use('/roadmap', RoadmapController);
app.use('/account', AccountController);
app.use('/task', TaskController);

app.use(ErrorHandler);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
