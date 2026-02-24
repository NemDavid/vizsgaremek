const { DbError } = require("../errors");

class User_PostRepository {
    constructor(db) {
        this.User_Post = db.User_Post;
        this.User_Post_Comment = db.User_Post_Comment;
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.sequelize = db.sequelize;
    }

    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUser_Posts(options = {}) {
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
                ],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói bejegyzéseket.", { details: error.message });
        }
    }

    async getUser_PostsByLimit(page, perPage, options = {}) {
        try {
            const p = Number(page);
            const pp = Number(perPage);

            const limit = pp;
            const offset = p * pp;

            const total = await this.User_Post.count({ where: {}, transaction: options.transaction });

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
                ],

                transaction: options.transaction
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

    async getUser_Posts_ByuserId(userId, options = {}) {
        try {
            return await this.User_Post.scope("allPostData").findAll({
                where: { USER_ID: userId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó bejegyzéseit.", { details: error.message });
        }
    }

    async getUser_Post_ByID(postId, options = {}) {
        try {
            const result = await this.User_Post.scope("allPostData").findOne({
                where: { ID: postId },
                transaction: options.transaction
            });

            return result;
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a bejegyzést.", { details: error.message });
        }
    }

    async deleteUser_Post(postId, options = {}) {
        try {
            const deletedRow = await this.User_Post.destroy({
                where: { ID: postId },
                transaction: options.transaction
            });

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
            console.log("postId:", postId, typeof postId)
            const [affectedRows] = await this.User_Post.update(updateData, {
                where: { ID: BigInt(postId) },
                transaction: options.transaction
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A bejegyzés frissítése sikertelen.", { details: error.message });
        }
    }

    async updateUser_POST_LikeDislike(postId, like, dislike, options = {}) {
        try {
            await this.User_Post.update({ like, dislike }, {
                where: { ID: postId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("A bejegyzés frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = User_PostRepository;
