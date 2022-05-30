import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morganBody from 'morgan-body';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import routes from './routes';
import swaggerOptions from './config/swagger';
import middlewares from './middlewares';
import mongoose from 'mongoose';



const app = express();
app.server = http.createServer(app);

const { errorHandler } = middlewares.errorHandler;
const isProduction = process.env.NODE_ENV === 'production';

// middleware
app.use(cors());

// swagger Documentation
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const swaggerUiHandler = swaggerUi.setup(swaggerSpec);
const docsJsonPath = '/api-docs.json';

app.get(docsJsonPath, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/docs', swaggerUi.serve, (req, res, next) => {
  if (!req.query.url) {
    res.redirect(
      `/docs?url=${req.protocol}://${req.headers.host}${docsJsonPath}`
    );
  } else {
    swaggerUiHandler(req, res);
  }
});

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);
// app.use(express.urlencoded({ extended: true }));

// hook morganBody to express app
if (isProduction) {
  morganBody(app);
}

// connect to database
if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI).then(
    () => {
      console.log('Database connected successfully');
    },
    err => {
      console.log('ERROR!!! While connecting to the database');
      console.log(err);
    }
  );
} else {
  mongoose.connect('mongodb://localhost/together').then(
    () => {
      console.log('Database connected successfully');
    },
    err => {
      console.log('ERROR!!! While connecting to the database');
      console.log(err);
    }
  );
  mongoose.set('debug', true);
  mongoose.connection.on('disconnected', () => {
    console.log('Database loss connection');
  });
  mongoose.connection.on('reconnect', () => {
    console.log('Database reconnected');
  });
  mongoose.connection.on('reconnectFailed', () => {
    console.log('Failed to reconnect database');
  });
}


// api routes to /api
app.use('/api', routes);

// global error handler function
app.use(errorHandler);

app.server.listen(config.port);

console.log(`Started on 'http://localhost:${app.server.address().port}'`);

export default app;
