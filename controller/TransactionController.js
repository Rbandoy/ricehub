const { apiResponse } = require('../api-helpers/v1/message/ResponseController')
const logger = require('../api-helpers/logger/logger')
const dataToSnakeCase = require('../api-helpers/lib/data_to_snake_case')
const {
  SubscriberModel,
  TransactionModel,
  sequelize,
} = require('../init/mysql-init')
const isEmpty = require('../api-helpers/lib/isEmpty')
const computation = require('../api-helpers/lib/computation')

const TransactionController = {}

TransactionController.create = async (req, res) => {
  logger.info('Entering - create transaction subscriber')
  const { subscriber_id, amount, no_of_months, interest } = req.body

  const transaction = await sequelize.transaction()

  try {
    const subscriber = await SubscriberModel.findOne({
      where: { id: subscriber_id },
      attributes: { exclude: ['username', 'password'] },
      raw: true,
    })

    if (isEmpty(subscriber)) {
      throw new Error('Subscriber not found!')
    }

    if (subscriber.status === 0) {
      throw new Error('Subscriber is not verified!')
    } else if (subscriber.status === 2) {
      throw new Error('Subscriber has existing loan!')
    } else if (subscriber.status > 2) {
      throw new Error('Invalid subscriber status!')
    }

    const TransactionDocument = new TransactionModel({
      subscriber: subscriber_id,
      amount,
      no_of_months,
      interest,
    })

    await SubscriberModel.update(
      {
        status: 2,
      },
      {
        where: { Id: subscriber_id },
        raw: true,
      },
      { transaction }
    )

    await TransactionDocument.save({ transaction })
    await transaction.commit()

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'sucessful',
          data: subscriber,
        })
      )
    )
  } catch (error) {
    await transaction.rollback()
    logger.error(`Error on - create transaction subscriber - ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 402,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

TransactionController.get = async (req, res) => {
  logger.info('Entering - get subscriber transactions')
  const subscriberId = req.query.subscriber_id

  try {
    const subscriber = await SubscriberModel.findOne({
      where: { Id: subscriberId },
      attributes: { exclude: ['username', 'password'] },
      raw: true,
    })

    if (!subscriber) throw new Error('Subscriber not found!')

    const transactions = await TransactionModel.findOne({
      where: { subscriber: subscriberId, status: 1 },
      raw: true,
    })

    const amortization = computation(
      transactions.amount,
      transactions.interest,
      transactions.no_of_months,
      transactions.createdAt
    )

    res.send(
      dataToSnakeCase(
        apiResponse({
          statusCode: 200,
          message: 'sucessful',
          data: amortization,
        })
      )
    )
  } catch (error) {
    logger.info(`Error on - get subscriber - ${error.message}`)
    res.send(
      dataToSnakeCase(
        apiResponse({
          isSuccess: false,
          statusCode: 402,
          message: error.message,
          errors: 'failed',
        })
      )
    )
  }
}

module.exports = TransactionController
