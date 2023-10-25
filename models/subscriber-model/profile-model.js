const Sequelize = require('sequelize')

class ProfileModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        accountId: DataTypes.STRING(255),
        first_name: DataTypes.STRING(45),
        last_name: DataTypes.STRING(45),
        middle_name: DataTypes.STRING(45),
        birth_date: DataTypes.STRING(45),
        gender: DataTypes.STRING(45),
        email: DataTypes.STRING(45),
        phone_number: DataTypes.STRING(45),
      },
      {
        modelName: 'subsprofile',
        tableName: 'subsprofile',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = ProfileModel
