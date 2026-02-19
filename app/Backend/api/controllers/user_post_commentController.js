const db = require("../db");
const { user_post_commentService } = require("../services")(db);


exports.getUsers_posts_comments = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_commentService.getUsers_posts_comments());
    } catch (error) {
        next(error);
    }
};

exports.getUsers_posts_comment = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_commentService.getUsers_posts_comment( req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.getCommentsForPostyPostId = async (req, res, next) => {
    try {
        res.status(200).json(await user_post_commentService.getCommentsForPostyPostId( req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.deleteUsers_posts_comment = async (req, res, next) => {
    try {
        res.status(204).json(await user_post_commentService.deleteUsers_posts_comment(req.itemId));
    } catch (error) {
        next(error);
    }
};

exports.createUsers_posts_comment = async (req, res, next) => {
    const { POST_ID, comment } = req.body || {};
    const token = req.cookies['user_token'];
    
    try {
        const createdUser_Post_comment = await user_post_commentService.createUsers_posts_comment({
                POST_ID,
                comment,
            },
            token
        );

        res.status(201).json(createdUser_Post_comment);
    } catch (error) {
        next(error);
    }
};


exports.updateUsers_posts_comment = async (req, res, next) => {
    const { ID, comment } = req.body || {};
    const token = req.cookies['user_token'];

    try {
        const updatedUser_Post_comment = await user_post_commentService.updateUsers_posts_comment({
            ID,
            comment,
        },
            token
    );
        
        res.status(200).json(updatedUser_Post_comment);
    } catch (error) {
        next(error);
    }
};
