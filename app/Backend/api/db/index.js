const { Sequelize } = require("sequelize");

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

(async () => 
{
    try 
    {
        await sequelize.authenticate()

        console.log("Database connection succesfull");
    } 
    catch (error) {
        console.log("Database connection failed");
    }
})();


const models = require("../models")(sequelize);

const db = 
{
    sequelize,
    Sequelize,
    ...models
};

(async () =>
{
    try 
    {
        await db.sequelize.sync( {force: true } )
        console.log("database sync OK");
    } 
    catch (error) {
        console.log("database synk error");
    }
})();



module.exports = db;