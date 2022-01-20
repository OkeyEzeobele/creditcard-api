import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db';

import logger from './helpers/logger';
import routes from './routes';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 5000;

const whitelist = '*'; // process.env.CLIENT_SIDE_URLS.split(',');

const startServer = async () => {
  const app = express();
  app.enable('trust proxy');

  // const corsOptions = {
  //   origin: (origin, callback) => {
  //     if (whitelist.indexOf(origin) !== -1 || !origin) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   methods: ['GET', 'PUT', 'POST'],
  //   credentials: true,
  // };
  // app.use(cors(corsOptions));


  app.use(cors());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Routes to Restful API
  routes(app);

  app.use('*', (req, res) => res.status(404).json({ message: 'Unhandled route requested (404)' }));

  db.sequelize.sync({ force: false }).then(() => {
    app.listen(process.env.PORT || port, () => {
      logger.info(`Server running on port ${process.env.PORT || port}`);
    });
  });

};

export default startServer;
