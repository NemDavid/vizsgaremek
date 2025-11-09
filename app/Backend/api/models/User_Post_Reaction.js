const { Model } = require("sequelize") 

module.exports = (sequelize, DataTypes) =>
{
    class User_Post_Reaction extends Model { } 

    
    User_Post_Reaction.init
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

            reaction:
            {
                type: DataTypes.ENUM("like", "dislike"),
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
            modelName: "User_Post_Reactions",
            freezeTableName: true,
            createdAt: "created_at", 
            updatedAt: "updated_at", 
            scopes: {
                allUserPostReactionData:{
                    attributes: ["ID", "USER_ID", "POST_ID", "reaction", "created_at", "updated_at"],
                }
            },
        }
    )

    return User_Post_Reaction;
}