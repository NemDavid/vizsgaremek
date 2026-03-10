const db = require("../db");
const { user_postService } = require("../services")(db);
const authUtils = require("../utilities/authUtils")

exports.getUser_Posts = async (req, res, next) => {
    try {
        res.status(200).json(await user_postService.getUser_Posts(req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUser_PostsByLimit = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const perPage = parseInt(req.query.perPage);


        res.status(200).json(await user_postService.getUser_PostsByLimit(page, perPage, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUser_Posts_ByuserId = async (req, res, next) => {
    try {
        res.status(200).json(await user_postService.getUser_Posts_ByuserId(req.userId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.getUser_Post_ByID = async (req, res, next) => {
    try {
        res.status(200).json(await user_postService.getUser_Post_ByID(req.postId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.deleteUser_Post = async (req, res, next) => {
    const user = req.user;

    try {
        res.status(200).json(await user_postService.deleteUser_Post(user, req.postId, req.transaction));
    } catch (error) {
        next(error);
    }
};

exports.createUser_Post = async (req, res, next) => {
    const { title, content } = req.body || {};
    const user = req.user;
    const baseUrl = authUtils.getBackendBaseUrl();

    try {
        res.status(201).json(await user_postService.createUser_Post({
            user,
            title,
            content,
            media_url: req.file ? `${baseUrl}/cloud/${req.file.filename}` : undefined
        },
            req.transaction,
            req,
        ));
    } catch (error) {
        next(error);
    }
};

exports.updateUser_Post = async (req, res, next) => {
    try {
        const { title, content } = req.body || {};
        const postId = req.params.postId;
        const user = req.user;
        const baseUrl = authUtils.getBackendBaseUrl();

        const mediaDeleted =
            req.body?.mediaDeleted === "true" || req.body?.mediaDeleted === true;

        let media_url =
            req.file && !mediaDeleted
                ? `${baseUrl}/cloud/${req.file.filename}`
                : undefined;

        if (mediaDeleted) media_url = "";

        const updatedUser_Post = await user_postService.updatePost(
            user,
            postId,
            { title, content, media_url },
            req.transaction,
        );

        res.status(200).json(updatedUser_Post);
    } catch (error) {
        next(error);
    }
};
