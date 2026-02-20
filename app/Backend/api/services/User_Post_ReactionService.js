const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_ReactionService {
    constructor(db, user_profileService) {
        this.user_post_reactionRepository = require("../repositories")(db).user_post_reactionRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.user_profileService = user_profileService;
        this.notificationService = null;
        this.db = db; // Transaction-hoz szükséges
    }

    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }


    async getUsers_posts_reactions() {
        return await this.user_post_reactionRepository.getUsers_posts_reactions();
    }

    async getUsers_posts_reaction(token, postId) {
        const encodedToken = authUtils.verifyToken(token);
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token."); 
        }

        return await this.user_post_reactionRepository.getUsers_posts_reaction(encodedToken.userID, postId);
    }

    async deleteUsers_posts_reaction(itemId) {
        if (!itemId) {
            throw new BadRequestError("hiányzó item ID");
        }

        const deleteProcess = await this.user_post_reactionRepository.deleteUsers_posts_reaction(itemId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen user post reakció.");
        }

        return deleteProcess;
    }

    async userMakeReaction(reactionData, token) {
        try {
            const encodedToken = authUtils.verifyToken(token);
            if (encodedToken == null) {
                throw new BadRequestError("Hiányzó vagy lejárt token.");
            }

            reactionData.USER_ID = encodedToken.userID;

            // Validálás
            this._validateReactionData(reactionData);

            // Post létezik-e
            const targetPost = await this.user_postRepository.getUser_Post_ByID(reactionData.POST_ID);
            if (!targetPost) {
                throw new BadRequestError("A cel post nem található");
            }

            // valid use-e
            const validUser = await this.userRepository.getUser(targetPost.USER_ID);
            if (!validUser) {
                throw new BadRequestError("Nincs ilyen felhasználó");
            }


            // transaction
            //------------------------------------------------------------ 
            const result = await this.db.sequelize.transaction(async transaction => {
                let result;


                // Meglévő reakció ellenőrzése
                const existingReaction = await this.user_post_reactionRepository.getUsers_posts_reaction(
                    reactionData.USER_ID,
                    reactionData.POST_ID,
                    { transaction }
                );


                // Reakció feldolgozása transaction-ben
                if (existingReaction) {
                    if (reactionData.reaction == existingReaction.reaction) {
                        result = await this._removePreviousReaction(reactionData, existingReaction, targetPost, transaction);
                    } else {
                        result = await this._updateReaction(reactionData, targetPost, existingReaction, transaction);
                    }
                } else {
                    result = await this._createdReaction(reactionData, targetPost, transaction);
                }



                return result;
            });

            
            // email az erintett usernek commit utan
            process.nextTick(() => {
                this.notificationService
                    .sendNotificationToUser(validUser, "new_post_reaction")
                    .catch(console.error);
            });

            
            return result;

            // If the execution reaches this line, the transaction has been committed successfully
            // `result` is whatever was returned from the transaction callback (the `user`, in this case)
        } catch (error) {
            // If the execution reaches this line, an error occurred.
            // The transaction has already been rolled back automatically by Sequelize!
            console.error("Reaction transaction error:", error);
            throw error;
        }
        //------------------------------------------------------------
    }

    // ========== PRIVÁT HELPER METÓDUSOK ==========

    _validateReactionData(reactionData) {
        if (!reactionData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!reactionData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!reactionData.reaction) {
            throw new BadRequestError("Hiányzó reaction");
        }
    }

    _calculatePostStats(action, reactionType, currentStats) {
        const stats = {
            like: currentStats.like || 0,
            dislike: currentStats.dislike || 0
        };

        if (reactionType === 'like') {
            stats.like += (action === 'add' ? 1 : -1);
        } else if (reactionType === 'dislike') {
            stats.dislike += (action === 'add' ? 1 : -1);
        }

        // Negatív értékek elkerülése
        stats.like = Math.max(0, stats.like);
        stats.dislike = Math.max(0, stats.dislike);

        return stats;
    }

    // ========== REAKCIÓ MŰVELETEK (TRANSACTION-BEN) ==========

    async _removePreviousReaction(reactionData, existingReaction, targetPost, transaction) {
        // Reakció törlése transaction-ben
        await this.user_post_reactionRepository.deleteUsers_posts_reaction(
            existingReaction.ID,
            { transaction }
        );

        // Post statisztika frissítése transaction-ben
        const updatePost = this._calculatePostStats('remove', reactionData.reaction, targetPost);
        const updatedPost = await this.user_postRepository.updateUser_Post(
            reactionData.POST_ID,
            updatePost,
            { transaction }
        );

        if (updatedPost == 0) {
            throw new BadRequestError("a frissitett user post nem található");
        }

        // XP hozzáadása transaction-ben - MOST MÁR UGYANAZT A TRANSACTION-T HASZNÁLJUK
        try {
            await this.user_profileService.addXPToUser(reactionData.USER_ID,
                -10,
                transaction
            );
        } catch (xpErr) {
            console.warn("XP hiba:", xpErr.message);
            // Ne dobjuk tovább, mert a reaction sikeres volt
        }

        return { removedReaction: true, updatedPost };
    }

    async _updateReaction(reactionData, targetPost, existingReaction, transaction) {
        // Régi reakció csökkentése
        let updatePost = this._calculatePostStats('remove', existingReaction.reaction, targetPost);

        // Új reakció növelése
        updatePost = this._calculatePostStats('add', reactionData.reaction, updatePost);

        // Reakció frissítése transaction-ben
        const updatedReaction = await this.user_post_reactionRepository.updateUsers_posts_reaction(
            {
            ...reactionData,
            ID: existingReaction.ID
        },
            { transaction }
        );

        // Post frissítése transaction-ben
        const updatedPost = await this.user_postRepository.updateUser_Post(
            reactionData.POST_ID,
            updatePost,
            { transaction }
        );

        if (updatedReaction == 0) {
            throw new BadRequestError("A frissitett user post reakcio nem található");
        }
        if (!updatedPost) {
            throw new BadRequestError("A frissitett user post nem található");
        }

        return { updatedReaction, updatedPost };
    }

    async _createdReaction(reactionData, targetPost, transaction) {
        // Post statisztika frissítése transaction-ben
        const updatePost = this._calculatePostStats('add', reactionData.reaction, targetPost);

        // Reakció létrehozása transaction-ben
        const createdReaction = await this.user_post_reactionRepository.createUsers_posts_reaction(
            reactionData,
            { transaction }
        );

        // Post frissítése transaction-ben
        const updatedPost = await this.user_postRepository.updateUser_Post(
            reactionData.POST_ID,
            updatePost,
            { transaction }
        );

        if (!createdReaction) {
            throw new BadRequestError("A létrehozott user post reakcio nem található");
        }
        if (!updatedPost) {
            throw new BadRequestError("A frissitett user post nem található");
        }

        // XP hozzáadása transaction-ben - MOST MÁR UGYANAZT A TRANSACTION-T HASZNÁLJUK
        try {
            await this.user_profileService.addXPToUser(reactionData.USER_ID, 10, transaction);
        } catch (xpErr) {
            console.warn("XP hiba:", xpErr.message);
            // Ne dobjuk tovább, mert a reaction sikeres volt
        }

        return { createdReaction, updatedPost };
    }

}

module.exports = User_Post_ReactionService;