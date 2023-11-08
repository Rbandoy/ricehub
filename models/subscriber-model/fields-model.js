const Sequelize = require('sequelize')

class FieldsModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.STRING(45),
        },
        name: DataTypes.STRING(255),
        type: DataTypes.STRING(255),
        min: DataTypes.STRING(255),
        max: DataTypes.STRING(255),
      },
      {
        modelName: 'fields',
        tableName: 'fields',
        sequelize,
        timestamps: true,
      }
    )
  }
}

module.exports = FieldsModel
