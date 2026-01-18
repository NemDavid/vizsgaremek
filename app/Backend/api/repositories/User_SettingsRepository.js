const { DbError } = require("../errors");

class User_SettingsRepository {
    constructor(db) {
        this.User_Settings = db.Settings;
        this.sequelize = db.sequelize;
    }


    async getUser_Settings() {
        try {
            return await this.User_Settings.scope("allUser_SettingsData").findAll();
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználókat.", { details: error.message });
        }
    }

    async getUser_SettingsByToken(user_SettingsId) {
        try {
            return await this.User_Settings.scope("allUser_SettingsData").findOne({
                where: { ID: user_SettingsId }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async getUser_SettingsByID(user_SettingsId) {
        try {
            return await this.User_Settings.scope("allUser_SettingsData").findOne({
                where: { ID: user_SettingsId }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználót.", { details: error.message });
        }
    }

    async deleteUser_Settings(user_SettingsId) {
        try {
            const deletedRow = await this.User_Settings.destroy({ where: { ID: user_SettingsId } });
            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A felhasználó törlése sikertelen.", { details: error.message });
        }
    }

    async createUser_Settings(createData) {
        try {
            return await this.User_Settings.create(createData);
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a felhasználót.", {
                details: error.message,
                data: user_SettingsData,
            });
        }
    }

    async createUser_SettingsByID(createData, options) {
        try {
            return await this.User_Settings.create(createData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a felhasználót.", {
                details: error.message,
                data: user_SettingsData,
            });
        }
    }

    async updateUser_Settings(ID, updateData) {;
        try {
            const [affectedRows] = await this.User_Settings.update(updateData, {
                where: { ID },
            });
            return affectedRows;
        } catch (error) {
            throw new DbError("A felhasználó frissítése sikertelen.", { details: error.message });
        }
    }

}

module.exports = User_SettingsRepository;
