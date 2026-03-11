const { DbError } = require("../errors");

class User_ProfileRepository {
    constructor(db) {
        this.User_Profile = db.User_Profile;
        this.User = db.User;
        this.User_Post = db.User_Post;
        this.User_Post_Comment = db.User_Post_Comment;
        this.User_Post_Reaction = db.User_Post_Reaction;
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
    }


    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUser_Profiles(options = {}) {
        try {
            return await this.User_Profile.scope("allUser_ProfileData").findAll({
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói profilokat.", { details: error.message });
        }
    }

    async createUser_Profile(userData, options = {}) {
        try {
            return await this.User_Profile.create(userData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a felhasználói profilt.", {
                details: error.message,
                data: userData,
            });
        }
    }

    async updateUser_Profile(userId, updateData, options = {}) {
        try {
            const [affectedRows] = await this.User_Profile.update(updateData, {
                where: { USER_ID: userId },
                transaction: options.transaction
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A felhasználói profil frissítése sikertelen.", { details: error.message });
        }
    }

    async deleteUser_Profile(userId, options = {}) {
        try {
            const deletedRow = await this.User_Profile.destroy({ 
                where: { USER_ID: userId },
                transaction: options.transaction
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A felhasználói profil törlése sikertelen.", { details: error.message });
        }
    }

    async getUser_ProfilesByPage(page, options = {}) {
        const limit = 25;
        const offset = (page - 1) * limit;
        try {
            return await this.User_Profile.scope("allUser_ProfileData").findAll({
                limit,
                offset,
                order: [["USER_ID", "ASC"]],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Érvénytelen lapozási paraméter.", { details: error.message });
        }
    }

    async getUser_Profile(userId, options = {}) {
        try {
            if (!userId) return null;

            // Meghatározzuk a szűrést
            const userWhere = !isNaN(Number(userId))
                ? { ID: Number(userId) }
                : { username: userId };

            const profile = await this.User_Profile.scope("allUser_ProfileData").findOne({
                include: [
                    {
                        model: this.User,
                        as: "user",
                        required: true,
                        where: userWhere,
                    },
                ],
                transaction: options.transaction
            });

            if (!profile) return null;

            const sentCount = await this.Connections.count({
                where: { User_Requested_ID: profile.USER_ID, Status: "accepted" },
                transaction: options.transaction,
            });

            const receivedCount = await this.Connections.count({
                where: { To_User_ID: profile.USER_ID, Status: "accepted" },
                transaction: options.transaction,
            });

            const result = profile.toJSON();
            result.friendCount = sentCount + receivedCount;

            return { result, profile };
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói profilt.", { details: error.message });
        }
    }


// ------
    async getUser_ProfileWithLastPosts(userId, loggedInUserId, options = {}) {
        try {
            if (!userId) return null;

            const userWhere = !isNaN(Number(userId))
                ? { ID: Number(userId) }
                : { username: userId };

            const profile = await this.User_Profile.scope("allUser_ProfileData").findOne({
                include: [
                    {
                        model: this.User,
                        as: "user",
                        required: true,
                        where: userWhere,
                        attributes: { exclude: ["password_hash", "is_loggedIn", "last_login"] },
                        include: [
                            {
                                model: this.User_Post,
                                as: "posts",
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
                                separate: true,
                                limit: 3,
                                order: [["ID", "DESC"]],
                                include: [
                                    {
                                        model: this.User,
                                        as: "user",
                                        attributes: ["ID", "email", "username", "role", "created_at"],
                                        required: false,
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
                                        ]
                                    },
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
                                                required: false,
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
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        model: this.User_Post_Reaction,
                                        as: "reactions",
                                        attributes: ["ID", "USER_ID", "POST_ID", "reaction", "created_at", "updated_at"],
                                        required: false
                                    }
                                ]
                            }
                        ]
                    }
                ],
                transaction: options.transaction
            });

            if (!profile) return null;

            const sentCount = await this.Connections.count({
                where: { User_Requested_ID: profile.USER_ID, Status: "accepted" },
                transaction: options.transaction,
            });

            const receivedCount = await this.Connections.count({
                where: { To_User_ID: profile.USER_ID, Status: "accepted" },
                transaction: options.transaction,
            });

            const result = profile.toJSON();
            result.friendCount = sentCount + receivedCount;

            result.user.posts = (result.user.posts || []).map((post) => {
                let myReaction = "none";

                if (loggedInUserId && Array.isArray(post.reactions)) {
                    const myReactionRow = post.reactions.find(
                        (reaction) => Number(reaction.USER_ID) === Number(loggedInUserId)
                    );

                    if (myReactionRow) {
                        myReaction = myReactionRow.reaction;
                    }
                }

                return {
                    ...post,
                    likeCount: post.like,
                    dislikeCount: post.dislike,
                    myReaction
                };
            });

            return { result, profile };
        } catch (error) {
            console.error("getUser_Profile error:", error);
            throw new DbError("Nem sikerült lekérni a felhasználói profilt.", { details: error.message });
        }
    }

}

module.exports = User_ProfileRepository;