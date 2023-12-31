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
    const productInfo = await ProductModel.findAll({
      where: { status: 'Available' },
      raw: true,
    })

    const topSelling = await ProductModel.findAll({
      where: { status: 'Available' },
      order: [['totalSale', 'DESC']],
      limit: 5,
      raw: true,
    })

    const varieties = await ProductModel.findAll({
      where: { status: 'Available' },
      attributes: [
        sequelize.fn('DISTINCT', sequelize.col('variety')),
        'variety',
        'varietyFeaturedImage',
      ],
      raw: true,
    })

    const popular = await ProductModel.findAll({
      where: { status: 'Available' },
      order: [['totalSale', 'DESC']],
      limit: 1,
      raw: true,
    })

    const productData = {
      productInfo,
      topSelling,
      popular,
      varieties,
    }

    logger.info('End - get active product')
    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: productData }))
    )
  } catch (error) {
    res.send(dataToSnakeCase(apiResponse({ message: error.message })))
  }
}

ProductController.getActiveProductsById = async (req, res) => {
  logger.info('Entering - get active product by id')
  const productId = req.params.id
  try {
    const productInfo = await ProductModel.findAll({
      where: { status: 'Available', id: productId },
      raw: true,
    })
    if (!productInfo.length) throw new Error('Product not found')
    const productData = {
      productInfo,
      images: [
        'https://down-ph.img.susercontent.com/file/fe71ab436a7508aa606247d33c9ab83f',
        'https://down-ph.img.susercontent.com/file/fe71ab436a7508aa606247d33c9ab83f',
        'https://down-ph.img.susercontent.com/file/fe71ab436a7508aa606247d33c9ab83f',
        'https://down-ph.img.susercontent.com/file/fe71ab436a7508aa606247d33c9ab83f',
      ],
    }

    logger.info('End - get active product by id ')
    res.send(
      dataToSnakeCase(apiResponse({ message: 'success', data: productData }))
    )
  } catch (error) {
    res.send(
      dataToSnakeCase(apiResponse({ isSuccess: false, message: error.message }))
    )
  }
}

module.exports = ProductController
