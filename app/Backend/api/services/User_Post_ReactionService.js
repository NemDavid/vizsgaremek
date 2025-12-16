const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_ReactionService {
    constructor(db, user_profileService) {
        this.user_post_reactionRepository = require("../repositories")(db).user_post_reactionRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.user_profileService = user_profileService;
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
        // Token feldolgozás
        const encodedToken = authUtils.verifyToken(token);
        reactionData.USER_ID = encodedToken.userID;

        // Validálás
        this._validateReactionData(reactionData);

        // Post létezik-e
        const targetPost = await this.user_postRepository.getUser_Post_ByID(reactionData.POST_ID);
        if (!targetPost) {
            throw new BadRequestError("a cel post nem található");
        }

        // Meglévő reakció ellenőrzése
        const existingReaction = await this.user_post_reactionRepository.getUsers_posts_reaction(
            reactionData.USER_ID,
            reactionData.POST_ID
        );

        // Reakció feldolgozása
        if (existingReaction) {
            if (reactionData.reaction == existingReaction.reaction) {
                return await this.removePreviousReaction(reactionData, existingReaction, targetPost);
            }
            return await this.updateReaction(reactionData, targetPost, existingReaction);
        } else {
            return await this.createdReaction(reactionData, targetPost);
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

    // ========== REAKCIÓ MŰVELETEK ==========

    async removePreviousReaction(reactionData, existingReaction, targetPost) {
        // Reakció törlése
        await this.user_post_reactionRepository.deleteUsers_posts_reaction(existingReaction.ID);

        // Post statisztika frissítése
        const updatePost = this._calculatePostStats('remove', reactionData.reaction, targetPost);
        const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

        if (!updatedPost) {
            throw new BadRequestError("a frissitett user post nem található");
        }

        // XP hozzáadása, pl ha spamelné
        try {
            await this.user_profileService.addXPToUser(reactionData.USER_ID, -10);
        } catch (xpErr) {
            console.warn("XP hiba:", xpErr.message);
        }

        return { removedReaction: true, updatedPost };
    }

    async updateReaction(reactionData, targetPost, existingReaction) {
        // Régi reakció csökkentése
        let updatePost = this._calculatePostStats('remove', existingReaction.reaction, targetPost);

        // Új reakció növelése
        updatePost = this._calculatePostStats('add', reactionData.reaction, updatePost);

        // Reakció frissítése
        const updatedReaction = await this.user_post_reactionRepository.updateUsers_posts_reaction({
            ...reactionData,
            ID: existingReaction.ID
        });

        // Post frissítése
        const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

        if (!updatedReaction) {
            throw new BadRequestError("a frissitett user post reakcio nem található");
        }
        if (!updatedPost) {
            throw new BadRequestError("a frissitett user post nem található");
        }

        return { updatedReaction, updatedPost };
    }

    async createdReaction(reactionData, targetPost) {
        // Post statisztika frissítése
        const updatePost = this._calculatePostStats('add', reactionData.reaction, targetPost);

        // Reakció létrehozása
        const createdReaction = await this.user_post_reactionRepository.createUsers_posts_reaction(reactionData);

        // Post frissítése
        const updatedPost = await this.user_postRepository.updateUser_Post(reactionData.POST_ID, updatePost);

        if (!createdReaction) {
            throw new BadRequestError("a létrehozott user post reakcio nem található");
        }
        if (!updatedPost) {
            throw new BadRequestError("a frissitett user post nem található");
        }

        // XP hozzáadása
        try {
            await this.user_profileService.addXPToUser(reactionData.USER_ID, 10);
        } catch (xpErr) {
            console.warn("XP hiba:", xpErr.message);
        }


        return { createdReaction, updatedPost };
    }

}

module.exports = User_Post_ReactionService;