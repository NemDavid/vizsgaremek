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

    async createUsers_posts_reaction(reactionData, token) {
        const encodedToken = authUtils.verifyToken(token);
        reactionData.USER_ID = encodedToken.userID;

        if (!reactionData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!reactionData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!reactionData.reaction) {
            throw new BadRequestError("Hiányzó reaction");
        }


        // letezik e a post amire reakciot akarok adni
        const targetPost = await this.user_postRepository.getUser_Post_ByID(reactionData.POST_ID);
        if (!targetPost) {
            throw new BadRequestError("a cel post nem található");
        }


        // megtortenik e a reakcio letrehozasa a reakcio tablaban
        const affectedRows = await this.user_post_reactionRepository.createUsers_posts_reaction(reactionData);
        if (!affectedRows) {
            throw new BadRequestError("user post reakcio nem található", { details: `item: ${reactionData}` })
        }


        // frissites a post tablan a like/dislike ertekekre
        const updatePost = {
            like: reactionData.reaction === 'like' ? targetPost.like + 1 : 0,
            dislike: reactionData.reaction === 'dislike' ? targetPost.dislike + 1 : 0,
        };
        

        // megtortenik e a frissites a post tabla soran
        const postAffectedRows = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);
        if (!postAffectedRows) {
            throw new BadRequestError("user post nem található", { details: `item: ${updatePost, reactionData}` })
        }


        // visszaterunk a frissitett ertekekkel, es leteznek e
        const user_post_reaction = await this.user_post_reactionRepository.getUsers_posts_reaction(reactionData.USER_ID, reactionData.POST_ID);
        const updatedUser_post = await this.user_postRepository.getUser_Post_ByID(reactionData.POST_ID);

        if (!user_post_reaction) {
            throw new BadRequestError("a frissitett user post reakcio nem található", { details: `item: ${reactionData}` });
        }
        if (!updatedUser_post) {
            throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updatePost, reactionData}` });
        }

        return { user_post_reaction, updatedUser_post };
    }

    async updateUsers_posts_reaction(updateReactionData, token) {
        const encodedToken = authUtils.verifyToken(token);
        updateReactionData.USER_ID = encodedToken.userID;

        if (!updateReactionData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!updateReactionData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!updateReactionData.reaction) {
            throw new BadRequestError("Hiányzó reaction");
        }


        // letezik e a post amire reakciot akarok adni
        const targetPost = await this.user_postRepository.getUser_Post_ByID(updateReactionData.POST_ID);
        if (!targetPost) {
            throw new BadRequestError("a cel post nem található");
        }


        // megtortenik e a frissites a reakciora tabla soran
        const affectedRows = await this.user_post_reactionRepository.updateUsers_posts_reaction(updateReactionData);
        if (!affectedRows) {
            throw new BadRequestError("user post reakcio nem található", { details: `item: ${updateReactionData}` })
        }


        // frissites a post tablan a like/dislike ertekekre
        const updatePost = {
            like: updateReactionData.reaction === 'like' ? targetPost.like + 1 : 0,
            dislike: updateReactionData.reaction === 'dislike' ? targetPost.dislike + 1 : 0,
        };

        

        // megtortenik e a frissites a post tabla soran
        const postAffectedRows = await this.user_postRepository.updateUser_Post(updateReactionData.POST_ID, updatePost);
        if (!postAffectedRows) {
            throw new BadRequestError("user post nem található", { details: `item: ${updatePost, updateReactionData}` })
        }


        // visszaterunk a frissitett ertekekkel, es leteznek e
        const updatedUser_post_reaction = await this.user_post_reactionRepository.getUsers_posts_reaction(updateReactionData.USER_ID, updateReactionData.POST_ID);
        const updatedUser_post = await this.user_postRepository.getUser_Post_ByID(updateReactionData.POST_ID);

        if (!updatedUser_post_reaction) {
            throw new BadRequestError("a frissitett user post reakcio nem található", { details: `item: ${updateReactionData}` });
        }
        if (!updatedUser_post) {
            throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updatePost, updateReactionData}` });
        }

        return { updatedUser_post_reaction, updatedUser_post };
    }

}

module.exports = User_Post_ReactionService;