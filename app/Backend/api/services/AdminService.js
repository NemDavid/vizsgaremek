const { BadRequestError, ValidationError, NotFoundError, ForbiddenError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class AdminService {
    constructor(db) {
        this.adminRepository = require("../repositories")(db).adminRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.advertisementRepository = require("../repositories")(db).advertisementRepository;
        this.user_postRepository = require("../repositories")(db).user_postRepository;
        
    }

    async getAdmins(transaction) {
        return await this.adminRepository.getAdmins({ transaction });
    }

    async getDBInfo(transaction) {
        return {
            users: await this.userRepository.countUsers({ transaction }),
            posts: await this.user_postRepository.countPosts({ transaction }),
            ads: await this.advertisementRepository.countAdvertisement({ transaction }),
        };
    }

    async deleteAdmin(encodedToken, userId, transaction) {
        if (!userId) {
            throw new BadRequestError("Hiányzó user ID");
        }
        if (encodedToken.userID == userId) {
            throw new BadRequestError("Magadat nem tudod kezelni");
        }
        
        const validUser = await this.adminRepository.getAdmin(userId, { transaction });

        if (!validUser) {
            throw new NotFoundError("Nincs ilyen admin");
        }


        const deleteProcess = await this.adminRepository.deleteAdmin(userId, { transaction });
        if (deleteProcess.deleted == 0) {
            throw new NotFoundError("Nincs ilyen felhasznalo");
        }
        
        return deleteProcess;
    }

    async updateUser(encodedToken, userId, role, transaction) {
        if (!userId) throw new BadRequestError("Hiányzó user ID");
        if (!role) {
            throw new BadRequestError("Hiányzó role");
        }
        if (role != "user" && role != "admin" && role != "owner") {
            throw new BadRequestError("Érvénytelen role típus");
        }
        if (encodedToken.userID == userId) {
            throw new BadRequestError("Magadat nem tudod kezelni");
        }
        
        const validUser = await this.userRepository.getUser(userId, { transaction });
        if (!validUser) {
            throw new NotFoundError("Nincs ilyen felhasználó");
        }


        const affectedRows = await this.adminRepository.updateUser(userId, { role }, { transaction });
        if (!affectedRows) {
            throw new BadRequestError("User nem lett frissítve", { details: `userId: ${userId}` })
        }

        const updateAdmin = await this.userRepository.getUser(userId, { transaction });

        if (!updateAdmin) {
            throw new BadRequestError("A frissitett admin nem található", { details: `userId: ${userId}` });
        }
        return updateAdmin;
    }
}

module.exports = AdminService;