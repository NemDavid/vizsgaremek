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
                    allowNull: false
                },
                Notifications: {
                    type: DataTypes.JSON,
                    allowNull: false,
                    defaultValue: {
                        "new_post": false,
                        "new_comment_on_post": true,
                        "new_reaction_on_post": true,
                        "new_login": true,
                        "new_friend_request": false,
                    }
                },
                DataPrivacy: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                }
            },

            {
                sequelize,
                modelName: "Settings",
                freezeTableName: true,
                createdAt: false,
                updatedAt: false,
                scopes: {
                    allUser_SettingsData: {
                        attributes: ["ID", "Notifications","DataPrivacy"],
                    }
                },
            }
        )

    return Settings;
}