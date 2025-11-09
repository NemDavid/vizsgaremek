const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class User_Post extends Model { } 

    
    User_Post.init
    (
        {
            ID: 
            {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            USER_ID:
            {
                type: DataTypes.BIGINT,
                allowNull: false
            },

            like:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            dislike: 
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            visibility:
            {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },

            content:
            {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            title:{
                type: DataTypes.STRING,
                allowNull: false,
            },

            media_url:
            {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: false
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
            modelName: "User_Posts",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: "updated_at", 
            scopes: {
                allPostData:{
                    attributes: ["ID", "USER_ID", "like", "dislike", "visibility", "media_url", "content", "created_at", "updated_at","title"],
                }
            },
        }
    )

    return User_Post;
}