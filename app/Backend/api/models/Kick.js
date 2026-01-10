const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class Kick extends Model { } 

    
    Kick.init
    (
        {
            ID: 
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            FROM_USER_ID:
            {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            
            TO_USER_ID:
            {
                type: DataTypes.BIGINT,
                allowNull: false
            },

            created_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            updated_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            
        },

        {
            sequelize,
            modelName: "Kicks",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: "updated_at", 
            scopes: {
                allKickData:{
                    attributes: ["ID", "FROM_USER_ID", "TO_USER_ID", "created_at", "updated_at","last_login"],
                }
            },
        }
    )

    return Kick;
}