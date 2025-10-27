const { DbError } = require("../errors");

class User_ProfileRepository {
    constructor(db) {
        this.User_Profile = db.User_Profile;
        this.sequelize = db.sequelize;
    }

    async getUser_Profiles() {
        try {
            return await this.User_Profile.scope("allUser_ProfileData").findAll();
        } catch (error) {
            throw new DbError("Failed to fetch user profiles", { details: error.message });
        }
    }

    async getUser_Profile(userId) {
        try {
            return await this.User_Profile.scope("allUser_ProfileData").findOne({ 
                where: { USER_ID: userId },
                raw: true 
            });
        } catch (error) {
            throw new DbError("Failed to fetch user profiles", { details: error.message });
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
            throw new DbError("Rossz paraméter", { details: error.message });
        }
    }

    async deleteUser_Profile(userId) {
        try {
            const deletedRow = await this.User_Profile.destroy({ where: { USER_ID: userId } });

            if (deletedRow === 0) {
                throw new DbError("Nincs ilyen user profile", { details: `userId: ${userId}` });
            }

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createUser_Profile(userData) {
        try {
            return await this.User_Profile.create(userData);
        } catch (error) {
            throw new DbError("Failed to create user profile object", {
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
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }

}

module.exports = User_ProfileRepository;
