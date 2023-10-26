require('dotenv').config()
const Sequelize = require('sequelize')
const SubscriberModel = require('../models/subscriber-model/subscriber-model')
const ProfileModel = require('../models/subscriber-model/profile-model')
const AddressModel = require('../models/subscriber-model/address-model')
const TransactionModel = require('../models/transaction-model/transaction-model')
const AuthModel = require('../models/auth-model/auth-model')
const LookupModel = require('../models/lookup')
const ProductModel = require('../models/merchant-model/product-model')
const logger = require('../api-helpers/logger/logger')
const CartModel = require('../models/subscriber-model/cart-model')
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
  TransactionModel: TransactionModel.init(sequelize, Sequelize),
  AuthModel: AuthModel.init(sequelize, Sequelize),
  LookupModel: LookupModel.init(sequelize, Sequelize),
  ProductModel: ProductModel.init(sequelize, Sequelize),
  CartModel: CartModel.init(sequelize, Sequelize),
}

/** Create relationship in ORM */
Object.values(models)
  .filter((model) => typeof model.assoc === 'function')
  .forEach((model) => model.assoc(models))

module.exports = {
  ...models,
  sequelize,
}
