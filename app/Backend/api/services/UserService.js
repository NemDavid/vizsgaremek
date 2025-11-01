const { BadRequestError } = require("../errors");
const bcrypt = require("bcrypt");
const salt = 14;

class UserService
{
    constructor(db)
    {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUsers()
    {
        return await this.userRepository.getUsers();
    }

    async getUser(userId)
    {
        return await this.userRepository.getUser(userId);
    }

    async getUserByUsernameEmail(username, email)
    {
        return await this.userRepository.getUserByUsernameEmail(username, email);
    }

    async getUsersByPage(page)
    {
        if (!page) {
            throw new BadRequestError("hiányzó page paraméter");
        }

        return await this.userRepository.getUsersByPage(page);
    }

    async updateLastLogin(userId, date) 
    {
        const user = await this.userRepository.updateUser(userId, date);
        return user;
    }

    async deleteUser(userId)
    {
        if (!userId) {
            throw new BadRequestError("hiányzó user ID");
        }

        const deleteProcess = await this.userRepository.deleteUser(userId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen felhasznalo");
        }
        return deleteProcess;
    }

    async createUser(userData)
    {
        if (!userData.email) {
            throw new BadRequestError("hiányzó email");
        }
        if (!userData.password) {
            throw new BadRequestError("hiányzó password");
        }
        if (!userData.username) {
            throw new BadRequestError("hiányzó username");
        }

        userData.password_hash = await bcrypt.hash(userData.password, salt);
        return await this.userRepository.createUser(userData);
    }

    async updateUser(userId, updateData) 
    {   
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        if (!updateData.email) {
            throw new BadRequestError("Hiányzó email");
        }
        if (!updateData.password) {
            throw new BadRequestError("Hiányzó password");
        }
        if (!updateData.username) {
            throw new BadRequestError("Hiányzó username");
        }
        updateData.password_hash = await bcrypt.hash(updateData.password, salt);

        const affectedRows = await this.userRepository.updateUser(userId, updateData);

        if (!affectedRows) {
            return BadRequestError("user nem található", {details: `userId: ${userId}`})
        }

        const updateUser = await this.userRepository.getUser(userId);

        if (!updateUser) {
            throw new BadRequestError("a frissitett user nem található", {details: `userId: ${userId}`});
        }
        return updateUser; 
    }

    
}

module.exports = UserService;