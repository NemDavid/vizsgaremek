const { Op } = require("sequelize");
const { DbError } = require("../errors");

class UserRepository {
    constructor(db) {
        this.User = db.User;
        this.User_Profile = db.User_Profile;
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
    }
    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getUsers(options = {}) {
        try {
            return await this.User.scope("allUserData").findAll({
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználókat.", { details: error.message });
        }
    }

    async countUsers(options = {}) {
        try {
            return await this.User.scope("allUserData").count({
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználókat.", { details: error.message });
        }
    }

    async getUserByUsername(username, options = {}) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { username },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUserByContainingUI({ search, limit, offset }, options = {}) {
        try {
            const { rows, count } = await this.User.findAndCountAll({
                attributes: ["username", "email", "created_at","ID"],
                where: {
                    username: {
                        [Op.like]: `%${search}%`,
                    },
                },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData",
                    }
                ],
                order: [["username", "ASC"]],
                limit,
                offset,
                transaction: options.transaction
            });

            return { items: rows, total: count };
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", {
                details: error.message,
            });
        }
    }

    async getUserByID(userId, options = {}, scope = "allUserData") {
        try {
            return await this.User.scope(scope).findOne({
                where: { ID: userId },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData",
                    },
                ],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUser(userId, options = {}) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { ID: userId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUserByEmail(email, options = {}) {
        try {
            return await this.User.scope("allUserData").findAll({
                where: { email },
                include: [
                    {
                        model: this.User_Profile,
                        as: "profile",
                        scope: "allUser_ProfileData"
                    },
                ],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót e-mail cím alapján.", { details: error.message });
        }
    }

    async getUsersByPage(page, options = {}) {
        const limit = 25;
        const offset = (page - 1) * limit;
        try {
            return await this.User.scope("allUserData").findAll({
                limit,
                offset,
                order: [["ID", "ASC"]],
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Érvénytelen lapozási paraméter.", { details: error.message });
        }
    }

    async deleteUser(userId, options = {}) {
        try {
            const deletedRow = await this.User.destroy({ 
                where: { ID: userId },
                transaction: options.transaction 
            });
            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A felhasználó törlése sikertelen.", { details: error.message });
        }
    }

    async createUser(userData, options = {}) {
        try {
            return await this.User.create(userData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a felhasználót.", {
                details: error.message,
                data: userData,
            });
        }
    }

    async updateUser(userId, updateData, options = {}) {
        try {
            const [affectedRows] = await this.User.update(updateData, {
                where: { ID: userId },
                transaction: options.transaction
            });
            return affectedRows;
        } catch (error) {
            throw new DbError("A felhasználó frissítése sikertelen.", { details: error.message });
        }
    }

    async updateUser_Password(userId, updateData, options = {}) {
        try {
            const [affectedRows] = await this.User.update(updateData, {
                where: { ID: userId },
                transaction: options.transaction
            });
            return affectedRows;
        } catch (error) {
            throw new DbError("A jelszó frissítése sikertelen.", { details: error.message });
        }
    }

    async getExistingUserByToken(username, options = {}) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: { username },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült ellenőrizni a felhasználót token alapján.", { details: error.message });
        }
    }
    async updatePassword(password_hash, ID, options = {}) {
        try {
            const [affectedraw] = await this.User.scope("allUserData").update({ password_hash }, {
                where: { ID },
                transaction: options.transaction
            });

            return affectedraw;
        } catch (error) {
            throw new DbError("A jelszó frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = UserRepository;
