const db = require("../db");
const { user_post_reactionService } = require("../services")(db);


exports.getUsers_posts_reactions = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_reactionService.getUsers_posts_reactions());
    } catch (error) {
        next(error);
    }
};

exports.getUsers_posts_reaction = async (req, res, next) => {
        const token = req.cookies['user_token'];

    try {
        res.status(200).json(await user_post_reactionService.getUsers_posts_reaction(token, req.itemId));
    } catch (error) {
        next(error);
    }
};


exports.deleteUsers_posts_reaction = async (req, res, next) => {
    try {
        res.status(204).json(await user_post_reactionService.deleteUsers_posts_reaction(req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.userMakeReaction = async (req, res, next) => {
    const { POST_ID, reaction } = req.body || {};
    const token = req.cookies['user_token'];
    
    try {
        const createdUser_Post_Reaction = await user_post_reactionService.userMakeReaction({
                POST_ID,
                reaction,
            },
            token
        );

        res.status(200).json(createdUser_Post_Reaction);
    } catch (error) {
        next(error);
    }
};

exports.updateUsers_posts_reaction = async (req, res, next) => {
    const { POST_ID, reaction } = req.body || {};
    const token = req.cookies['user_token'];

    try {
        const updatedUser_Post_Reaction = await user_post_reactionService.updateUsers_posts_reaction({
            POST_ID,
            reaction,
        },
            token
    );
        
        res.status(200).json(updatedUser_Post_Reaction);
    } catch (error) {
        next(error);
    }
};
