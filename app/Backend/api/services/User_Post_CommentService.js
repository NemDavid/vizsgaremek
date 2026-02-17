const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_Post_CommentService {
    constructor(db, user_profileService) {
        this.user_post_CommentRepository = require("../repositories")(db).user_post_commentRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.user_profileService = user_profileService;
        this.notificationService = null;
        this.db = db; // Transaction-hoz szükséges
    }

    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }

    async getUsers_posts_comments() {
        return await this.user_post_CommentRepository.getUsers_posts_comments();
    }

    async getUsers_posts_comment(itemId) {
        return await this.user_post_CommentRepository.getUsers_posts_comment(itemId);
    }

    async deleteUsers_posts_comment(itemId) {
        if (!itemId) {
            throw new BadRequestError("Hiányzó item ID");
        }

        const deleteProcess = await this.user_post_CommentRepository.deleteUsers_posts_comment(itemId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen user post comment");
        }
        return deleteProcess;
    }

    async createUsers_posts_comment(commentData, token) {
        try {
            const encodedToken = authUtils.verifyToken(token);
            commentData.USER_ID = encodedToken.userID;

            // Validálás
            this._validateCommentData(commentData);

            // Post létezik-e
            const targetPost = await this.user_postRepository.getUser_Post_ByID(commentData.POST_ID);
            if (!targetPost) {
                throw new BadRequestError("A cél post nem található");
            }

            // valid use-e
            const validUser = await this.userRepository.getUser(targetPost.USER_ID);
            if (!validUser) {
                throw new BadRequestError("Nincs ilyen felhasználó");
            }

            // transaction
            //------------------------------------------------------------
            const result = await this.db.sequelize.transaction(async transaction => {

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



                return {
                    comment: createdComment,
                    xpAdded: xpResult
                };

            });


            // email az erintett user nek
            process.nextTick(() => {
                this.notificationService
                    .sendNotificationToUser(validUser, "new_post_comment")
                    .catch(console.error);
            });


            return result;

            // If the execution reaches this line, the transaction has been committed successfully
            // `result` is whatever was returned from the transaction callback (the `user`, in this case)
        } catch (error) {
            // If the execution reaches this line, an error occurred.
            // The transaction has already been rolled back automatically by Sequelize!
            console.error("Comment creation transaction error:", error);
            throw error;
        }
        //------------------------------------------------------------

    }

    async updateUsers_posts_comment(commentData, token) {
        const encodedToken = authUtils.verifyToken(token);
        commentData.USER_ID = encodedToken.userID;

        if (!commentData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!commentData.ID) {
            throw new BadRequestError("Hiányzó item id");
        }
        if (!commentData.comment) {
            throw new BadRequestError("Hiányzó user comment");
        }

        // Ellenőrizzük, hogy a user a saját kommentjét frissíti-e
        const existingComment = await this.user_post_CommentRepository.getUsers_posts_comment(commentData.ID);
        if (!existingComment) {
            throw new BadRequestError("A frissítendő comment nem található");
        }

        if (existingComment.USER_ID !== commentData.USER_ID) {
            throw new BadRequestError("Csak a saját kommentedet módosíthatod");
        }

        const updatedComment = await this.user_post_CommentRepository.updateUsers_posts_comment(commentData);
        if (!updatedComment) {
            throw new BadRequestError("A frissített comment nem található");
        }

        return updatedComment;
    }

    // ========== PRIVÁT HELPER METÓDUSOK ==========

    _validateCommentData(commentData) {
        if (!commentData.USER_ID) {
            throw new BadRequestError("Hiányzó user id");
        }
        if (!commentData.POST_ID) {
            throw new BadRequestError("Hiányzó post id");
        }
        if (!commentData.comment) {
            throw new BadRequestError("Hiányzó user comment");
        }

        // Opcionális: komment hossz validálása
        if (commentData.comment.length > 500) {
            throw new BadRequestError("A komment túl hosszú (max 500 karakter)");
        }
        if (commentData.comment.trim().length === 0) {
            throw new BadRequestError("A komment nem lehet üres");
        }
    }
}

module.exports = User_Post_CommentService;