const { BadRequestError } = require("../errors");

class User_ProfileService
{
    constructor(db)
    {
        this.user_profileRepository = require("../repositories")(db).user_profileRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUser_Profiles()
    {
        return await this.user_profileRepository.getUser_Profiles();
    }

    async getUser_ProfilesByPage(page)
    {
        if (!page) {
            throw new BadRequestError("hiányzó page paraméter");
        }

        return await this.user_profileRepository.getUser_ProfilesByPage(page);
    }

    async deleteUser_Profile(userId)
    {
        console.log(userId);
        
        if (!userId) {
            throw new BadRequestError("hiányzó user ID");
        }

        const deleteProcess = await this.user_profileRepository.deleteUser_Profile(userId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen felhasznalo");
        }
        return deleteProcess;
    }

    async createUser_Profile(userData)
    {
        const validUser = await this.userRepository.getUser(userData.USER_ID);

        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }
        if (!userData.USER_ID) {
            throw new BadRequestError("hiányzó USER_ID");
        }
        if (!userData.first_name) {
            throw new BadRequestError("hiányzó first_name");
        }
        if (!userData.last_name) {
            throw new BadRequestError("hiányzó last_name");
        }
        if (!userData.birth_date) {
            throw new BadRequestError("hiányzó birth_date");
        }
        if (!userData.birth_place) {
            throw new BadRequestError("hiányzó birth_place");
        }
        if (!userData.schools) {
            throw new BadRequestError("hiányzó schools");
        }
        if (!userData.bio) {
            throw new BadRequestError("hiányzó bio");
        }
        if (!userData.avatar_url) {
            throw new BadRequestError("hiányzó avatar_url");
        }

        return await this.user_profileRepository.createUser_Profile(userData);
    }

    async updateUser_Profile(userId, updateData) 
    {
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
            return BadRequestError("user profile nem található", {details: `userId: ${userId}`})
        }

        const updateUser_Profile = await this.user_profileRepository.getUser_Profile(userId);

        if (!updateUser_Profile) {
            throw new BadRequestError("a frissitett user profile nem található", {details: `userId: ${userId}`});
        }
        return updateUser_Profile; 
    }
    
};

module.exports = User_ProfileService;