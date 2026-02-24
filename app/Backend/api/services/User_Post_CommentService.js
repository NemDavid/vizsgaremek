const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_CommentService {
    constructor(db, user_profileService) {
        this.user_post_CommentRepository = require("../repositories")(db).user_post_commentRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.user_profileService = user_profileService;
        this.notificationService = null;
    }

    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }

    async getUsers_posts_comments(transaction) {
        return await this.user_post_CommentRepository.getUsers_posts_comments({ transaction });
    }

    async getUsers_posts_comment(itemId, transaction) {
        return await this.user_post_CommentRepository.getUsers_posts_comment(itemId, { transaction });
    }

    async getCommentsForPostyPostId(postId, transaction) {
        if (!postId) {
            throw new BadRequestError("Hiányzó postId");
        }

        const existingPost = await this.user_postRepository.getUser_Post_ByID(postId, { transaction });
        if (existingPost == null) {
            throw new BadRequestError("Ez a post nem létezik");
        }

        const postComments = await this.user_post_CommentRepository.getCommentsForPostyPostId(postId, { transaction });
        return postComments;
    }

    async deleteUsers_posts_comment(token, itemId, transaction) {
        const encodedToken = authUtils.verifyToken(token);
        if (!itemId) {
            throw new BadRequestError("Hiányzó item ID");
        }
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token.");
        }


        const targetComment = await this.user_post_CommentRepository.getUsers_posts_comment(itemId, { transaction });
        if (targetComment == null) {
            throw new BadRequestError("A cél comment nem található");
        }
        if (targetComment.dataValues.USER_ID != encodedToken.userID) {
            throw new BadRequestError("Ez nem a te commented");
        }


        const deleteProcess = await this.user_post_CommentRepository.deleteUsers_posts_comment(itemId, { transaction });

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs törölve user post comment");
        }

        return deleteProcess;
    }

    async createUsers_posts_comment(commentData, token, transaction, req) {
        const encodedToken = authUtils.verifyToken(token);
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token.");
        }

        commentData.USER_ID = encodedToken.userID;

        // Validálás
        this._validateCommentData(commentData);

        // Post létezik-e
        const targetPost = await this.user_postRepository.getUser_Post_ByID(commentData.POST_ID, { transaction });
        if (!targetPost) {
            throw new BadRequestError("A cél post nem található");
        }

        // valid use-e
        const validUser = await this.userRepository.getUser(targetPost.USER_ID, { transaction });
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }

        // 1. Komment létrehozása transaction-ben
        const createdComment = await this.user_post_CommentRepository.createUsers_posts_comment(
            commentData,
            { transaction }
        );

        if (!createdComment) {
            throw new BadRequestError("A létrehozott user post comment nem található");
        }

        // 2. XP hozzáadása UGYANABBA a transaction-be
        // A user_profileService már támogatja a transaction átadást
        let xpResult = null;
        try {
            xpResult = await this.user_profileService.addXPToUser(
                commentData.USER_ID,
                50,
                transaction
            );
        } catch (xpErr) {
            // Ha az XP hozzáadás hibázik, de nem akarjuk megszakítani a comment létrehozást
            console.warn("XP hozzáadás sikertelen:", xpErr.message);
            // Itt döntés kérdése: ha kritikus az XP hozzáadás, akkor dobjuk tovább a hibát
            // Ha nem kritikus, csak logoljuk és folytatjuk
            // Most úgy döntök, hogy nem dobom tovább, mert a komment létrehozása fontosabb
        }


        // email az erintett user nek
        req.afterCommit?.push(() =>
            this.notificationService
                .sendNotificationToUser(validUser, "new_post_comment")
                .catch(err => console.error("Email error:", err))
        );


        return {
            comment: createdComment,
            xpAdded: xpResult
        };
    }

    // ========== PRIVÁT HELPER METÓDUSOK ==========

    _validateCommentData(commentData) {
        if (!commentData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!commentData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!commentData.comment?.trim()) {
            throw new BadRequestError("A komment nem lehet üres");
        }

        if (commentData.comment.length > 500) {
            throw new BadRequestError("A komment túl hosszú (max 500 karakter)");
        }
    }
}

module.exports = User_Post_CommentService;