const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");


class ConnectionsService {
    constructor(db) {
        this.connectionsRepository = require("../repositories")(db).connectionsRepository;
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getConnections() {
        return await this.connectionsRepository.getConnections();
    }

    async getCurrentUserConnectionsAll(token) {
        const encodedToken = authUtils.verifyToken(token);

        return await this.connectionsRepository.getCurrentUserConnectionsAll(encodedToken.userID);
    }

    async getCurrentUserConnections(token, status) {
        const encodedToken = authUtils.verifyToken(token);

        const filteredConnections = await this.connectionsRepository.getCurrentUserConnections(encodedToken.userID, status);

        return filteredConnections.map(con => ({ userId: con.To_User_ID }));
    }

    async getCurrentUserFriendRequests(token) {
        const encodedToken = authUtils.verifyToken(token);


        return await this.connectionsRepository.getCurrentUserFriendRequests(encodedToken.userID);
    }

    async getCurrentUserFriendlint(token) {
        const encodedToken = authUtils.verifyToken(token);

        const rawFriendlist = await this.connectionsRepository.getCurrentUserFriendlint(encodedToken.userID);

        const filteredFriendlist = rawFriendlist.map(friendItem => (
            {
                friendId: friendItem.User_Requested_ID != encodedToken.userID ? friendItem.User_Requested_ID : friendItem.To_User_ID
            }
        ));

        const friendsWithProfile = await Promise.all(filteredFriendlist.map(
                friend => this.userRepository.getUserByID(friend.friendId)
            )
        );

        return friendsWithProfile;
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