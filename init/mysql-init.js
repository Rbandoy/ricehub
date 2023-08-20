require("dotenv").config();
const Sequelize = require("sequelize");
const DEFAULT_TIMEZONE = "+08:00";

const sequelize = new Sequelize(
  process.env.DB_WSDF_NAME,
  process.env.DB_WSDF_USER,
  process.env.DB_WSDF_PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      connectionLimit: 10,
    },
    timezone: process.env.DB_TIMEZONE || DEFAULT_TIMEZONE
  }
);

const SampleModel = require("../models/sample-mysql-model/mysql-model");

const models = {
  SampleModel: SampleModel.init(sequelize, Sequelize)
};

/** Create relationship in ORM */
Object.values(models)
  .filter((model) => typeof model.assoc === "function")
  .forEach((model) => model.assoc(models));

module.exports = {
  ...models,
  sequelize,
};
