const Sequelize = require('sequelize')

class LookupModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        accountId: DataTypes.STRING(255),
        username: DataTypes.STRING(45),
        email: DataTypes.STRING(45),
        phone_number: DataTypes.STRING(45),
        role: DataTypes.STRING(45),
        access: DataTypes.STRING(45),
      },
      {
        modelName: 'lookup',
        tableName: 'lookup',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = LookupModel
