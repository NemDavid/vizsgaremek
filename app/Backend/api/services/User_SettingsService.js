const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_SettingsService {
    constructor(db) {
        this.user_settingsRepository = require("../repositories")(db).user_SettingsRepository;
    }

    async getUser_SettingsByToken(token, transaction) {
        const encodedToken = authUtils.verifyToken(token);

        return await this.user_settingsRepository.getUser_SettingsByToken(encodedToken.userID, { transaction });
    }

    async getUser_SettingsByID(userId, transaction) {
        return await this.user_settingsRepository.getUser_SettingsByID(userId, { transaction });
    }

    async deleteUser_Settings(token, transaction) {
        const encodedToken = authUtils.verifyToken(token);
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

    async createUser_Settings(token, transaction) {
        const encodedToken = authUtils.verifyToken(token);
        
        return await this.user_settingsRepository.createUser_Settings({ ID: encodedToken.userID }, { transaction });
    }

    async createUser_SettingsByID(ID, options = {}) {

        return await this.user_settingsRepository.createUser_SettingsByID({ ID }, options);
    }


    async updateUser_Settings(token, updateData) {
        const encodedToken = authUtils.verifyToken(token);
        const ID = encodedToken.userID;

        if (!updateData.Notifications || updateData.DataPrivacy == null) {
            throw new BadRequestError("Hiányzik JSON Fálj");
        }
        
        const affectedRows = await this.user_settingsRepository.updateUser_Settings(ID, updateData);
        if (!affectedRows) {
            throw new BadRequestError("User_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` })
        }

        const updateUser_Settings = await this.user_settingsRepository.getUser_SettingsByID(ID);

        if (!updateUser_Settings) {
            throw new BadRequestError("A frissitett user_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` });
        }
        return updateUser_Settings;
    }
}

module.exports = User_SettingsService;