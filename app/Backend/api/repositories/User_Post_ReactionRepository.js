const { where } = require("sequelize");
const { DbError } = require("../errors");

class User_Post_ReactionRepository {
    constructor(db) {
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.sequelize = db.sequelize;
    }

    async getUsers_posts_reactions() {
        try {
            return await this.User_Post_Reaction.scope("allUserPostReactionData").findAll();
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
        }
    }

    async getUsers_posts_reaction(userId, postId) {
        try {
            return await this.User_Post_Reaction.scope("allUserPostReactionData").findOne({ 
                where: { 
                    USER_ID: userId,
                    POST_ID: postId 
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
        }
    }

    async deleteUsers_posts_reaction(itemId) {
        try {
            const deletedRow = await this.User_Post_Reaction.destroy({ where: { ID: itemId } });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createUsers_posts_reaction(user_post_reactionData) {
        try {
            return await this.User_Post_Reaction.create(user_post_reactionData);
        } catch (error) {
            throw new DbError("Failed to create user_post_reactionData object", {
                details: error.message,
                data: user_post_reactionData,
            });
        }
    }

    async updateUsers_posts_reaction(updateData) {
        try {
            const [affectedRows] = await this.User_Post_Reaction.update(updateData, {
                where: { ID: updateData.POST_ID },
            });
            
            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = User_Post_ReactionRepository;
