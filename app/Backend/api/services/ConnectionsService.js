const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");


class ConnectionsService {
    constructor(db) {
        this.connectionsRepository = require("../repositories")(db).connectionsRepository;
    }

    async getConnections() {
        return await this.connectionsRepository.getConnections();
    }

    async getCurrentUserConnections(token) {
        const encodedToken = authUtils.verifyToken(token);
        return await this.connectionsRepository.getCurrentUserConnections(encodedToken.userID);
    }

    async deleteConnection(token, To_User_ID) {
        if (!token) {
            throw new BadRequestError("hiányzó token");
        }
        if (!To_User_ID) {
            throw new BadRequestError("hiányzó To_User_ID");
        }

        const encodedToken = authUtils.verifyToken(token);

        const deleteProcess = await this.connectionsRepository.deleteConnection(encodedToken.userID, To_User_ID);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen felhasznalo");
        }
        return deleteProcess;
    }

    async createConnection(token, To_User_ID) {
        if (!token)
            throw new BadRequestError("hiányzó token");
        if (!To_User_ID) {
            throw new BadRequestError("hiányzó To_User_ID");
        }

        const encodedToken = authUtils.verifyToken(token);

        return await this.connectionsRepository.createConnection({
            User_Requested_ID: encodedToken.userID,
            To_User_ID
        });
    }


    async updateConnection(token, To_User_ID, action) {
        if (!token) throw new BadRequestError("Hiányzó token");
        if (!To_User_ID) {
            throw new BadRequestError("Hiányzó To_User_ID");
        }

        const encodedToken = authUtils.verifyToken(token);
        
        const affectedRows = await this.connectionsRepository.updateConnection(encodedToken.userID, To_User_ID, action);
        
        if (!affectedRows) {
            throw new BadRequestError("connection nem található")
        }

        const updateConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID);
        if (!updateConnection) {
            throw new BadRequestError("a frissitett user nem található");
        }
        return updateConnection;
    }
}

module.exports = ConnectionsService;