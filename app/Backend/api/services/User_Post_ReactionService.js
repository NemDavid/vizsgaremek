const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_ReactionService {
    constructor(db, user_profileService) {
        this.user_post_reactionRepository = require("../repositories")(db).user_post_reactionRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.user_profileService = user_profileService;
        this.db = db; // Transaction-hoz szükséges
    }

    // ========== PUBLIKUS METÓDUSOK ==========

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
            throw new BadRequestError("Nincs ilyen user post reakcio");
        }

        return deleteProcess;
    }

    async userMakeReaction(reactionData, token) {
        const encodedToken = authUtils.verifyToken(token);
        reactionData.USER_ID = encodedToken.userID;

        // Validálás
        this._validateReactionData(reactionData);

        // Post létezik-e
        const targetPost = await this.user_postRepository.getUser_Post_ByID(reactionData.POST_ID);
        if (!targetPost) {
            throw new BadRequestError("a cel post nem található");
        }



        // EGY transaction a teljes műveletre
        const transaction = await this.db.sequelize.transaction();


        // Meglévő reakció ellenőrzése
        const existingReaction = await this.user_post_reactionRepository.getUsers_posts_reaction(
            reactionData.USER_ID,
            reactionData.POST_ID,
            transaction
        );

        try {
            let result;

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

            // Minden sikeres -> commit
            await transaction.commit();
            return result;

        } catch (error) {
            // Valami hibázott -> rollback
            await transaction.rollback();
            console.error("Reaction transaction error:", error);
            throw error;
        }
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
            transaction
        );

        if (!updatedPost) {
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
        const updatedReaction = await this.user_post_reactionRepository.updateUsers_posts_reaction({
            ...reactionData,
            ID: existingReaction.ID
        },
            transaction
        );

        // Post frissítése transaction-ben
        const updatedPost = await this.user_postRepository.updateUser_Post(
            reactionData.POST_ID,
            updatePost,
            transaction
        );

        if (!updatedReaction) {
            throw new BadRequestError("a frissitett user post reakcio nem található");
        }
        if (!updatedPost) {
            throw new BadRequestError("a frissitett user post nem található");
        }

        return { updatedReaction, updatedPost };
    }

    async _createdReaction(reactionData, targetPost, transaction) {
        // Post statisztika frissítése transaction-ben
        const updatePost = this._calculatePostStats('add', reactionData.reaction, targetPost);

        // Reakció létrehozása transaction-ben
        const createdReaction = await this.user_post_reactionRepository.createUsers_posts_reaction(
            reactionData,
            transaction
        );

        // Post frissítése transaction-ben
        const updatedPost = await this.user_postRepository.updateUser_Post(
            reactionData.POST_ID,
            updatePost,
            transaction
        );

        if (!createdReaction) {
            throw new BadRequestError("a létrehozott user post reakcio nem található");
        }
        if (!updatedPost) {
            throw new BadRequestError("a frissitett user post nem található");
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