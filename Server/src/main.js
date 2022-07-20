/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import cors from 'cors';
import { env } from '@/config';
import routes from '@/routes';

function bootstrap() {
  process.stdout.write('\u001b[2J\u001b[0;0H');

  const app = express();
  app.use(helmet());
  app.use(bodyParser.json()); // easier access to params
  app.use(cors()); // enable cross origin for react app
  app.use('/', routes); // register routes

  app.listen(env.port, env.host, err => {
    if (err) {
      throw new Error('Server failed to start');
    }
    console.log(`Server is running on http://${env.host}:${env.port}`);
  });
}

bootstrap();
