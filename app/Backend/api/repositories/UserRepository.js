const { DbError } = require("../errors");

class UserRepository {
    constructor(db) {
        this.User = db.User;
        this.User_Profile = db.User_Profile;
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
                    }
                ]
            });
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
        }
    }
    ///--------------------VÉGLEGES-----------------------------

    async getUserByUsernameEmail(username, email) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: [ { 
                    username: username,
                    email: email
                } ]  
            });
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
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
            throw new DbError("Rossz paraméter", { details: error.message });
        }
    }

    async deleteUser(userId) {
        try {
            const deletedRow = await this.User.destroy({ where: { ID: userId } });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createUser(userData) {
        try {      
            return await this.User.create(userData);
        } catch (error) {
            throw new DbError("Failed to create user object", {
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
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
    
    async getUser(userId) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: [ { ID: userId } ]  
            });
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
        }
    
    }
    async getExistingUserByToken(username) {
        try {
            return await this.User.scope("allUserData").findOne({
                where: [ { username: username } ]  
            });
        } catch (error) {
            throw new DbError("Failed to fetch users", { details: error.message });
        }
    }
}

module.exports = UserRepository;
