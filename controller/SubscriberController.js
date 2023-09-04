const { apiResponse } = require('../api-helpers/v1/message/ResponseController')
const logger = require('../api-helpers/logger/logger')
const dataToSnakeCase = require('../api-helpers/lib/data_to_snake_case')
const {
  SubscriberModel,
  ProfileModel,
  AddressModel,
  TransactionModel,
  sequelize,
} = require('../init/mysql-init')
const regcodeWrapper = require('../api-helpers/lib/regcode-generator-wrapper')

const SubscriberController = {}

SubscriberController.get = async (req, res) => {
 
  logger.info('Entering - get subscriber')
  const subscriberId = req.params.subscriber_id
  console.log(subscriberId)
  const full = req.query.full

  try {
    const subscriber = await SubscriberModel.findOne({
      where: { id: subscriberId },
      attributes: { exclude: ['username', 'password'] },
      raw: true,
    })

    if (!subscriber) throw new Error('Subscriber not found!')

    const profile = await ProfileModel.findOne({
      where: { subscriber: subscriberId },
      attributes: { exclude: ['subscriber', 'id'] },
      raw: true,
    })

    const address = await AddressModel.findOne({
      where: { subscriber: subscriberId },
      attributes: { exclude: ['subscriber', 'id'] },
      raw: true,
    })

    let response

    if (!full) {
      response = { subscriber, profile, address }
    } else {
      const transactions = await TransactionModel.findAll({
        where: { subscriber: subscriberId, status: 1 },
        raw: true,
      })

      response = { subscriber, profile, address, transactions }
    }

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'sucessful',
          data: response,
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - get subscriber - ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

SubscriberController.fetchAll = async (req, res) => {
  logger.info('Entering - fetch all subscriber')

  try {
    const profile = await ProfileModel.findAll({
      raw: true,
    })

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'sucessful',
          data: profile,
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - get subscriber - ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

SubscriberController.create = async (req, res) => {
  const { password, username } = req.body
  logger.info('Entering - create subscriber')
  const {
    first_name,
    last_name,
    middle_name,
    birth_date,
    gender,
    email,
    phone_number,
  } = req.body.profile

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
  } = req.body.address

  const transaction = await sequelize.transaction()

  try {
    const isEmailExists = await ProfileModel.findOne({
      where: { email: email },
      raw: true,
    })

    if (isEmailExists) throw new Error('Email already exists!')

    const isPhoneNumberExists = await ProfileModel.findOne({
      where: { phone_number },
      raw: true,
    })

    if (isPhoneNumberExists) throw new Error('Phone number already exists!')

    const subscriberId = regcodeWrapper()

    const subscriberDocument = new SubscriberModel({
      id: subscriberId,
      password,
      username,
      status: 0,
    })

    const profileDocument = new ProfileModel({
      subscriber: subscriberId,
      first_name,
      last_name,
      middle_name,
      birth_date,
      gender,
      email,
      phone_number,
    })

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
    })

    await subscriberDocument.save({ transaction }),
      await profileDocument.save({ transaction }),
      await addressDocument.save({ transaction }),
      await transaction.commit()

    res.send(
      apiResponse({
        statusCode: 200,
        message: 'subscriber sucessfully created!',
        data: { subscriberDocument, profileDocument, addressDocument },
      })
    )
  } catch (error) {
    await transaction.rollback()
    logger.error(`Error on - create subscriber - ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

SubscriberController.updateProfile = async (req, res) => {
  const updateData = req.body.profile
  const id = req.query.subscriber_id
  logger.info('Entering - update subscriber - profile')
  const transaction = await sequelize.transaction()

  try {
    const subscriber = await SubscriberModel.findOne({
      where: { id: id },
      attributes: { exclude: ['username', 'password'] },
      raw: true,
    })

    if (!subscriber) throw new Error('Subscriber not found!')

    const updatedDocument = await ProfileModel.update(
      updateData,
      {
        where: { subscriber: id },
        raw: true,
      },
      { transaction }
    )

    await transaction.commit()

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'subscriber Profile sucessfully updated!',
          data: updatedDocument,
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - update subscriber - profile - ${error.message}`)
    await transaction.rollback()

    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

SubscriberController.updateAddress = async (req, res) => {
  const updateData = req.body.address
  const id = req.query.subscriber_id
  logger.info('Entering - update subscriber - address')
  const transaction = await sequelize.transaction()

  try {
    const subscriber = await SubscriberModel.findOne({
      where: { id: id },
      attributes: { exclude: ['username', 'password'] },
      raw: true,
    })

    if (!subscriber) throw new Error('Subscriber not found!')

    const updatedDocument = await AddressModel.update(
      updateData,
      {
        where: { subscriber: id },
        raw: true,
      },
      { transaction }
    )

    await transaction.commit()

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'subscriber Address sucessfully updated!',
          data: updatedDocument,
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - update subscriber - address - ${error.message}`)
    await transaction.rollback()

    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 200,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

module.exports = SubscriberController
