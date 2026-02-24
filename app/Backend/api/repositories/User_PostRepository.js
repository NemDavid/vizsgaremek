const { DbError } = require("../errors");

class User_PostRepository {
    constructor(db) {
        this.User_Post = db.User_Post;
        this.User_Post_Comment = db.User_Post_Comment;
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.sequelize = db.sequelize;
    }

    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUser_Posts() {
        try {
            return await this.User_Post.scope("allPostData").findAll({
                order: [
                    ["created_at", "ASC"]
                ],
                include: [
                    {
                        model: this.User_Post_Comment,
                        as: "comments",
                        scope: "allUserPostCommentData",
                    }
                ]
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói bejegyzéseket.", { details: error.message });
        }
    }

    async getUser_PostsByLimit(page, perPage) {
        try {
            const p = Number(page);
            const pp = Number(perPage);

            const limit = pp;
            const offset = p * pp;

            const total = await this.User_Post.count({ where: {} });

            const posts = await this.User_Post.scope("allPostData").findAll({
                order: [["ID", "DESC"]],
                limit,
                offset,
                include: [
                    {
                        model: this.User_Post_Comment,
                        as: "comments",
                        scope: "allUserPostCommentData",
                    },
                    {
                        model: this.User_Post_Reaction,
                        as: "reactions",
                        scope: "allUserPostReactionData",
                    }
                ]
            });

            const hasMore = offset + limit < total;

            return {
                data: posts,
                nextCursor: hasMore ? p + 1 : null
            };
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói bejegyzéseket.", { details: error.message });
        }
    }

    async getUser_Posts_ByuserId(userId) {
        try {
            return await this.User_Post.scope("allPostData").findAll({
                where: { USER_ID: userId }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó bejegyzéseit.", { details: error.message });
        }
    }

    async getUser_Post_ByID(postId) {
        try {
            return await this.User_Post.scope("allPostData").findOne({
                where: { ID: postId }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a bejegyzést.", { details: error.message });
        }
    }

    async deleteUser_Post(postId) {
        try {
            const deletedRow = await this.User_Post.destroy({ where: { ID: postId } });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A bejegyzés törlése sikertelen.", { details: error.message });
        }
    }

    async createUser_Post(postData, options = {}) {
        try {
            return await this.User_Post.create(postData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a bejegyzést.", {
                details: error.message,
                data: postData,
            });
        }
    }

    async updateUser_Post(postId, updateData, options = {}) {
        try {
            const [affectedRows] = await this.User_Post.update(updateData, {
                where: { ID: postId },
                transaction: options.transaction
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A bejegyzés frissítése sikertelen.", { details: error.message });
        }
    }

    async updateUser_POST_LikeDislike(postId, like, dislike) {
        try {
            await this.User_Post.update({ like, dislike }, {
                where: { ID: postId }
            });
        } catch (error) {
            throw new DbError("A bejegyzés frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = User_PostRepository;
