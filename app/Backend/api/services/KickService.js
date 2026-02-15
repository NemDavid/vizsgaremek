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
        if (!token) throw new BadRequestError("hiányzó token");
        const encodedToken = authUtils.verifyToken(token);

        return await this.kickRepository.getMyKicks(encodedToken.userID);
    }

    async getKickByUserId(token, TO_USER_ID) {
        if (!token) throw new BadRequestError("hiányzó token");
        const encodedToken = authUtils.verifyToken(token);
        if (!TO_USER_ID) throw new BadRequestError("hiányzó TO_USER_ID");


        const filteredKicks =
        {
            sentKicks: await this.kickRepository.getKicksSentByUser(encodedToken.userID),
            recievedKicks: await this.kickRepository.getKicksRecievedByUser(encodedToken.userID)
        }

        return filteredKicks;
    }

    // én kiket rúgtam
    async getKicksSentByUser(token) {
        if (!token) throw new BadRequestError("hiányzó token");
        const encodedToken = authUtils.verifyToken(token);

        return await this.kickRepository.getKicksSentByUser(encodedToken.userID);
    }

    // ki rúgott engem
    async getKicksRecievedByUser(token) {
        if (!token) throw new BadRequestError("hiányzó token");
        const encodedToken = authUtils.verifyToken(token);

        return await this.kickRepository.getKicksRecievedByUser(encodedToken.userID);
    }


    async getKicksByPage(page) {
        if (!page) {
            throw new BadRequestError("hiányzó page paraméter");
        }

        return await this.kickRepository.getKicksByPage(page);
    }

    async deleteKick(kickId) {
        if (!kickId) {
            throw new BadRequestError("hiányzó kick ID");
        }


        const deleteProcess = await this.kickRepository.deleteKick(kickId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen rugás");
        }
        return deleteProcess;
    }

    async doKick(token, TO_USER_ID) {
        if (!token) throw new BadRequestError("hiányzó token");
        if (!TO_USER_ID) throw new BadRequestError("hianyzó TO_USER_ID");

        TO_USER_ID = parseInt(TO_USER_ID);
        const encodedToken = authUtils.verifyToken(token);



        // valid user-e
        const validUser = await this.userRepository.getUser(TO_USER_ID);
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó", { details: `TO_USER_ID: ${TO_USER_ID}` });
        }


        // magadat nem rúghatod meg
        if (encodedToken.userID == TO_USER_ID) throw new BadRequestError("Magadat nem rúghatod meg");


        // volt e már ilyen rúgás az adott felhasználóra, ha igen akkor töröljük
        const existingKick = await this.kickRepository.getKickByUserId(encodedToken.userID, TO_USER_ID);
        if (existingKick) {
            await this.kickRepository.updateKick(existingKick.ID);

            return { updated: true };
        }
        else {
            return await this.kickRepository.createKick({ FROM_USER_ID: encodedToken.userID, TO_USER_ID });
        }

    }


    async updateKick(kickId, updateData) {
        if (!kickId) throw new BadRequestError("Hiányzó Kick ID");
        if (!updateData.FROM_USER_ID) {
            throw new BadRequestError("Hiányzó FROM_USER_ID");
        }
        if (!updateData.TO_USER_ID) {
            throw new BadRequestError("Hiányzó TO_USER_ID");
        }

        // valid user-e
        const validUser = await this.userRepository.getUser(updateData.TO_USER_ID);
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó", { details: `TO_USER_ID: ${TO_USER_ID}` });
        }

        const affectedRows = await this.kickRepository.updateKick(kickId, updateData);

        if (!affectedRows) {
            throw new BadRequestError("Kick nem található", { details: `kickId: ${kickId}` })
        }

        const updateKick = await this.kickRepository.getKickByID(updateData.FROM_USER_ID, updateData.TO_USER_ID);

        if (!updateKick) {
            throw new BadRequestError("a frissitett Kick nem található", { details: `kickId: ${kickId}` });
        }
        return updateKick;
    }
}

module.exports = KickService;