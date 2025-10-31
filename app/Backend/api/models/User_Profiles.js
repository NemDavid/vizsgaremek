const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class User_Profiles extends Model { } ;

    User_Profiles.init
    (
        {
            USER_ID: 
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                allowNull: false
            },

            display_name:
            {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            birthdate:
            {
                type: DataTypes.DATE,
                allowNull: true
            },

            birth_place:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            schools:
            {
                type: DataTypes.TEXT,
                allowNull: true
            },

            bio:
            {
                type: DataTypes.TEXT,
                allowNull: true
            },

            avatar_url:
            {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },

        {
            sequelize,
            modelName: "User_Profiles",
            freezeTableName: true,
            createdAt: false,
            updatedAt: false
        }
    );

    return User_Profiles;
};