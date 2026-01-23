const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");


class ConnectionsService {
    constructor(db) {
        this.connectionsRepository = require("../repositories")(db).connectionsRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.notificationService = null;
    }

    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }

    async getConnections() {
        return await this.connectionsRepository.getConnections();
    }

    async getCurrentUserConnectionsAll(token) {
        const encodedToken = authUtils.verifyToken(token);
        const Tid = encodedToken.userID;
        const data = await this.connectionsRepository.getCurrentUserConnectionsAll(Tid)

        let response = []
        for (let i = 0; i < data.length; i++) {
            const item = data[i].dataValues
            let sv;
            if (item.Status == "pending" || item.Status == "blocked") {
                sv = {
                    UserID: item.To_User_ID,
                    Requested_BY: item.User_Requested_ID,
                    Status: item.Status
                }
            }
            else {
                sv = {
                    UserID: item.User_Requested_ID === Tid ? item.To_User_ID : item.User_Requested_ID,
                    Status: item.Status
                }
            }
            response.push(sv)
        }

        return response;
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

    async getCurrentUserFriendlist(token) {
        const encodedToken = authUtils.verifyToken(token);

        const rawFriendlist = await this.connectionsRepository.getCurrentUserFriendlist(encodedToken.userID);

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

    async getUserFriendlistByID(userId) {
        const rawFriendlist = await this.connectionsRepository.getUserFriendlistByID(userId);

        const filteredFriendlist = rawFriendlist.map(friendItem => (
            {
                friendId: friendItem.User_Requested_ID != userId ? friendItem.User_Requested_ID : friendItem.To_User_ID
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

    async createConnection(token, To_User_ID, action) {
        if (!token)
            throw new BadRequestError("hiányzó token");
        if (!To_User_ID) {
            throw new BadRequestError("hiányzó To_User_ID");
        }
        if (action != "pending" && action != "blocked") {
            throw new BadRequestError("rossz paramáter action érték");
        }
        const encodedToken = authUtils.verifyToken(token);


        // valid user-e
        const validUser = await this.userRepository.getUser(To_User_ID);
        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }


        // magadat nem kezelheted
        if (To_User_ID == encodedToken.userID) {
            throw new BadRequestError("magadat nem tudod kezelni");
        }

        const friendlist = await this.getCurrentUserFriendlist(token);
        const p = await this.userRepository.getUserByID(encodedToken.userID)
        const maxFriend = p.profile.level + 50;
        if (friendlist.length > maxFriend) {
            throw new BadRequestError("Elérted a barát limited")
        }

        const existingConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID);


        if (existingConnection && existingConnection.Status == "blocked") {
            if (encodedToken.userID == existingConnection.dataValues.User_Requested_ID) {
                throw new BadRequestError("Ezt a felhasználót letiltottad, előbb oldd fel, mielőtt barátnak kéred!");
            }
            else {
                throw new BadRequestError("Ez a felhasználó letiltott téged, ezért nem tudod barátnak kérni!");
            }
        } else if (existingConnection.Status == "pending") {
            await this.connectionsRepository.deleteConnection(encodedToken.userID, To_User_ID);

            await this.notificationService.sendNotificationToUser(validUser, "new_friendrequest");

            return await this.connectionsRepository.createConnection({
                User_Requested_ID: encodedToken.userID,
                To_User_ID,
                Status: action
            });
        }
        else if (!existingConnection) {

            await this.notificationService.sendNotificationToUser(validUser, "new_friendrequest");

            return await this.connectionsRepository.createConnection({
                User_Requested_ID: encodedToken.userID,
                To_User_ID,
                Status: action
            });
        }
    }

    async updateConnection(token, To_User_ID, action) {
        if (!token) throw new BadRequestError("Hiányzó token");
        if (!To_User_ID) {
            throw new BadRequestError("Hiányzó To_User_ID");
        }
        if (!action) {
            throw new BadRequestError("Hiányzó action");
        }
        if (!(action == "accepted" || action == "blocked")) {
            throw new BadRequestError("rossz action érték");

        }

        // valid user-e
        const validUser = await this.userRepository.getUser(To_User_ID);
        if (!validUser) {
            throw new BadRequestError("nincs ilyen felhasználó");
        }

        const encodedToken = authUtils.verifyToken(token);

        // magadat nem kezelheted
        if (To_User_ID == encodedToken.userID) {
            throw new BadRequestError("magadat nem tudod kezelni");
        }


        const existingConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID);
        if (!existingConnection) {
            throw new BadRequestError("Nincs ilyen kapcsolat");
        }


        // elfogadas es blockolas kezelese
        let affectedRows = 0;
        if (action == "accepted") {
            affectedRows = await this.connectionsRepository.updateConnection(To_User_ID, encodedToken.userID, { Status: action });
        }
        else if (action == "blocked" && encodedToken.userID == existingConnection.User_Requested_ID) {

            affectedRows = await this.connectionsRepository.updateConnection(encodedToken.userID, To_User_ID, { Status: action });
        }
        // blockolasnal megforditjuk a kapcsolatot, ha akihez erkezett a request, az blokkolja
        else if (action == "blocked" && encodedToken.userID == existingConnection.To_User_ID) {

            affectedRows = await this.connectionsRepository.updateConnection(To_User_ID, encodedToken.userID, {
                To_User_ID,
                User_Requested_ID: encodedToken.userID,
                Status: action
            });
        }


        // volt e modositas
        if (!affectedRows) {
            throw new BadRequestError("connection nem található")
        }


        const updateConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID);
        if (!updateConnection) {
            throw new BadRequestError("az updatelt connection  nem található");
        }
        return updateConnection;
    }
}

module.exports = ConnectionsService;