import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {PORT} from './config';
import { registerControllers } from './controllers';
import ErrorHandler from './middleware/errorHandler';
import * as database from './services/util/databaseService';
import swaggerDocument from './swagger.json';

database.init();

const app: express.Application = express();

app.use(cors());
app.use(compression());
app.use(bodyParser.json());

app.use(express.static('public'));
registerControllers(app);
app.get('/api/health', (req, res) => {
  res.json(true);
});
if (process.env.NODE_ENV !== 'prod') {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use(ErrorHandler);

if (!(process.env.NODE_ENV || '').trim().startsWith('test')) {
  app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/`));
}

export default app;
