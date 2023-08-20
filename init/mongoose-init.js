const mongoose = require('mongoose');
// mongoose.set('debug', true);
const logger = require('../api-helpers/logger/logger');

const mongooseInit = () => {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => logger.info('Database is connected'),
      (err) => logger.error('Failed to connect : ' + err),
    );
};

module.exports = mongooseInit;
