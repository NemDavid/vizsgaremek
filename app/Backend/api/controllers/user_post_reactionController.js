const db = require("../db");
const { user_post_reactionService } = require("../services")(db);


exports.getUsers_posts_reactions = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_reactionService.getUsers_posts_reactions());
    } catch (error) {
        next(error);
    }
};


exports.deleteUsers_posts_reaction = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_reactionService.deleteUsers_posts_reaction(req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.createUsers_posts_reaction = async (req, res, next) => {
    const { USER_ID, POST_ID, reaction } = req.body || {};
    try {
        res.status(200).json(
            await user_post_reactionService.createUsers_posts_reaction({
                USER_ID,
                POST_ID,
                reaction,
            })
        );
    } catch (error) {
        next(error);
    }
};

exports.updateUsers_posts_reaction = async (req, res, next) => {
    try {
        const updatedUser_Post_Reaction = await user_post_reactionService.updateUsers_posts_reaction(req.itemId, req.body);
        
        res.status(200).json(updatedUser_Post_Reaction);
    } catch (error) {
        next(error);
    }
};
