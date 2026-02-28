const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_SettingsService {
    constructor(db) {
        this.user_settingsRepository = require("../repositories")(db).user_SettingsRepository;
    }

    async getUser_SettingsByToken(encodedToken, transaction) {
        return await this.user_settingsRepository.getUser_SettingsByToken(encodedToken.userID, { transaction });
    }

    async getUser_SettingsByID(userId, transaction) {
        return await this.user_settingsRepository.getUser_SettingsByID(userId, { transaction });
    }

    async deleteUser_Settings(encodedToken, transaction) {
        const user_SettingsId = encodedToken.userID;

        if (!user_SettingsId) {
            throw new BadRequestError("Hiányzó user_Settings ID");
        }

        const deleteProcess = await this.user_settingsRepository.deleteUser_Settings(user_SettingsId, { transaction });

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen settings");
        }
        return deleteProcess;
    }

    async createUser_Settings(encodedToken, transaction) {
        const id = encodedToken.userID;

        const existing = await this.user_settingsRepository.getUser_SettingsByID(id, { transaction });
        if (existing) return existing;

        return await this.user_settingsRepository.createUser_Settings({ ID: id }, { transaction });
    }

    async createUser_SettingsByID(ID, options = {}) {

        return await this.user_settingsRepository.createUser_SettingsByID({ ID }, options);
    }


    async updateUser_Settings(encodedToken, updateData, transaction) {
        const ID = encodedToken.userID;


        if (!updateData.Notifications && updateData.DataPrivacy === undefined) {
            throw new BadRequestError("Hiányzik JSON Fálj");
        }


        const affectedRows = await this.user_settingsRepository.updateUser_Settings(ID, updateData, { transaction });
        if (!affectedRows) {
            throw new BadRequestError("User_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` })
        }

        const updateUser_Settings = await this.user_settingsRepository.getUser_SettingsByID(ID, { transaction });

        if (!updateUser_Settings) {
            throw new BadRequestError("A frissitett user_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` });
        }
        return updateUser_Settings;
    }
}

module.exports = User_SettingsService;