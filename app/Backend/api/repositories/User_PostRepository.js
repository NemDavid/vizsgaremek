const { DbError } = require("../errors");
const models = require("../models");

class User_PostRepository {
    constructor(db) {
        this.User_Post = db.User_Post;
        this.User_Post_Comment = db.User_Post_Comment;
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
            throw new DbError("Failed to fetch user posts", { details: error.message });
        }
    }

    async getUser_PostsByLimit(limit) {
        try {
            return await this.User_Post.scope("allPostData").findAll({
                    order: [
                        ["created_at", "ASC"]
                    ],
                    limit: limit,
                    include: [
                        { 
                            model: this.User_Post_Comment,
                            as: "comments",
                            scope: "allUserPostCommentData",
                         }
                    ]
                });
        } catch (error) {
            throw new DbError("Failed to fetch user posts", { details: error.message });
        }
    }

    async getUser_Posts_ByuserId(userId) {
        try {
            return await this.User_Post.scope("allPostData").findOne({
                where: { USER_ID: userId }
            });
        } catch (error) {
            throw new DbError("Failed to fetch user posts", { details: error.message });
        }
    }

    async getUser_Post_ByID(postId) {
        try {
            return await this.User_Post.scope("allPostData").findOne({
                where: { ID: postId }
            });
        } catch (error) {
            throw new DbError("Failed to fetch user posts", { details: error.message });
        }
    }

    async deleteUser_Post(postId) {
        try {
            const deletedRow = await this.User_Post.destroy({ where: { ID: postId } });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createUser_Post(postData) {
        try {
            return await this.User_Post.create(postData);
        } catch (error) {
            throw new DbError("Failed to create user post object", {
                details: error.message,
                data: postData,
            });
        }
    }

    async updateUser_Post(postId, updateData) {
        try {
            const [affectedRows] = await this.User_Post.update(updateData, {
                where: { ID: postId },
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }

    ///--------------------VÉGLEGES-----------------------------
    async updateUser_POST_LikeDislike(postId, like, dislike){ // nem is hasznaljuk !!!!
        try {
            await this.User_Post.update({like,dislike},{
                where: {ID: postId}
            })

        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = User_PostRepository;
