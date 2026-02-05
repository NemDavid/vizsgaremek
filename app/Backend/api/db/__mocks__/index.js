const { Sequelize } = require("sequelize");

// SQLite in-memory DB a teszthez
const sequelize = new Sequelize("sqlite::memory:", {
  logging: false,
  dialect: "sqlite",
});

const models = require("../../models")(sequelize);

const db = {
  sequelize,
  Sequelize,
  ...models,
};

module.exports = db;
