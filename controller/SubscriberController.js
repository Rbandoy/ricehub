const { apiResponse } = require('../api-helpers/v1/message/ResponseController')
const logger = require('../api-helpers/logger/logger')
const dataToSnakeCase = require('../api-helpers/lib/data_to_snake_case')
const { Op } = require('sequelize')
const {
  SubscriberModel,
  ProfileModel,
  AddressModel,
  LookupModel,
  CartModel,
  ProductModel,
  sequelize,
} = require('../init/mysql-init')
const regcodeWrapper = require('../api-helpers/lib/regcode-generator-wrapper')
const CustomError = require('../lib/customError')
const { response } = require('express')

const SubscriberController = {}

SubscriberController.get = async (req, res) => {
  logger.info('Entering - get subscriber')
  const subscriberId = req.query.subscriber_id
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
      where: { accountId: subscriberId },
      attributes: { exclude: ['subscriber', 'id'] },
      raw: true,
    })

    const address = await AddressModel.findOne({
      where: { accountId: subscriberId },
      attributes: { exclude: ['subscriber', 'id'] },
      raw: true,
    })

    let response

    if (!full) {
      response = { subscriber, profile }
    } else {
      response = { subscriber, profile, address }
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

SubscriberController.register = async (req, res) => {
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

  const transaction = await sequelize.transaction()

  try {
    const isUsernameExists = await SubscriberModel.findOne({
      where: { username: username },
      raw: true,
    })

    if (isUsernameExists) throw new Error('Please try different username!')

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
      accountId: subscriberId,
      first_name,
      last_name,
      middle_name,
      birth_date,
      gender,
      email,
      phone_number,
    })

    const addressDocument = new AddressModel({
      accountId: subscriberId,
    })

    const lookup = new LookupModel({
      accountId: subscriberId,
      username,
      email,
      phone_number,
      role: 2,
      access: 'post,put,patch,get,delete',
    })

    await subscriberDocument.save({ transaction }),
      await profileDocument.save({ transaction }),
      await addressDocument.save({ transaction }),
      await lookup.save({ transaction }),
      await transaction.commit()

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'subscriber sucessfully created!',
          data: { subscriberDocument, profileDocument, addressDocument },
        })
      )
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
        where: { accountId: id },
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

SubscriberController.updateProfileAndAddress = async (req, res) => {
  const fields = req.body.payload
  const id = req.query.subscriber_id
  logger.info('Entering - update subscriber - profile and address')
  const transaction = await sequelize.transaction()
  console.log(fields)
  try {
    const subscriber = await SubscriberModel.findOne({
      where: { id: id },
      attributes: { exclude: ['username', 'password'] },
      raw: true,
    })

    if (!subscriber) throw new Error('Subscriber not found!')

    const updatedProfileDocument = await ProfileModel.update(
      fields,
      {
        where: { accountId: id },
        raw: true,
      },
      { transaction }
    )

    const updatedAddressDocument = await AddressModel.update(
      fields,
      {
        where: { accountId: id },
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
          data: { ...updatedProfileDocument, ...updatedAddressDocument },
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
        where: { accountId: id },
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

SubscriberController.addCart = async (req, res) => {
  logger.info('Entering - add cart items')
  const { account_id, product_id, quantity } = req.body
  const transaction = await sequelize.transaction()
  try {
    const productItem = await ProductModel.findOne({
      where: {
        [Op.and]: [
          { status: 'AVAILABLE' },
          { Id: product_id },
          { stockQuantity: { [Op.ne]: 0 } },
        ],
      },
      raw: true,
    })

    if (!productItem) throw new Error('Item not available')

    console.log(productItem)
    const cartDocuments = new CartModel({
      accountId: account_id,
      productId: product_id,
      price: productItem.price,
      quantity: quantity,
      isForOrder: false,
      status: 'PENDING',
      name: productItem.name,
      weight: productItem.weight,
      unit: productItem.unit,
      featuredImage: productItem.featuredImage,
    })

    await cartDocuments.save({ transaction })
    await transaction.commit()
    logger.info('End - add cart')
    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: cartDocuments }))
    )
  } catch (error) {
    transaction.rollback()
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

SubscriberController.getCart = async (req, res) => {
  logger.info('Entering - get cart items')
  const id = req.query.subscriber_id
  try {
    const cartItems = await CartModel.findAll({
      where: { status: 'PENDING', accountId: id },
      raw: true,
    })

    if (!cartItems.length) {
      throw new CustomError('Cart Empty', 200)
    }

    logger.info('End - get cart')
    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: cartItems }))
    )
  } catch (error) {
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

SubscriberController.updateCartItemQuantity = async (req, res) => {
  logger.info('Entering - update cart items')
  const id = req.query.subscriber_id

  try {
    const cartItem = await CartModel.findByPk(req.body.id)
    await cartItem.increment('quantity', { by: req.body.quantity })
    logger.info('End - update cart')
    const cartItems = await CartModel.findAll({
      where: { status: 'PENDING', accountId: id },
      raw: true,
    })

    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: cartItems }))
    )
  } catch (error) {
    console.log(error)
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

SubscriberController.updateCartIsForOrder = async (req, res) => {
  logger.info('Entering - update cart isForOrder')
  const id = req.query.subscriber_id
  try {
    const cartItem = await CartModel.findByPk(req.body.id)
    cartItem.isForOrder = req.body.isForOrder
    await cartItem.save()
    logger.info('End - update cart isForOrder')
    const cartItems = await CartModel.findAll({
      where: { status: 'PENDING', accountId: id },
      raw: true,
    })

    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: cartItems }))
    )
  } catch (error) {
    console.log(error)
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

module.exports = SubscriberController
