const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class Generated_Verify_Code extends Model { } 

    
    Generated_Verify_Code.init
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

            verify_code:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            used:
            {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },


            created_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            
        },

        {
            sequelize,
            modelName: "Generated_Verify_Code",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: false, 
            scopes: {
                allGenerated_Verify_Code:{
                    attributes: [], // Define attributes as needed
                }
            },
        }
    )

    return Generated_Verify_Code;
}