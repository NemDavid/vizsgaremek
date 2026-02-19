const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_SettingsService {
    constructor(db) {
        this.user_settingsRepository = require("../repositories")(db).user_SettingsRepository;
    }

    async getUser_Settings() {
        return await this.user_settingsRepository.getUser_Settings();
    }

    async getUser_SettingsByToken(token) {
        const encodedToken = authUtils.verifyToken(token);

        return await this.user_settingsRepository.getUser_SettingsByToken(encodedToken.userID);
    }

    async getUser_SettingsByID(userId) {
        return await this.user_settingsRepository.getUser_SettingsByID(userId);
    }

    async deleteUser_Settings(token) {
        const encodedToken = authUtils.verifyToken(token);
        const user_SettingsId = encodedToken.userID;

        if (!user_SettingsId) {
            throw new BadRequestError("Hiányzó user_Settings ID");
        }

        const deleteProcess = await this.user_settingsRepository.deleteUser_Settings(user_SettingsId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen felhasznalo");
        }
        return deleteProcess;
    }

    async createUser_Settings(token) {
        const encodedToken = authUtils.verifyToken(token);
        
        return await this.user_settingsRepository.createUser_Settings({ ID: encodedToken.userID });
    }

    async createUser_SettingsByID(ID, options = {}) {

        return await this.user_settingsRepository.createUser_SettingsByID({ ID }, options);
    }


    async updateUser_Settings(token, updateData) {
        const encodedToken = authUtils.verifyToken(token);
        const ID = encodedToken.userID;


        if (!updateData) {
            throw new BadRequestError("Hiányzik JSON Fálj");
        }
        
        const affectedRows = await this.user_settingsRepository.updateUser_Settings(ID, updateData);
        if (!affectedRows) {
            throw new BadRequestError("user_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` })
        }

        const updateUser_Settings = await this.user_settingsRepository.getUser_SettingsByID(ID);

        if (!updateUser_Settings) {
            throw new BadRequestError("a frissitett user_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` });
        }
        return updateUser_Settings;
    }
}

module.exports = User_SettingsService;