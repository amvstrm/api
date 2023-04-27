import express, { json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config.js';

import { notFound, errorHandler } from './middlewares.js';
import api from './routes/index.js';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'IMPROVED amvstrm api',
    routes: {
      '/api/v1': 'gogoanime based',
      '/api/v2': 'gogoanime + anilist based',
    },
    github: 'https://github.com/amvstrm/api'
  });
});

app.use('/api', api);

app.use(notFound);
app.use(errorHandler);

export default app;
