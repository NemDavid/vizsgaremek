const UserService = require("./UserService");
const User_PostService = require("./User_PostService");
const User_ProfileService = require("./User_ProfileService");
const User_Post_ReactionService = require("./User_Post_ReactionService");

module.exports = (db) =>
{
    const userService = new UserService(db);
    const user_profileService = new User_ProfileService(db);
    const user_postService = new User_PostService(db);
    const user_post_reactionService = new User_Post_ReactionService(db);

    return { userService, user_profileService, user_postService, user_post_reactionService };
};