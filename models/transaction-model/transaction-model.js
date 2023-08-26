const Sequelize = require('sequelize')

class TransactionModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        subscriber: DataTypes.STRING(255),
        amount: DataTypes.STRING(45),
        status: {
          type: DataTypes.STRING(45),
          defaultValue: 1,
        },
        interest: DataTypes.STRING(45),
        no_of_months: DataTypes.STRING(45),
      },
      {
        modelName: 'transaction',
        tableName: 'transaction',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = TransactionModel
