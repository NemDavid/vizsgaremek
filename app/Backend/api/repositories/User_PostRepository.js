const { DbError } = require("../errors");

class User_PostRepository {
    constructor(db) {
        this.User_Post = db.User_Post;
        this.User_Post_Comment = db.User_Post_Comment;
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.User = db.User;
        this.User_Profile = db.User_Profile;
        this.sequelize = db.sequelize;
    }

    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUser_Posts(options = {}) {
        try {
            return await this.User_Post.scope("allPostData").findAll({
                order: [
                    ["created_at", "ASC"]
                ],
                include: [
                    {
                        model: this.User_Post_Comment,
                        as: "comments",
                        scope: "allUserPostCommentData",
                    }
                ],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói bejegyzéseket.", { details: error.message });
        }
    }

    async countPosts(options = {}) {
        try {
            return await this.User_Post.scope("allPostData").count({
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói bejegyzéseket.", { details: error.message });
        }
    }

    async getUser_PostsByLimit(page, perPage, loggedInUserId, options = {}) {
    try {
        const p = Number(page) || 0;
        const pp = Number(perPage) || 10;

        const limit = pp;
        const offset = p * pp;

        const total = await this.User_Post.count({
            transaction: options.transaction
        });

        const posts = await this.User_Post.findAll({
            attributes: [
                "ID",
                "USER_ID",
                "like",
                "dislike",
                "visibility",
                "content",
                "title",
                "media_url",
                "created_at",
                "updated_at"
            ],
            order: [["ID", "DESC"]],
            limit,
            offset,
            include: [
                // Post készítője
                {
                    model: this.User,
                    as: "user",
                    attributes: ["ID", "email", "username", "role", "created_at"],
                    include: [
                        {
                            model: this.User_Profile,
                            as: "profile",
                            attributes: [
                                "ID",
                                "USER_ID",
                                "level",
                                "XP",
                                "first_name",
                                "last_name",
                                "birth_date",
                                "birth_place",
                                "schools",
                                "bio",
                                "avatar_url"
                            ],
                            required: false
                        }
                    ],
                    required: false
                },

                // Kommentek + kommentelő user + profil
                {
                    model: this.User_Post_Comment,
                    as: "comments",
                    attributes: [
                        "ID",
                        "USER_ID",
                        "POST_ID",
                        "comment",
                        "created_at",
                        "updated_at"
                    ],
                    required: false,
                    separate: true,
                    order: [["ID", "ASC"]],
                    include: [
                        {
                            model: this.User,
                            as: "user",
                            attributes: ["ID", "email", "username", "role", "created_at"],
                            include: [
                                {
                                    model: this.User_Profile,
                                    as: "profile",
                                    attributes: [
                                        "ID",
                                        "USER_ID",
                                        "level",
                                        "XP",
                                        "first_name",
                                        "last_name",
                                        "birth_date",
                                        "birth_place",
                                        "schools",
                                        "bio",
                                        "avatar_url"
                                    ],
                                    required: false
                                }
                            ],
                            required: false
                        }
                    ]
                },

                // Belépett user reactionje az adott postra
                {
                    model: this.User_Post_Reaction,
                    as: "reactions",
                    attributes: ["reaction"],
                    where: { USER_ID: loggedInUserId },
                    required: false
                }
            ],
            transaction: options.transaction
        });

        const mappedPosts = posts.map((post) => {
            const plainPost = post.toJSON();

            let myReaction = "none";
            if (plainPost.reactions && plainPost.reactions.length > 0) {
                myReaction = plainPost.reactions[0].reaction;
            }

            delete plainPost.reactions;

            return {
                ...plainPost,
                myReaction,
                likeCount: plainPost.like,
                dislikeCount: plainPost.dislike
            };
        });

        const hasMore = offset + limit < total;

        return {
            data: mappedPosts,
            nextCursor: hasMore ? p + 1 : null
        };
    } catch (error) {
        console.error("getUser_PostsByLimit error:", error);
        throw new DbError("Nem sikerült lekérni a felhasználói bejegyzéseket.", {
            details: error.message
        });
    }
}

    async getUser_Posts_ByuserId(userId, options = {}) {
        try {
            return await this.User_Post.scope("allPostData").findAll({
                where: { USER_ID: userId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó bejegyzéseit.", { details: error.message });
        }
    }

    async getUser_Post_ByID(postId, options = {}) {
        try {
            const result = await this.User_Post.scope("allPostData").findOne({
                where: { ID: postId },
                transaction: options.transaction
            });

            return result;
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a bejegyzést.", { details: error.message });
        }
    }

    async deleteUser_Post(postId, options = {}) {
        try {
            const deletedRow = await this.User_Post.destroy({
                where: { ID: postId },
                transaction: options.transaction
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A bejegyzés törlése sikertelen.", { details: error.message });
        }
    }

    async createUser_Post(postData, options = {}) {
        try {
            return await this.User_Post.create(postData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a bejegyzést.", {
                details: error.message,
                data: postData,
            });
        }
    }

    async updateUser_Post(postId, updateData, options = {}) {
        try {
            const [affectedRows] = await this.User_Post.update(updateData, {
                where: { ID: BigInt(postId) },
                transaction: options.transaction
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A bejegyzés frissítése sikertelen.", { details: error.message });
        }
    }

    async updateUser_POST_LikeDislike(postId, like, dislike, options = {}) {
        try {
            await this.User_Post.update({ like, dislike }, {
                where: { ID: postId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("A bejegyzés frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = User_PostRepository;
