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
                unique: true,
                allowNull: false
            },

            first_name:
            {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            last_name:
            {
                type: DataTypes.STRING(50),
                allowNull: false
            },

            birth_date:
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            birth_place:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            schools:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            bio:
            {
                type: DataTypes.STRING(255),
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
            updatedAt: false,
            scopes: {
                allUser_ProfileData:{
                    attributes: ["USER_ID", "first_name", "last_name", "birth_date", "birth_place", "schools", "bio", "avatar_url"],
                }
            },
        }
    );

    return User_Profiles;
};