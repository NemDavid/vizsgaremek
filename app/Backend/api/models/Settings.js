const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    class Settings extends Model { }


    Settings.init
        (
            {
                ID:
                {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                new_post: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

                new_comment_on_post: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

                new_reaction_on_post: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

                new_login: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },

                new_friend_request: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

                consent_given: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },

            {
                sequelize,
                modelName: "Settings",
                freezeTableName: true,
                createdAt: false,
                updatedAt: false,
            }
        )

    return Settings;
}