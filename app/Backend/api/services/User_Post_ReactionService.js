const { BadRequestError } = require("../errors");

class User_Post_ReactionService {
    constructor(db) {
        this.user_post_reactionRepository = require("../repositories")(db).user_post_reactionRepository;
    }

    async getUsers_posts_reactions() {
        return await this.user_post_reactionRepository.getUsers_posts_reactions();
    }

    async getUsers_posts_reaction(itemId) {
        return await this.user_post_reactionRepository.getUsers_posts_reaction(itemId);
    }

    async deleteUsers_posts_reaction(itemId) {
        if (!itemId) {
            throw new BadRequestError("hiányzó item ID");
        }

        const deleteProcess = await this.user_post_reactionRepository.deleteUsers_posts_reaction(itemId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen user post realcio");
        }
        return deleteProcess;
    }

    async createUsers_posts_reaction(user_post_reactionData) {
        return await this.user_post_reactionRepository.createUsers_posts_reaction(user_post_reactionData);
    }

    async updateUsers_posts_reaction(itemId, updateData) {
        if (!itemId) throw new BadRequestError("Hiányzó item id");
        if (!updateData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!updateData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!updateData.reaction) {
            throw new BadRequestError("Hiányzó reaction");
        }
        

        const affectedRows = await this.user_post_reactionRepository.updateUsers_posts_reaction(itemId, updateData);

        if (!affectedRows) {
            throw new BadRequestError("user post reakcio nem található", { details: `item: ${updateData}` })
        }

        const updateUser_post_reaction = await this.user_post_reactionRepository.getUsers_posts_reaction(itemId);

        if (!updateUser_post_reaction) {
            throw new BadRequestError("a frissitett user post reakcio nem található", { details: `item: ${updateData}` });
        }
        return updateUser_post_reaction;
    }

}

module.exports = User_Post_ReactionService;