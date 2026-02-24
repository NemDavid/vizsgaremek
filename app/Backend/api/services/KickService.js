const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class KickService {
    constructor(db) {
        this.kickRepository = require("../repositories")(db).kickRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getKicks() {
        return await this.kickRepository.getKicks();
    }


    async getMyKicks(token) {
        const encodedToken = authUtils.verifyToken(token);
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token.");
        }

        return await this.kickRepository.getMyKicks(encodedToken.userID);
    }

    // én kiket rúgtam
    async getKicksSentByUser(token) {
        const encodedToken = authUtils.verifyToken(token);
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token.");
        }

        return await this.kickRepository.getKicksSentByUser(encodedToken.userID);
    }

    // ki rúgott engem
    async getKicksRecievedByUser(token) {
        const encodedToken = authUtils.verifyToken(token);
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token.");
        }

        return await this.kickRepository.getKicksRecievedByUser(encodedToken.userID);
    }


    async doKick(token, TO_USER_ID) {
        if (!TO_USER_ID) throw new BadRequestError("Hianyzó TO_USER_ID");

        const encodedToken = authUtils.verifyToken(token);
        if (encodedToken == null) {
            throw new BadRequestError("Hiányzó vagy lejárt token.");
        }
        
        TO_USER_ID = parseInt(TO_USER_ID);

        // valid user-e
        const validUser = await this.userRepository.getUser(TO_USER_ID);
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó", { details: `TO_USER_ID: ${TO_USER_ID}` });
        }


        // magadat nem rúghatod meg
        if (encodedToken.userID == TO_USER_ID) throw new BadRequestError("Magadat nem rúghatod meg");



        const existingKick = await this.kickRepository.getKickByUserId(encodedToken.userID, TO_USER_ID);

        if (existingKick) {
            await this.kickRepository.updateKick(existingKick.dataValues.ID, { FROM_USER_ID: encodedToken.userID, TO_USER_ID: TO_USER_ID, updated_at: new Date().toISOString().slice(0, 10) });

            return { updated: true };
        }
        else {
            return await this.kickRepository.createKick({ FROM_USER_ID: encodedToken.userID, TO_USER_ID });
        }
    }

}

module.exports = KickService;