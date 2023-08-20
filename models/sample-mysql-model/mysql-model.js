const Sequelize = require('sequelize')

class SampleModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        msisdn: DataTypes.STRING(255),
        group_id: { type: DataTypes.STRING(45), allowNull: false },
        offer: DataTypes.STRING(255),
        plan: DataTypes.STRING(255),
        is_dipping: DataTypes.STRING(45),
        data_quota: DataTypes.BIGINT(11),
        pre_data: DataTypes.BIGINT(11),
        post_data: DataTypes.BIGINT(11),
        amount: DataTypes.DECIMAL(10, 6),
        account_type: DataTypes.STRING(255),
        pre_unbilled: DataTypes.DECIMAL(10,6),
        post_unbilled: DataTypes.DECIMAL(10,6),
        account_number: DataTypes.STRING(255),
        expiry_date: { type: DataTypes.DATE, allowNull: false }
      },
      {
        modelName: 'ugw_event_log',
        tableName: 'ugw_event_log',
        sequelize,
        timestamps: false,
      }
    )
  }
}

module.exports = SampleModel
