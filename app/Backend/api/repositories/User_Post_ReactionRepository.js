const { DbError } = require("../errors");

class User_Post_ReactionRepository {
    constructor(db) {
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.sequelize = db.sequelize;
    }

    async getUsers_posts_reactions(options = {}) {
        try {
            return await this.User_Post_Reaction.scope("allUserPostReactionData").findAll({
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói reakciókat.", { details: error.message });
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
            throw new DbError("Nem sikerült lekérni a felhasználó reakcióját.", { details: error.message });
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
            throw new DbError("A reakció törlése sikertelen.", { details: error.message });
        }
    }

    async createUsers_posts_reaction(reactionData, options = {}) {
        
        try {
            return await this.User_Post_Reaction.create(reactionData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a reakciót.", {
                details: error.message,
                data: reactionData,
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
            throw new DbError("A reakció frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = User_Post_ReactionRepository;
