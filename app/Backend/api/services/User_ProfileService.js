const { BadRequestError, ValidationError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class User_ProfileService {
    constructor(db) {
        this.user_profileRepository = require("../repositories")(db).user_profileRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUser_Profiles() {
        return await this.user_profileRepository.getUser_Profiles();
    }

    async getUser_Profile(userId, options = {}) {
        if (!userId) {
            throw new BadRequestError("hiányzó user ID");
        }
        return await this.user_profileRepository.getUser_Profile(userId, options);
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
            throw new BadRequestError("Nincs ilyen felhasználói profil");
        }
        return deleteProcess;
    }

    async createUser_Profile(userData, options = {}) {
        const validUser = await this.userRepository.getUser(userData.USER_ID, options);

        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }
        if (!userData.first_name) {
            throw new BadRequestError("Hiányzó first_name");
        }
        if (!authUtils.isValidFirstName(userData.first_name)) {
            throw new ValidationError("Érvénytelen first_name");
        }
        if (!userData.last_name) {
            throw new BadRequestError("Hiányzó last_name");
        }
        if (!authUtils.isValidLastName(userData.last_name)) {
            throw new ValidationError("Érvénytelen last_name");
        }

        // opcionalisak
        if (!authUtils.isValidSchools(userData.schools)) {
            throw new ValidationError("Érvénytelen schools mező");
        }
        if (!authUtils.isValidBirthDate(userData.birth_date)) {
            throw new ValidationError("Érvénytelen birth_date mező");
        }
        if (!authUtils.isValidBirthPlace(userData.birth_place)) {
            throw new ValidationError("Érvénytelen birth_place mező");
        }
        if (!authUtils.isValidAvatar(userData.avatar)) {
            throw new ValidationError("Érvénytelen avatar");
        }
        if (!authUtils.isValidBio(userData.bio)) {
            throw new ValidationError("Érvénytelen bio");
        }

        return await this.user_profileRepository.createUser_Profile(userData, options);
    }

    async updateUser_Profile(userId, updateData) {
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        const validUser = await this.userRepository.getUser(userId);

        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }
        if (!updateData.first_name) {
            throw new BadRequestError("Hiányzó first_name");
        }
        if (!authUtils.isValidFirstName(updateData.first_name)) {
            throw new ValidationError("Érvénytelen first_name");
        }
        if (!updateData.last_name) {
            throw new BadRequestError("Hiányzó last_name");
        }
        if (!authUtils.isValidLastName(updateData.last_name)) {
            throw new ValidationError("Érvénytelen last_name");
        }


        // opcionalisak
        if (!authUtils.isValidSchools(updateData.schools)) {
            throw new ValidationError("Érvénytelen schools mező");
        }
        if (updateData.birth_date !== "0000-00-00" && !authUtils.isValidBirthDate(updateData.birth_date)) {
            throw new ValidationError("Érvénytelen birth_date mező");
        }
        if (!authUtils.isValidBirthPlace(updateData.birth_place)) {
            throw new ValidationError("Érvénytelen birth_place mező");
        }
        if (!authUtils.isValidAvatar(updateData.avatar)) {
            throw new ValidationError("Érvénytelen avatar");
        }
        if (!authUtils.isValidBio(updateData.bio)) {
            throw new ValidationError("Érvénytelen bio");
        }

        const affectedRows = await this.user_profileRepository.updateUser_Profile(userId, updateData);


        if (!affectedRows) {
            throw new BadRequestError("User profile nem lett frissítve", { details: `userId: ${userId}` })
        }

        const { profile: updateUser_Profile } = await this.user_profileRepository.getUser_Profile(userId);

        if (!updateUser_Profile) {
            throw new BadRequestError("A frissitett user profile nem található", { details: `userId: ${userId}` });
        }
        return updateUser_Profile;
    }


    // add xp to user
    async addXPToUser(userId, XP, transaction) {
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        if (XP == null || isNaN(XP)) {
            throw new BadRequestError("Érvénytelen XP érték");
        }

        // User lekérése
        const validUser = await this.userRepository.getUserByID(userId, { transaction });
        if (!validUser) {
            throw new BadRequestError("User nem található");
        }

        // Profil lekérése
        const { profile: userProfile } = await this.getUser_Profile(userId, { transaction });
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


        const result = await userProfile.addXP(XP, transaction);
        return result;
    }


};

module.exports = User_ProfileService;