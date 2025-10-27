const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class User extends Model { } 

    
    User.init
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
                type: DataTypes.STRING(255),
                allowNull: false
            },

            password_hash:
            {
                type: DataTypes.STRING(255),
                allowNull: false,

                get() {
                    return this.getDataValue("password_hash");
                },

                set(value) {

                    this.setDataValue("password_hash", value);
                }
            },

            username: 
            {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            role:
            {
                type: DataTypes.ENUM("user", "admin", "moderator", "owner"),
                allowNull: true,
                defaultValue: "user"
            },

            is_active:
            {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1
            },

            last_login:
            {
                type: DataTypes.DATEONLY,
                allowNull: true,
                defaultValue: null
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
            }
            
        },

        {
            sequelize,
            modelName: "Users",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: "updated_at", 
            scopes: {
                allUserData:{
                    attributes: ["ID", "email", "password_hash", "username", "role", "is_active", "created_at", "updated_at","last_login"],
                }
            },
        }
    )

    return User;
}