const { DbError } = require("../errors");

class User_Post_ReactionRepository {
    constructor(db) {
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.sequelize = db.sequelize;
    }

    async getUsers_posts_reactions() {
        try {
            return await this.User_Post_Reaction.scope("allUserPostReactionData").findAll({
                transaction: options.transaction 
            });
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
        }
    }

    async getUsers_posts_reaction(userId, postId, options = {}) {
        try {
            return await this.User_Post_Reaction.scope("allUserPostReactionData").findOne({ 
                where: { 
                    USER_ID: userId,
                    POST_ID: postId 
                },
                transaction: options.transaction 
            });
        } catch (error) {
            throw new DbError("Failed to fetch users reaction", { details: error.message });
        }
    }

    async deleteUsers_posts_reaction(itemId, options = {}) {
        try {
            const deletedRow = await this.User_Post_Reaction.destroy({ 
                where: { ID: itemId },
                transaction: options.transaction 
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createUsers_posts_reaction(reactionData, options = {}) {
        try {
            return await this.User_Post_Reaction.create(reactionData, {
                transaction: options.transaction 
            });
        } catch (error) {
            throw new DbError("Failed to create user_post_reactionData object", {
                details: error.message,
                data: user_post_reactionData,
            });
        }
    }

    async updateUsers_posts_reaction(updateData, options = {}) {
        try {
            const [affectedRows] = await this.User_Post_Reaction.update(updateData, {
                where: {
                    POST_ID: updateData.POST_ID,
                    USER_ID: updateData.USER_ID,
                },
                transaction: options.transaction 
            });
            
            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = User_Post_ReactionRepository;
