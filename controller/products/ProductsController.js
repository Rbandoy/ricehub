const {
  apiResponse,
} = require('../../api-helpers/v1/message/ResponseController')
const logger = require('../../api-helpers/logger/logger')
const dataToSnakeCase = require('../../api-helpers/lib/data_to_snake_case')

const { ProductModel, sequelize } = require('../../init/mysql-init')

const ProductController = {}

ProductController.getActiveProducts = async (req, res) => {
  logger.info('Entering - get active product')

  try {
    // const productInfo = await ProductModel.findAll({
    //   where: { status: 'Available' },
    //   raw: true,
    // })

    const product = [
      {
        productId: '2',
        variety: 'Basmati Rice',
        name: 'rice 22',
        totalSale: 1000,
        stock: 500,
        price: 2000,
        weight: '50',
        unit: 'kg',
        origin: 'India',
        quantity: 1,
        featuredImage:
          'https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg',
        details: 'dasdqwdasd vc cxvz xcvasdf asvzxcva sdfasdf',
      },
      {
        productId: '1',
        variety: 'Basmati Rice',
        name: 'rice',
        totalSale: 1000,
        stock: 500,
        price: 2000,
        weight: '50',
        unit: 'kg',
        origin: 'India',
        quantity: 1,
        featuredImage:
          'https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg',
        details: 'dasdqwdasd vc cxvz xcvasdf asvzxcva sdfasdf',
      },
    ]

    logger.info('End - get active product')
    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: product }))
    )
  } catch (error) {
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

module.exports = ProductController
