const { BadRequestError } = require("../errors");

class User_SettingsService {
    constructor(db) {
        this.user_profileRepository = require("../repositories")(db).user_profileRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async get_UserSettings() {
        return await this.user_profileRepository.getUser_Profiles();
    }
    async Create_UserSettings(){
        return await this.user_profileRepository.getUser_Profiles();
    }
    async Update_UserSettungs(){
        return await this.user_profileRepository.getUser_Profiles();
    }

};

module.exports = User_SettingsService;