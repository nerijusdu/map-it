import express from 'express';
import {PORT} from './config';
import {RoadmapController} from './controllers';

const app: express.Application = express();

app.use('/roadmap', RoadmapController);

app.listen(PORT, () => {
    // Success callback
    console.log(`Listening at http://localhost:${PORT}/`);
});