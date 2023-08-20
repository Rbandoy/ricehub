const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProfileModelSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4(),
  },
  subscriber: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
  },
});

mongoose.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

const ProfileModel = mongoose.model(
  'subscriber-profile',
  ProfileModelSchema,
  process.env.PROFILECOLLECTION,
);

module.exports = { ProfileModel, ProfileModelSchema };
