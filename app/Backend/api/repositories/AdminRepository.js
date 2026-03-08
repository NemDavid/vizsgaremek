const { Op } = require("sequelize");
const { DbError } = require("../errors");

class AdminRepository {
    constructor(db) {
        this.User = db.User;
        this.User_Profile = db.User_Profile;
        this.sequelize = db.sequelize;
    }

    async getAdmins(options = {}) {
        try {
            return await this.User.scope("allUserData").findAll({
                where: {
                    [Op.or]: [
                        {
                            role: "admin"
                        },
                        {
                            role: "owner"
                        },
                    ]
                },
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

    async getAdmin(userId, options = {}) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: {
                    ID: userId,
                    role: "admin"
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }


    async deleteAdmin(userId, options = {}) {
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
}

module.exports = AdminRepository;
