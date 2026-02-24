const { DbError } = require("../errors");

class User_Post_CommentRepository {
    constructor(db) {
        this.User_Post_Comment = db.User_Post_Comment;
        this.sequelize = db.sequelize;
    }

    async getUsers_posts_comments(options = {}) {
        try {
            return await this.User_Post_Comment.scope("allUserPostCommentData").findAll({
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a bejegyzések hozzászólásait.", { details: error.message });
        }
    }

    async getUsers_posts_comment(itemId, options = {}) {
        try {
            return await this.User_Post_Comment.scope("allUserPostCommentData").findOne({
                where: { ID: itemId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a hozzászólást.", { details: error.message });
        }
    }

    async getCommentsForPostyPostId(postId, options = {}) {
        try {
            return await this.User_Post_Comment.scope("allUserPostCommentData").findAll({
                where: { POST_ID: postId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a hozzászólást.", { details: error.message });
        }
    }

    async deleteUsers_posts_comment(itemId, options = {}) {
        try {
            const deletedRow = await this.User_Post_Comment.destroy({
                where: { ID: itemId },
                transaction: options.transaction
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A hozzászólás törlése sikertelen.", { details: error.message });
        }
    }

    async createUsers_posts_comment(commentData, options = {}) {
        try {
            return await this.User_Post_Comment.create(commentData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a hozzászólást.", {
                details: error.message,
                data: commentData,
            });
        }
    }
}

module.exports = User_Post_CommentRepository;