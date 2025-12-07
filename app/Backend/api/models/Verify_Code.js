const { Model, DATE } = require("sequelize") 

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
                unique: true,
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

            expire_at:
            {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: () => new Date(Date.now() + 5 * 60 * 1000) // 5 perc
            },

            created_at:
            {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW
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
                    attributes: ["ID", "email", "verify_code_hash", "used", "expire_at", "created_at"],
                }
            },
        }
    )

    return Verify_Code;
}