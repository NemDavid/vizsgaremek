const { DbError } = require("../errors");

class UserRepository {
    constructor(db) {
        this.User = db.User;
        this.User_Profile = db.User_Profile;
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
    }
    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUsers() {
        try {
            return await this.User.scope("allUserData").findAll({
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ]
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználókat.", { details: error.message });
        }
    }

    async getUserByUsername(username) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { username },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ]
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUserByID(userId) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { ID: userId },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ]
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUser(userId) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { ID: userId }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.User.scope("allUserData").findAll({
                where: { email },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ]
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót e-mail cím alapján.", { details: error.message });
        }
    }

    async getUsersByPage(page) {
        const limit = 25;
        const offset = (page - 1) * limit;
        try {
            return await this.User.scope("allUserData").findAll({
                limit,
                offset,
                order: [["ID", "ASC"]],
            });
        } catch (error) {
            throw new DbError("Érvénytelen lapozási paraméter.", { details: error.message });
        }
    }

    async deleteUser(userId) {
        try {
            const deletedRow = await this.User.destroy({ where: { ID: userId } });
            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A felhasználó törlése sikertelen.", { details: error.message });
        }
    }

    async createUser(userData) {
        try {
            return await this.User.create(userData);
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a felhasználót.", {
                details: error.message,
                data: userData,
            });
        }
    }

    async updateUser(userId, updateData) {
        try {
            const [affectedRows] = await this.User.update(updateData, {
                where: { ID: userId },
            });
            return affectedRows;
        } catch (error) {
            throw new DbError("A felhasználó frissítése sikertelen.", { details: error.message });
        }
    }

    async updateUser_Password(userId, updateData) {
        try {
            const [affectedRows] = await this.User.update(updateData, {
                where: { ID: userId },
            });
            return affectedRows;
        } catch (error) {
            throw new DbError("A jelszó frissítése sikertelen.", { details: error.message });
        }
    }

    async getExistingUserByToken(username) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { username }
            });
        } catch (error) {
            throw new DbError("Nem sikerült ellenőrizni a felhasználót token alapján.", { details: error.message });
        }
    }
}

module.exports = UserRepository;
