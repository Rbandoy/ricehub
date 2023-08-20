const mongoose = require('mongoose');

const SubscriberModelSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
});

mongoose.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret._id;
    delete ret.__v;
  },
});

const SubscriberModel = mongoose.model(
  'subscriber',
  SubscriberModelSchema,
  process.env.SUBSCOLLECTION,
);

module.exports = { SubscriberModel, SubscriberModelSchema };
