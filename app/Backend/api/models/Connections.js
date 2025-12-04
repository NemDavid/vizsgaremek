const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class Connections extends Model { } 

    
    Connections.init
    (
        {
            ID: 
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            User_Requested_ID:
            {
                type: DataTypes.BIGINT,
                allowNull: false
            },

            To_User_ID:
            {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            Status:
            {
                type: DataTypes.ENUM("pending", "accepted", "declined", "blocked"),
                allowNull: false,
                defaultValue: "pending"
            },
        },

        {
            sequelize,
            modelName: "Connections",
            freezeTableName: true,
            createdAt: "Added_at", 
            updatedAt: false, 
        }
    )

    return Connections;
}