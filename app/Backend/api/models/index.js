const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = require("./User")(sequelize, DataTypes);
    const User_Profile = require("./User_Profile")(sequelize, DataTypes);
    const User_Post = require("./User_Post")(sequelize, DataTypes);
    const User_Post_Reaction = require("./User_Post_Reaction")(sequelize, DataTypes);
    const User_Post_Comment = require("./User_Post_Comment")(sequelize, DataTypes);
    const Verify_Code = require("./Verify_Code")(sequelize, DataTypes);
    const Connections = require("./Connections")(sequelize, DataTypes);
    const Settings = require("./Settings")(sequelize, DataTypes);
    const Kick = require("./Kick")(sequelize, DataTypes);
    const Advertisement = require("./Advertisement")(sequelize, DataTypes);


    // USER → PROFILE
    User.hasOne(User_Profile, {
        foreignKey: "USER_ID",
        as: "profile",
        onDelete: "CASCADE"
    });
    User_Profile.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user",
        onDelete: "CASCADE"
    });


    // USER → POSTS
    User.hasMany(User_Post, {
        foreignKey: "USER_ID",
        as: "posts",
        onDelete: "CASCADE"
    });
    User_Post.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user",
        onDelete: "CASCADE"
    });


    // USER → POST REACTIONS
    User.hasMany(User_Post_Reaction, {
        foreignKey: "USER_ID",
        as: "post_reactions",
        onDelete: "CASCADE"
    });
    User_Post_Reaction.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user",
        onDelete: "CASCADE"
    });


    // POST → REACTIONS
    User_Post.hasMany(User_Post_Reaction, {
        foreignKey: "POST_ID",
        as: "reactions",
        onDelete: "CASCADE"
    });
    User_Post_Reaction.belongsTo(User_Post, {
        foreignKey: "POST_ID",
        as: "post",
        onDelete: "CASCADE"
    });


    // USER → COMMENTS
    User.hasMany(User_Post_Comment, {
        foreignKey: "USER_ID",
        as: "post_comments",
        onDelete: "CASCADE"
    });
    User_Post_Comment.belongsTo(User, {
        foreignKey: "USER_ID",
        as: "user",
        onDelete: "CASCADE"
    });


    // POST → COMMENTS
    User_Post.hasMany(User_Post_Comment, {
        foreignKey: "POST_ID",
        as: "comments",
        onDelete: "CASCADE"
    });
    User_Post_Comment.belongsTo(User_Post, {
        foreignKey: "POST_ID",
        as: "post",
        onDelete: "CASCADE"
    });


    // CONNECTIONS
    User.hasMany(Connections, {
        foreignKey: "User_Requested_ID",
        as: "sentConnections",
        onDelete: "CASCADE"
    });

    User.hasMany(Connections, {
        foreignKey: "To_User_ID",
        as: "receivedConnections",
        onDelete: "CASCADE"
    });

    Connections.belongsTo(User, {
        foreignKey: "User_Requested_ID",
        as: "requester",
        onDelete: "CASCADE"
    });

    Connections.belongsTo(User, {
        foreignKey: "To_User_ID",
        as: "receiver",
        onDelete: "CASCADE"
    });


    // PROFILE → SETTINGS
    User_Profile.hasOne(Settings, {
        foreignKey: "ID",
        sourceKey: "USER_ID",
        as: "settings",
        onDelete: "CASCADE"
    });

    Settings.belongsTo(User_Profile, {
        foreignKey: "ID",
        targetKey: "USER_ID",
        as: "profile",
        onDelete: "CASCADE"
    });


    // KICK (many-to-many)
    User.belongsToMany(User, {
        through: Kick,
        foreignKey: "FROM_USER_ID",
        otherKey: "TO_USER_ID",
        as: "kickedUsers",
        onDelete: "CASCADE"
    });

    User.belongsToMany(User, {
        through: Kick,
        foreignKey: "TO_USER_ID",
        otherKey: "FROM_USER_ID",
        as: "kickedByUsers",
        onDelete: "CASCADE"
    });


    return {
        User,
        User_Profile,
        User_Post,
        User_Post_Reaction,
        User_Post_Comment,
        Verify_Code,
        Connections,
        Settings,
        Kick,
        Advertisement,
    };
};
