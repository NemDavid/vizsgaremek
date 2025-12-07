const UserRepository = require("./UserRepository");
const User_ProfileRepository = require("./User_ProfileRepository");
const User_PostRepository = require("./User_PostRepository");
const User_Post_ReactionRepository = require("./User_Post_ReactionRepository");
const User_Post_CommentRepository = require("./User_Post_CommentRepository");
const ConnectionsRepository = require("./ConnectionsRepository");
const Verify_CodeRepository = require("./Verify_CodeRepository");

module.exports = (db) =>
{
    const userRepository = new UserRepository(db);
    const user_profileRepository = new User_ProfileRepository(db);
    const user_postRepository = new User_PostRepository(db);
    const user_post_reactionRepository = new User_Post_ReactionRepository(db);
    const user_post_commentRepository = new User_Post_CommentRepository(db);
    const connectionsRepository = new ConnectionsRepository(db);
    const verify_codeRepository = new Verify_CodeRepository(db);

    return { userRepository, 
        user_profileRepository, 
        user_postRepository, 
        user_post_reactionRepository, 
        user_post_commentRepository,
        connectionsRepository, 
        verify_codeRepository
    };
};