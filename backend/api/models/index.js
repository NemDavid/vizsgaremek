const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
{
    const User = require("./User")(sequelize, DataTypes);
    const User_Profile = require("./User_Profile")(sequelize, DataTypes);
    const User_Post = require("./User_Post")(sequelize, DataTypes);


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


    return { User, User_Profile, User_Post };
};