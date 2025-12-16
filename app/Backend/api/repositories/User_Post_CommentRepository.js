const { DbError } = require("../errors");

class User_Post_CommentRepository {
    constructor(db) {
        this.User_Post_Comment = db.User_Post_Comment;
        this.sequelize = db.sequelize;
    }

    async getUsers_posts_comments() {
        try {
            return await this.User_Post_Comment.scope("allUserPostCommentData").findAll();
        } catch (error) {
            throw new DbError("Failed to fetch User_Post_Comment", { details: error.message });
        }
    }

    async getUsers_posts_comment(itemId) {
        try {
            return await this.User_Post_Comment.scope("allUserPostCommentData").findOne({ 
                where: { 
                    ID: itemId 
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch User_Post_Comment", { details: error.message });
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
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createUsers_posts_comment(commentData, options = {}) {
        try {
            return await this.User_Post_Comment.create(commentData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Failed to create user_post_commentData object", {
                details: error.message,
                data: commentData,
            });
        }
    }

    async updateUsers_posts_comment(updateData, options = {}) {
        try {
            const [affectedRows] = await this.User_Post_Comment.update(updateData, {
                where: {
                    ID: updateData.ID,
                },
                transaction: options.transaction
            });
            
            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = User_Post_CommentRepository;