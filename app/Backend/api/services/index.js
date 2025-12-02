const UserService = require("./UserService");
const User_PostService = require("./User_PostService");
const User_ProfileService = require("./User_ProfileService");
const User_Post_ReactionService = require("./User_Post_ReactionService");
const User_Post_CommentService = require("./User_Post_CommentService");
const Verify_CodeService = require("./Verify_CodeService");
const NotificationService = require("./NotificationService");

module.exports = (db) =>
{
    const userService = new UserService(db);
    const user_profileService = new User_ProfileService(db);
    const user_postService = new User_PostService(db);
    const user_post_reactionService = new User_Post_ReactionService(db);
    const user_post_commentService = new User_Post_CommentService(db);
    const verify_codeService = new Verify_CodeService(db);
    const notificationService = new NotificationService(verify_codeService, userService);

    return { userService, 
        user_profileService, 
        user_postService, 
        user_post_reactionService, 
        user_post_commentService, 
        verify_codeService ,
        notificationService, 
    };
};