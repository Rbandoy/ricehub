const Sequelize = require('sequelize')

class SubscriberModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.STRING(45),
        },
        username: DataTypes.STRING(255),
        password: DataTypes.STRING(255),
        status: DataTypes.STRING(45),
      },
      {
        modelName: 'subscriber',
        tableName: 'subscriber',
        sequelize,
        timestamps: false,
      }
    )
  }
}

module.exports = SubscriberModel
