require('dotenv').config()
const Sequelize = require('sequelize')
const SubscriberModel = require('../models/sample-mysql-model/subscriber-model')
const ProfileModel = require('../models/sample-mysql-model/profile-model')
const AddressModel = require('../models/sample-mysql-model/address-model')
const logger = require('../api-helpers/logger/logger')
const DEFAULT_TIMEZONE = '+08:00'

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: (queryString) => logger.info(queryString),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      connectionLimit: 10,
    },
    timezone: process.env.DB_TIMEZONE || DEFAULT_TIMEZONE,
  }
)

const models = {
  SubscriberModel: SubscriberModel.init(sequelize, Sequelize),
  ProfileModel: ProfileModel.init(sequelize, Sequelize),
  AddressModel: AddressModel.init(sequelize, Sequelize),
}

/** Create relationship in ORM */
Object.values(models)
  .filter((model) => typeof model.assoc === 'function')
  .forEach((model) => model.assoc(models))

module.exports = {
  ...models,
  sequelize,
}