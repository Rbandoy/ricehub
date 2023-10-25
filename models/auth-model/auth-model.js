const Sequelize = require('sequelize')

class AuthModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        token: DataTypes.STRING(500),
        type: DataTypes.STRING(255),
        status: { type: DataTypes.STRING(45), defaultValue: 1 },
      },
      {
        modelName: 'authentication',
        tableName: 'authentication',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = AuthModel
