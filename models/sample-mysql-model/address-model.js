const Sequelize = require('sequelize')

class AddressModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        subscriber: DataTypes.STRING(255),
        municipality: DataTypes.STRING(255),
        city: DataTypes.STRING(255),
        province: DataTypes.STRING(255),
        postal_code: DataTypes.STRING(255),
        street: DataTypes.STRING(255),
        municipality1: DataTypes.STRING(255),
        city1: DataTypes.STRING(255),
        province1: DataTypes.STRING(255),
        postal_code1: DataTypes.STRING(255),
        street1: DataTypes.STRING(255),
      },
      {
        modelName: 'subsaddress',
        tableName: 'subsaddress',
        sequelize,
        timestamps: false,
      }
    )
  }
}

module.exports = AddressModel
