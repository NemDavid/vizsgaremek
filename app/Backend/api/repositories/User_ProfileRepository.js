const { DbError } = require("../errors");

class User_ProfileRepository {
    constructor(db) {
        this.User_Profile = db.User_Profile;
        this.User = db.User;
        this.User_Post = db.User_Post;
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
    }

    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUser_Profiles() {
        try {
            return await this.User_Profile.scope("allUser_ProfileData").findAll();
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

    async updateUser_Profile(userId, updateData) {
        try {
            const [affectedRows] = await this.User_Profile.update(updateData, {
                where: { USER_ID: userId },
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A felhasználói profil frissítése sikertelen.", { details: error.message });
        }
    }

    async deleteUser_Profile(userId) {
        try {
            const deletedRow = await this.User_Profile.destroy({ where: { USER_ID: userId } });

            if (deletedRow === 0) {
                throw new DbError("A felhasználói profil nem található.", { details: `userId: ${userId}` });
            }

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A felhasználói profil törlése sikertelen.", { details: error.message });
        }
    }

    async getUser_ProfilesByPage(page) {
        const limit = 25;
        const offset = (page - 1) * limit;
        try {
            return await this.User_Profile.scope("allUser_ProfileData").findAll({
                limit,
                offset,
                order: [["USER_ID", "ASC"]],
            });
        } catch (error) {
            throw new DbError("Érvénytelen lapozási paraméter.", { details: error.message });
        }
    }

    async getUser_Profile(userId) {
        try {
            const profile = await this.User_Profile.scope("allUser_ProfileData").findOne({
                where: { USER_ID: userId },
                include: [
                    {
                        model: this.User,
                        as: "user",
                        include: [
                            {
                                model: this.User_Post,
                                as: "post"
                            }
                        ]
                    }
                ]
            });

            if (!profile) return null;

            const { Connections } = this;

            const sentCount = await Connections.count({
                where: { User_Requested_ID: userId, Status: "accepted" }
            });

            const receivedCount = await Connections.count({
                where: { To_User_ID: userId, Status: "accepted" }
            });

            const result = profile.toJSON();
            result.friendCount = sentCount + receivedCount;

            return { result, profile };
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználói profilt.", { details: error.message });
        }
    }
}

module.exports = User_ProfileRepository;