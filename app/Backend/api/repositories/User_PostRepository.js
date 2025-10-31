const { where } = require("sequelize");
const { DbError } = require("../errors");

class User_PostRepository {
    constructor(db) {
        this.User_Post = db.User_Post;
        this.sequelize = db.sequelize;
    }

    async getUser_Posts() {
        try {
            return await this.User_Post.scope("allPostData").findAll();
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
}

module.exports = User_PostRepository;
