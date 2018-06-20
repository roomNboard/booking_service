const express = require('express');
const debug = require('debug')('app:*');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

const roomRoutes = require('./api/routes/booking');

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  debug('morgan enabled...');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/:id', express.static(path.join(__dirname, '../public/dist')));

app.use('/booking', roomRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 3002;
const server = http.createServer(app);
server.listen(PORT, () => debug(`listening on port ${PORT}...`));
