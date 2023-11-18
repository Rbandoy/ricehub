const Sequelize = require('sequelize')

class RegistrationVerificationModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.STRING(45),
        },
        code: DataTypes.STRING(255),
        phone: DataTypes.STRING(255),
        status: {
          type: DataTypes.STRING(255),
          defaultValue: 0,
        },
      },
      {
        modelName: 'registration_verification',
        tableName: 'registration_verification',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = RegistrationVerificationModel
