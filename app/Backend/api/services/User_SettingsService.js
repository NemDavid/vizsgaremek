const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_SettingsService {
    constructor(db) {
        this.user_settingsRepository = require("../repositories")(db).user_SettingsRepository;
    }

    async getUser_Settings() {
        return await this.user_settingsRepository.getUser_Settings();
    }

    async getUser_SettingsByID(token) {
        const encodedToken = authUtils.verifyToken(token);

        return await this.user_settingsRepository.getUser_SettingsByID(encodedToken.userID);
    }

    async deleteUser_Settings(token) {
        const encodedToken = authUtils.verifyToken(token);
        const user_SettingsId = encodedToken.userID;

        if (!user_SettingsId) {
            throw new BadRequestError("hiányzó user_Settings ID");
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

    async updateUser_Settings(token, updateData) {
        const encodedToken = authUtils.verifyToken(token);
        updateData.ID = encodedToken.userID;

        if (!updateData.new_post) {
            throw new BadRequestError("Hiányzó new_post");
        }
        if (!updateData.new_comment_on_post) {
            throw new BadRequestError("Hiányzó new_comment_on_post");
        }
        if (!updateData.new_reaction_on_post) {
            throw new BadRequestError("Hiányzó new_reaction_on_post");
        }
        if (!updateData.new_login) {
            throw new BadRequestError("Hiányzó new_login");
        }
        if (!updateData.new_friend_request) {
            throw new BadRequestError("Hiányzó new_friend_request");
        }
        if (!updateData.consent_given) {
            throw new BadRequestError("Hiányzó consent_given");
        } 

        updateData.new_post = updateData.new_post == 'true' ? true : false;
        updateData.new_comment_on_post = updateData.new_comment_on_post == 'true' ? true : false;
        updateData.new_reaction_on_post = updateData.new_reaction_on_post == 'true' ? true : false;
        updateData.new_login = updateData.new_login == 'true' ? true : false;
        updateData.new_friend_request = updateData.new_friend_request == 'true' ? true : false;
        updateData.consent_given = updateData.consent_given == 'true' ? true : false;
        
        const affectedRows = await this.user_settingsRepository.updateUser_Settings(updateData.ID, updateData);
        if (!affectedRows) {
            throw new BadRequestError("user_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` })
        }

        const updateUser_Settings = await this.user_settingsRepository.getUser_SettingsByID(updateData.ID);

        if (!updateUser_Settings) {
            throw new BadRequestError("a frissitett user_Settings nem található", { details: `user_SettingsId: ${updateData.ID}` });
        }
        return updateUser_Settings;
    }
}

module.exports = User_SettingsService;