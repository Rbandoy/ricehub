const { apiResponse } = require('../api-helpers/v1/message/ResponseController');
const logger = require('../api-helpers/logger/logger');
const dataToSnakeCase = require('../api-helpers/lib/data_to_snake_case');
const mongoose = require('mongoose');
const { SubscriberModel } = require('../models/sample-mongoose-model/subscriber/subscriber');
const { ProfileModel } = require('../models/sample-mongoose-model/subscriber/profile');
const { AddressModel } = require('../models/sample-mongoose-model/subscriber/address');
const { v4: uuidv4 } = require('uuid');

const SubscriberController = {};

SubscriberController.get = async (req, res) => {
  const subscriberId = req.params.id;
  const full = req.query.full;

  try {
    let subscriber = await SubscriberModel.find({ id: subscriberId }).select([
      '-password',
      '-username',
      '',
    ]);
    subscriber = subscriber.map((r) => r.toJSON());
    if (!subscriber.length) throw new Error('Subscriber not found!');

    let profile = await ProfileModel.find({ subscriber: subscriberId });
    profile = profile.map((r) => r.toJSON());
    let response;

    if (!full) {
      response = { subscriber, profile };
    } else {
      let address = await AddressModel.find({ subscriber: subscriberId });
      address = address.map((r) => r.toJSON());
      response = { subscriber, profile, address };
    }

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'sucessful',
          data: response,
        }),
      ),
    );
  } catch (error) {
    logger.info(error.message);

    res.send(
      apiResponse({
        isSuccess: false,
        statusCode: 402,
        message: 'failed',
        errors: error.message,
      }),
    );
  }
};

SubscriberController.create = async (req, res) => {
  const { password, username } = req.body;

  const {
    first_name,
    last_name,
    middle_name,
    birth_date,
    gender,
    email,
    phone_number,
  } = req.body.profile;

  const {
    municipality,
    city,
    province,
    postal_code,
    street,
    municipality1,
    city1,
    province1,
    postal_code1,
    street1,
  } = req.body.address;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isUsernameExists = await SubscriberModel.find({ username });
    if (isUsernameExists.length > 0)
      throw new Error('Username Already Exists!');

    const isEmailExists = await SubscriberModel.find({
      'profile.email': email,
    });

    if (isEmailExists.length > 0)
      throw new Error('Email exists, recover account via forgot password.');

    const isPhoneNumberExists = await SubscriberModel.find({
      'profile.phone_number': phone_number,
    });

    if (isPhoneNumberExists.length > 0)
      throw new Error(
        'Phone number exists, recover account via forgot password.',
      );

    const subscriberId = uuidv4();

    const subscriberDocument = new SubscriberModel({
      id: subscriberId,
      password,
      username,
      status: 0,
    });

    const profileDocument = new ProfileModel({
      subscriber: subscriberId,
      first_name,
      last_name,
      middle_name,
      birth_date,
      gender,
      email,
      phone_number,
    });

    const addressDocument = new AddressModel({
      subscriber: subscriberId,
      municipality,
      city,
      province,
      postal_code,
      street,
      municipality1,
      city1,
      province1,
      postal_code1,
      street1,
    });

    await subscriberDocument.save({ session }),
      await profileDocument.save({ session }),
      await addressDocument.save({ session }),
      await session.commitTransaction();

    res.send(
      apiResponse({
        statusCode: 200,
        message: 'sucessful',
        data: profileDocument,
      }),
    );
  } catch (error) {
    logger.info(error.message);

    await session.abortTransaction();

    res.send(
      apiResponse({
        isSuccess: false,
        statusCode: 402,
        message: 'failed',
        errors: error.message,
      }),
    );
  } finally {
    // Close the session
    session.endSession();
  }
};

SubscriberController.updateProfile = async (req, res) => {
  const updateData = req.body.profile;
  const id = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subscriber = await SubscriberModel.find({ id });
    if (!subscriber.length) throw new Error('Subscriber not found.');

    const filter = { id };
    const update = { $set: updateData };
    const options = { new: true };

    const updatedDocument = await ProfileModel.findOneAndUpdate(
      filter,
      update,
      options,
    )
      // .select(["-password","-username",""])
      .session(session);

    await session.commitTransaction();

    res.send(
      apiResponse({
        statusCode: 200,
        message: 'sucessful',
        data: updatedDocument,
      }),
    );
  } catch (error) {
    logger.info(error.message);
    await session.abortTransaction();

    res.send(
      apiResponse({
        isSuccess: false,
        statusCode: 402,
        message: 'failed',
        errors: error.message,
      }),
    );
  } finally {
    // Close the session
    session.endSession();
  }
};

module.exports = SubscriberController;
