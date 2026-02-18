const { BadRequestError, ValidationError } = require("../errors");
const NotFoundError = require("../errors/NotFoundError");
const authUtils = require("../utilities/authUtils");
const bcrypt = require("bcrypt");
const salt = 14;

class UserService {
    constructor(db) {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }

    async getUser(userId) {
        return await this.userRepository.getUser(userId);
    }

    async getUserByID(userId) {
        return await this.userRepository.getUserByID(userId,_,"Profil",false);
    }

    async getUserByUsername(username) {
        return await this.userRepository.getUserByUsername(username);
    }

    async getUserByContainingUI(username) {
        return await this.userRepository.getUserByContainingUI(username);
    }

    async getUserByEmail(email) {
        return await this.userRepository.getUserByEmail(email);
    }

    async getUsersByPage(page) {
        if (!page) {
            throw new BadRequestError("hiányzó page paraméter");
        }

        return await this.userRepository.getUsersByPage(page);
    }

    async updateLastLogin(userId, data) {
        const user = await this.userRepository.updateUser(userId, data);
        return user;
    }

    async updateLastLogout(token) {
        const decoded = authUtils.verifyToken(token);

        const user = await this.userRepository.updateUser(decoded.userID, { is_loggedIn: false });
        return user;
    }

    async deleteUser(userId) {
        if (!userId) {
            throw new BadRequestError("hiányzó user ID");
        }

        const deleteProcess = await this.userRepository.deleteUser(userId);

        if (deleteProcess.deleted == 0) {
            throw new NotFoundError("Nincs ilyen felhasznalo");
        }
        return deleteProcess;
    }

    async createUser(userData, options = {}) {
        // van e már ilyen felhasználó ezzel a névvel
        const existingUser = await this.userRepository.getUserByUsername(userData.username);
        if (existingUser) {
            throw new BadRequestError("Ez a felhasználó név már létezik");
        }

        return await this.userRepository.createUser(userData, options);
    }

    async validateUser(userData) {
        if (!userData.email) {
            throw new BadRequestError("Hiányzó email");
        }
        if (!authUtils.isValidEmail(userData.email)) {
            throw new ValidationError("Érvényytelen email");
        }
        if (!userData.username) {
            throw new BadRequestError("Hiányzó username");
        }
        if (!authUtils.isValidUsername(userData.username)) {
            throw new ValidationError("Érvénytelen username");
        }
        const FindName = await this.userRepository.getUserByUsername(userData.username)
        if (FindName !== null) {
            throw new BadRequestError("Ez a felhasználó név már létezik");
        }
        if (!userData.password) {
            throw new BadRequestError("Hiányzó password");
        }
        if (!authUtils.isValidPassword(userData.password)) {
            throw new ValidationError("A jelszó nem felel meg a követelményeknek");
        }
        if (!userData.confirm_password) {
            throw new BadRequestError("Hiányzó confirm_password");
        }
        if (!authUtils.isValidPassword(userData.confirm_password)) {
            throw new ValidationError("A jelszó nem felel meg a követelményeknek");
        }
        if (userData.password !== userData.confirm_password) {
            throw new BadRequestError("A jelszavak nem egyeznek");
        }

        return userData;
    }

    async updateUser(userId, updateData) {
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
            throw new BadRequestError("user nem található", { details: `userId: ${userId}` })
        }

        const updateUser = await this.userRepository.getUser(userId);

        if (!updateUser) {
            throw new BadRequestError("a frissitett user nem található", { details: `userId: ${userId}` });
        }
        return updateUser;
    }

    async updateUser_Password(userId, updateData) {
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        if (!updateData.password_hash) {
            throw new BadRequestError("Hiányzó password_hash");
        }

        const affectedRows = await this.userRepository.updateUser_Password(userId, updateData);

        if (!affectedRows) {
            throw new BadRequestError("user nem található", { details: `userId: ${userId}` })
        }

        const updateUser = await this.userRepository.getUser(userId);

        if (!updateUser) {
            throw new BadRequestError("a frissitett user nem található", { details: `userId: ${userId}` });
        }
        return updateUser;
    }



    async getExistingUserByToken(token) {
        if (!token) throw new BadRequestError("Hiányzó user token");
        const decoded = authUtils.verifyToken(token);
        if (!decoded) {
            throw new BadRequestError("Érvénytelen vagy lejárt token");
        }

        const existingUser = await this.userRepository.getExistingUserByToken(decoded.username);

        if (existingUser) {
            throw new BadRequestError("van ilyen felhasználó");
        }

        return existingUser;
    }

    // Autista csinálta
    async updatePassword(updateData, token) {
        if (!token) throw new BadRequestError("Hiányzó user token");
        const decoded = authUtils.verifyToken(token);
        if (!decoded) {
            throw new BadRequestError("Érvénytelen vagy lejárt token");
        }

        if (!updateData.old_password || !updateData.new_password || !updateData.confirm_password) throw new BadRequestError("Hiányzó adatt");

        if (updateData.new_password !== updateData.confirm_password) throw new BadRequestError("Nem megfelelő adat");

        if (!authUtils.isValidPassword(updateData.new_password)) throw new BadRequestError("Nem megfelelő adat")

        const user = await this.userRepository.getUserByID(decoded.userID);
        if (!user) throw new NotFoundError("Nincs ilyen felhasználó");

        if (!bcrypt.compareSync(updateData.old_password, user.password_hash)) throw new ValidationError("Nem megfelelő adat");

        if (updateData.old_password === updateData.new_password) throw new ValidationError("Megegyező jelszavak");

        const hp = authUtils.hashPassword(updateData.new_password)

        const affectedraw = await this.userRepository.updatePassword(hp, decoded.userID);
        if (affectedraw == 0) throw new BadRequestError("Hiba frissités sorrán")
        return { message: "OK" };
    }
}

module.exports = UserService;