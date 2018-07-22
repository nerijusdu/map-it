import express from 'express';
import {PORT} from './config';
import {RoadmapController} from './controllers';
import * as database from './services/databaseService';

database.init();

const app: express.Application = express();

app.use('/roadmap', RoadmapController);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
