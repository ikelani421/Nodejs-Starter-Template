/* eslint-disable import/no-cycle */
/* eslint-disable func-names */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import socketIO from 'socket.io';
import * as Sentry from '@sentry/node';
import envData from './configs/envData';
import v1Routes from './routes/api/v1';

dotenv.config();

Sentry.init({
  dsn: envData.SENTRY_DSN,
  environment: envData.NODE_ENV === 'production' ? 'production' : 'development'
});

const app = express();
export const socketServer = http.createServer(app);

app.use(Sentry.Handlers.requestHandler());

const corsOptions = {
  credentials: true,
};

app.use(cors(corsOptions));

app.use(morgan('dev'));

app.use(express.urlencoded({
  extended: false,
}));

app.use(express.json({
  limit: envData.MAX_FILE_SIZE || '5mb',
}));

app.use(v1Routes);

app.use(Sentry.Handlers.errorHandler());

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({

    errors: {
      message: err,
    },
  });
});

export const io = socketIO(socketServer);
io.origins('*:*');

/* eslint-disable-next-line */
socketServer.listen(envData.PORT, () => console.log(`App Listening on port ${envData.PORT}`));
export default app;
