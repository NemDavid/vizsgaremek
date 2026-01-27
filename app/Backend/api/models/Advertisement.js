const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class Advertisement extends Model { } 

    
    Advertisement.init
    (
        {
            ID: 
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            title:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            subject:
            {
                type: DataTypes.STRING(255),
                allowNull: true,

            },

            imagePath: 
            {
                type: DataTypes.STRING(255),
                allowNull: false
            },


            created_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
        },

        {
            sequelize,
            modelName: "Advertisements",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: false, 
            scopes: {
                allAdvertisementData:{
                    attributes: ["ID", "title", "subject", "imagePath", "created_at"],
                }
            },
        }
    )

    return Advertisement;
}