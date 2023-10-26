const Sequelize = require('sequelize')
class ProductModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        variety: DataTypes.STRING(100),
        description: DataTypes.STRING(100),
        grainType: DataTypes.STRING(100),
        millingRate: DataTypes.STRING(100),
        price: DataTypes.STRING(100),
        stockQuantity: DataTypes.STRING(100),
        productionDate: DataTypes.STRING(100),
        expiryDate: DataTypes.STRING(100),
        countryOfOrigin: DataTypes.STRING(100),
        merchantId: DataTypes.STRING(100),
        status: DataTypes.STRING(100),
        productBatchId: DataTypes.STRING(100),
        variety: DataTypes.STRING(100),
        name:  DataTypes.STRING(100),
        totalSale:  DataTypes.STRING(100),
        stock:  DataTypes.STRING(100),
        price:  DataTypes.STRING(100),
        weight:  DataTypes.STRING(100),
        unit:  DataTypes.STRING(100),
        origin:  DataTypes.STRING(100),
        quantity:  DataTypes.STRING(100),
        featuredImage: DataTypes.STRING(250),
        details:  DataTypes.STRING(250),
        varietyFeaturedImage: DataTypes.STRING(250),
      },
      {
        modelName: 'product',
        tableName: 'product',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = ProductModel
