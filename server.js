require('dotenv').config();
const express = require('express');
const mongooseInit = require('./init/mongoose-init');
const bodyParser = require('body-parser');
const logger = require('./api-helpers/logger/logger');
const { apiResponse } = require('./api-helpers/v1/message/ResponseController');
const app = express();
const routes = require('./routes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ers/api/v1', routes);

mongooseInit();

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

app.use((err, req, res, next) => {
  if (err.statusCode && err.statusCode !== 500) {
    logger.error(err);
    return res
      .status(err.statusCode)
      .json(apiResponse({ isSuccess: false, errors: err }));
  }

  res
    .status(500)
    .json(apiResponse({ isSuccess: false, errors: 'Internal Server Error' }));
});

app.listen(process.env.PORT, () => {
  logger.info(`server running on port :${process.env.PORT}`);
});
