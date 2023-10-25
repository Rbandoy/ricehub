const {
  apiResponse,
} = require('../../api-helpers/v1/message/ResponseController')
const logger = require('../../api-helpers/logger/logger')
const dataToSnakeCase = require('../../api-helpers/lib/data_to_snake_case')

const { ProductModel, sequelize } = require('../../init/mysql-init')
const productIdWrapper = require('../../api-helpers/lib/productId-generator-wrapper')

const MerchantController = {}

MerchantController.postProduct = async (req, res) => {
  logger.info('Entering - post merchant product')

  const {
    variety,
    description,
    grainType,
    millingRate,
    price,
    stockQuantity,
    productionDate,
    expiryDate,
    countryOfOrigin,
    merchantId,
  } = req.body

  const transaction = await sequelize.transaction()
  try {
    const productBatchId = productIdWrapper()

    const productDocuments = new ProductModel({
      variety,
      description,
      grainType,
      millingRate,
      price,
      stockQuantity,
      productionDate,
      expiryDate,
      countryOfOrigin,
      merchantId,
      productBatchId,
    })

    await productDocuments.save({ transaction }), await transaction.commit()

    logger.info('End - post merchant product')
    res.send(
      dataToSnakeCase(
        apiResponse({ message: 'Successfully Posted!', data: productDocuments })
      )
    )
  } catch (error) {
    logger.info('Error - post merchant product')
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

MerchantController.getProductByBatchNo = async (req, res) => {
  logger.info('Entering - get merchant product by batchId')

  const { product_batch_id } = req.body

  try {
    const productInfo = await ProductModel.findAll({
      where: { productBatchId: product_batch_id },
      raw: true,
    })

    logger.info('End - get merchant product  by batchId')
    res.send(apiResponse({ message: 'success', data: productInfo }))
  } catch (error) {
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

MerchantController.getProducts = async (req, res) => {
  logger.info('Entering - get merchant product')

  const { query } = req.body

  try {
    const productInfo = await ProductModel.findAll({
      where: query,
      raw: true,
    })

    logger.info('End - get merchant product')
    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: productInfo }))
    )
  } catch (error) {
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

module.exports = MerchantController
