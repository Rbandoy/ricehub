const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const AddressModelSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  subscriber: {
    type: String,
  },
  municipality: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  municipality1: {
    type: String,
  },
  city1: {
    type: String,
  },
  province1: {
    type: String,
  },
  postal_code1: {
    type: String,
  },
  street1: {
    type: String,
  },
});

mongoose.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const AddressModel = mongoose.model(
  'subscriber-address',
  AddressModelSchema,
  process.env.ADDRESSCOLLECTION,
);

module.exports = { AddressModel, AddressModelSchema };
