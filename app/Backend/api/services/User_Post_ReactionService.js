const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_ReactionService {
    constructor(db) {
        this.user_post_reactionRepository = require("../repositories")(db).user_post_reactionRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
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

    async updateUsers_posts_reaction(updateData, token) {
        const encodedToken = authUtils.verifyToken(token);
        updateData.USER_ID = encodedToken.userID;

        if (!updateData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!updateData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!updateData.reaction) {
            throw new BadRequestError("Hiányzó reaction");
        }

        const affectedRows = await this.user_post_reactionRepository.updateUsers_posts_reaction(updateData);

        if (!affectedRows) {
            throw new BadRequestError("user post reakcio nem található", { details: `item: ${updateData}` })
        }





        const targetPost = await this.user_postRepository.getUser_Post_ByID(updateData.POST_ID);

        if (!targetPost) {
            throw new BadRequestError("a cel post nem található");
        }

        const updatePost = {
            like: updateData.reaction === 'like' ? targetPost.like + 1 : 0,
            dislike: updateData.reaction === 'dislike' ? target.dislike + 1 : 0,
        };

        const postAffectedRows = await this.user_postRepository.updateUser_Post(updateData.POST_ID, updatePost);

        if (!postAffectedRows) {
            throw new BadRequestError("user post nem található", { details: `item: ${updateData}` })
        }



        const updatedUser_post_reaction = await this.user_post_reactionRepository.getUsers_posts_reaction(updateData.POST_ID);
        const updatedUser_post = await this.user_postRepository.getUser_Post_ByID(updateData.POST_ID);

        if (!updatedUser_post_reaction) {
            throw new BadRequestError("a frissitett user post reakcio nem található", { details: `item: ${updateData}` });
        }

        if (!updatedUser_post) {
            throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updateData}` });
        }

        return { updatedUser_post_reaction, updatedUser_post };
    }

}

module.exports = User_Post_ReactionService;