const db = require("../db");
const { user_postService } = require("../services")(db);

exports.getUser_Posts = async (req, res, next) => {
    try {
        res.status(200).json(await user_postService.getUser_Posts());
    } catch (error) {
        next(error);
    }
};

exports.getUser_PostsByLimit = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const perPage = parseInt(req.query.perPage);
        
        res.status(200).json(await user_postService.getUser_PostsByLimit(page,perPage));
    } catch (error) {
        next(error);
    }
};

exports.getUser_Posts_ByuserId = async (req, res, next) => {
    try {
        res.status(200).json(await user_postService.getUser_Posts_ByuserId(req.userId));
    } catch (error) {
        next(error);
    }
};

exports.getUser_Post_ByID = async (req, res, next) => {
    try {
        res.status(200).json(await user_postService.getUser_Post_ByID(req.postId));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser_Post = async (req, res, next) => {
    try {
        res.status(204).json(await user_postService.deleteUser_Post(req.postId));
    } catch (error) {
        next(error);
    }
};

exports.createUser_Post = async (req, res, next) => {
    const { title, content} = req.body || {};
    const token = req.cookies['user_token'];
    

    try {
        res.status(201).json(await user_postService.createUser_Post({
            token, 
            title, 
            content,  
            media_url: req.file ? `http://localhost:6769/cloud/${req.file.filename}` : undefined
        }));
    } catch (error) {
        next(error);
    }
};

exports.updateUser_Post = async (req, res, next) => {
    try {
        const updatedUser_Post = await user_postService.updateUser_Post(req.postId, req.body);
        res.status(200).json(updatedUser_Post);
    } catch (error) {
        next(error);
    }
};
