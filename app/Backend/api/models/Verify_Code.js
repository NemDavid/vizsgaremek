const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class Verify_Code extends Model { } 

    
    Verify_Code.init
    (
        {
            ID: 
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            email:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },

            verify_code_hash:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },

            used:
            {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },


            created_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            
        },

        {
            sequelize,
            modelName: "Verify_Code",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: false, 
            scopes: {
                allVerify_CodeData:{
                    attributes: ["ID", "email", "verify_code_hash", "used", "created_at"],
                }
            },
        }
    )

    return Verify_Code;
}