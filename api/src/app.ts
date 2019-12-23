import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {PORT} from './config';
import { registerControllers } from './controllers';
import * as auth from './middleware/auth';
import ErrorHandler from './middleware/errorHandler';
import * as database from './services/databaseService';
import swaggerDocument from './swagger.json';
import logger from './utils/logger';

database.init();

const app: express.Application = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(auth.verifyUser);

app.use(express.static('public'));
registerControllers(app);
app.get('/api/health', (req, res) => {
  res.json(true);
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(ErrorHandler);

if (!(process.env.NODE_ENV || '').trim().startsWith('test')) {
  app.listen(PORT, () => logger.info(`Listening at http://localhost:${PORT}/`));
}

export default app;
