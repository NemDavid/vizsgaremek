const db = require("../db");
const { user_post_reactionService } = require("../services")(db);


exports.getUsers_posts_reactions = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_reactionService.getUsers_posts_reactions(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUsers_posts_reaction = async (req, res, next) => {
    const user = req.user;

    try {
        res.status(200).json(await user_post_reactionService.getUsers_posts_reaction(user, req.itemId, req.transaction));
    } catch (error) {
        next(error);
    }
};


exports.deleteUsers_posts_reaction = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_reactionService.deleteUsers_posts_reaction(req.itemId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.userMakeReaction = async (req, res, next) => {
    const { POST_ID, reaction } = req.body || {};
    const user = req.user;

    try {
        const createdUser_Post_Reaction = await user_post_reactionService.userMakeReaction({
            POST_ID,
            reaction,
        },
            user,
            req.transaction,
            req,
        );

        res.status(200).json(createdUser_Post_Reaction);
    } catch (error) {
        next(error);
    }
};

