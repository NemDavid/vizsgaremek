const { Sequelize } = require("sequelize");
const seedAdminUser = require("./seedAdmin")

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,

    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        logging: false
    }
);



(async () => {
    try {
        await sequelize.authenticate()
        console.log("Database connection succesfull");
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
})();


const models = require("../models")(sequelize);

const db =
{
    sequelize,
    Sequelize,
    ...models
};

(async () => {
    try {
        await db.sequelize.sync({ force: false });
        console.log("database sync OK");
        if(process.env.Seed == "true")
            await seedAdminUser(db);
    }
    catch (error) {
        console.error("database sync error:", error);
    }
})();



module.exports = db;