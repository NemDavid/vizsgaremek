const { BadRequestError } = require("../errors");

class User_ProfileService {
    constructor(db) {
        this.user_profileRepository = require("../repositories")(db).user_profileRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUser_Profiles() {
        return await this.user_profileRepository.getUser_Profiles();
    }

    async getUser_Profile(userId) {
        if (!userId) {
            throw new BadRequestError("hiányzó user ID");
        }
        return await this.user_profileRepository.getUser_Profile(userId);
    }

    async getUser_ProfilesByPage(page) {
        if (!page) {
            throw new BadRequestError("hiányzó page paraméter");
        }

        return await this.user_profileRepository.getUser_ProfilesByPage(page);
    }

    async deleteUser_Profile(userId) {
        if (!userId) {
            throw new BadRequestError("hiányzó user ID");
        }

        const deleteProcess = await this.user_profileRepository.deleteUser_Profile(userId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen felhasznalo");
        }
        return deleteProcess;
    }

    async createUser_Profile(userData) {
        const validUser = await this.userRepository.getUser(userData.USER_ID);

        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }
        if (!userData.first_name) {
            throw new BadRequestError("hiányzó first_name");
        }
        if (!userData.last_name) {
            throw new BadRequestError("hiányzó last_name");
        }

        return await this.user_profileRepository.createUser_Profile(userData);
    }

    async updateUser_Profile(userId, updateData) {
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        if (!updateData.first_name) {
            throw new BadRequestError("Hiányzó first_name");
        }
        if (!updateData.last_name) {
            throw new BadRequestError("Hiányzó last_name");
        }
        if (!updateData.birth_date) {
            throw new BadRequestError("Hiányzó birthd_ate");
        }
        if (!updateData.birth_place) {
            throw new BadRequestError("Hiányzó birth_place");
        }
        if (!updateData.schools) {
            throw new BadRequestError("Hiányzó schools");
        }
        if (!updateData.bio) {
            throw new BadRequestError("Hiányzó bio");
        }
        if (!updateData.avatar_url) {
            throw new BadRequestError("Hiányzó avatar_url");
        }

        const affectedRows = await this.user_profileRepository.updateUser_Profile(userId, updateData);

        if (!affectedRows) {
            throw new BadRequestError("user profile nem található", { details: `userId: ${userId}` })
        }

        const updateUser_Profile = await this.user_profileRepository.getUser_Profile(userId);

        if (!updateUser_Profile) {
            throw new BadRequestError("a frissitett user profile nem található", { details: `userId: ${userId}` });
        }
        return updateUser_Profile;
    }

    async addXPToUser(userId, XP) {
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        if (XP == null || isNaN(XP)) {
            throw new BadRequestError("Érvénytelen XP érték");
        }

        // User lekérése
        const validUser = await this.userRepository.getUserByID(userId);
        if (!validUser) {
            throw new BadRequestError("User nem található");
        }

        // Profil lekérése
        const userProfile = await this.getUser_Profile(userId);
        if (!userProfile) {
            throw new BadRequestError("Profil nem található");
        }


        // Ha invalid adat, NE próbáljuk meg javítani, dobjunk hibát
        if (userProfile.XP === undefined || userProfile.XP === null) {
            throw new BadRequestError("XP mező nincs betöltve a profilban");
        }

        if (isNaN(Number(userProfile.XP))) {
            throw new BadRequestError("XP értéke érvénytelen a profilban");
        }


        const result = await userProfile.addXP(XP);
        return result;
    }


};

module.exports = User_ProfileService;