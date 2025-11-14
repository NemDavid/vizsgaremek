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

    async getUsers_posts_reaction(token, itemId) {
        const encodedToken = authUtils.verifyToken(token);
        
        return await this.user_post_reactionRepository.getUsers_posts_reaction(encodedToken.userID, itemId);
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

    async userMakeReaction(reactionData, token) {
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


        // adtam e mar reakciot a kivalasztott postra
        const existingReaction = await this.user_post_reactionRepository.getUsers_posts_reaction(reactionData.USER_ID, reactionData.POST_ID);
        if (existingReaction)  // ha igen, akkor frissitjuk a reakciot es a postot is
        {
           if (reactionData.reaction == existingReaction.reaction) { // ugyan az a reakcio akkor leszedjuk az elozor
                

                this.user_post_reactionRepository.deleteUsers_posts_reaction(existingReaction.ID); // reakcio torles

                const updatePost = {
                    like: reactionData.reaction === 'like' ? targetPost.like - 1 : targetPost.like,
                    dislike: reactionData.reaction === 'dislike' ? targetPost.dislike - 1 : targetPost.dislike,
                };

                const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

                if (!updatedPost) {
                    throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updatePost, reactionData}` });
                }

                return { removedReaction: true, updatedPost };

                // return await removePreviousReaction(reactionData, existingReaction, targetPost);
           }


            const updatePost = {
                like: reactionData.reaction === 'like' ? targetPost.like + 1 : targetPost.like - 1,
                dislike: reactionData.reaction === 'dislike' ? targetPost.dislike + 1 : targetPost.dislike - 1,
            };
            const updatedReaction = await this.user_post_reactionRepository.updateUsers_posts_reaction(reactionData);
            const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

            if (!updatedReaction) {
                throw new BadRequestError("a frissitett user post reakcio nem található", { details: `item: ${reactionData}` });
            }
            if (!updatedPost) {
                throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updatePost, reactionData}` });
            }

            return { updatedReaction, updatedPost };
        }
        else 
        {
            const updatePost = {
                like: reactionData.reaction === 'like' ? targetPost.like + 1 : targetPost.like,
                dislike: reactionData.reaction === 'dislike' ? targetPost.dislike + 1 : targetPost.dislike,
            };
            const createdReaction = await this.user_post_reactionRepository.createUsers_posts_reaction(reactionData);
            const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

            if (!createdReaction) {
                throw new BadRequestError("a létrehozott user post reakcio nem található", { details: `item: ${reactionData}` });
            }
            if (!updatedPost) {
                throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updatePost, reactionData}` });
            }

            return { createdReaction, updatedPost };
        }
    }

    async removePreviousReaction(reactionData, existingReaction, targetPost) {
            this.user_post_reactionRepository.deleteUsers_posts_reaction(existingReaction.ID); // reakcio torles

            const updatePost = {
                like: reactionData.reaction === 'like' ? targetPost.like - 1 : targetPost.like,
                dislike: reactionData.reaction === 'dislike' ? targetPost.dislike - 1 : targetPost.dislike,
            };

            const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

            if (!updatedPost) {
                throw new BadRequestError("a frissitett user post nem található", { details: `item: ${updatePost, reactionData}` });
            }

            return { removedReaction: true, updatedPost };
    }

}

module.exports = User_Post_ReactionService;