const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize, DataTypes);
    const User_Profile = require("./User_Profile")(sequelize, DataTypes);
    const User_Post = require("./User_Post")(sequelize, DataTypes);
    const User_Post_Reaction = require("./User_Post_Reaction")(sequelize, DataTypes);
    const User_Post_Comment = require("./User_Post_Comment")(sequelize, DataTypes);


    User.hasOne(User_Profile, {
        foreignKey: "USER_ID",
        as: "profile"
    });
    User_Profile.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user"
    });



    User.hasMany(User_Post, {
        foreignKey: "USER_ID",
        as: "post"
    });
    User_Post.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user"
    });


    User.hasMany(User_Post_Reaction, {
        foreignKey: "USER_ID",
        as: "post_reactions"
    });
    User_Post_Reaction.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user"
    });


    User_Post.hasMany(User_Post_Reaction, {
        foreignKey: "POST_ID",
        as: "reactions"
    });
    User_Post_Reaction.belongsTo(User_Post, {
        foreignKey: "POST_ID",
        as: "post"
    });


    User.hasMany(User_Post_Comment, {
        foreignKey: "USER_ID",
        as: "post_comments"
    });
    User_Post_Comment.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user"
    });


    User_Post.hasMany(User_Post_Comment, {
        foreignKey: "POST_ID",
        as: "comments"
    });
    User_Post_Comment.belongsTo(User_Post, {
        foreignKey: "POST_ID",
        as: "post"
    });

    return { User, User_Profile, User_Post, User_Post_Reaction, User_Post_Comment };
};