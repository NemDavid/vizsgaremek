const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class User_Post_Comment extends Model { } 

    
    User_Post_Comment.init
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

            POST_ID:
            {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

            comment:
            {
                type: DataTypes.STRING(500),
                allowNull: false,
            },

            created_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            updated_at:
            {
                type: DataTypes.DATEONLY,
                allowNull: true
            }
            
        },

        {
            sequelize,
            modelName: "User_Post_Comment",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: "updated_at", 
            scopes: {
                allUserPostCommentData:{
                    attributes: ["ID", "USER_ID", "POST_ID", "comment", "created_at", "updated_at"],
                }
            },
        }
    )

    return User_Post_Comment;
}