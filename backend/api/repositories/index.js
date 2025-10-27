const UserRepository = require("./UserRepository");
const User_ProfileRepository = require("./User_ProfileRepository");
const User_PostRepository = require("./User_PostRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);
    const user_profileRepository = new User_ProfileRepository(db);
    const user_postRepository = new User_PostRepository(db);

    return { userRepository, user_profileRepository, user_postRepository };
};