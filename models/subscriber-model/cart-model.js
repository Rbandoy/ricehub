const Sequelize = require('sequelize')

class CartModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        accountId: DataTypes.STRING(255),
        productId: DataTypes.STRING(45),
        price: DataTypes.STRING(45),
        quantity: DataTypes.STRING(45),
        isForOrder: DataTypes.STRING(45),
        status: DataTypes.STRING(45),
        name: DataTypes.STRING(45),
        weight: DataTypes.STRING(45),
        unit: DataTypes.STRING(45),
        featuredImage: DataTypes.STRING(45),
      },
      {
        modelName: 'cart',
        tableName: 'cart',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = CartModel
