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

    async getConnections(transaction) {
        return await this.connectionsRepository.getConnections({ transaction });
    }

    async getCurrentUserConnectionsAll(encodedToken, transaction) {
        const Tid = encodedToken.userID;
        const data = await this.connectionsRepository.getCurrentUserConnectionsAll(Tid, { transaction });

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

    async getFilteredConnections(status, transaction) {
        if (status != "accepted" && status != "pending" && status != "blocked") {
            throw new BadRequestError("Érvénytelen status");
        }

        return await this.connectionsRepository.getFilteredConnections(status, { transaction });
    }

    async getCurrentUserFriendRequests(encodedToken, transaction) {
        return await this.connectionsRepository.getCurrentUserFriendRequests(encodedToken.userID, { transaction });
    }

    async getCurrentUserFilteredConnections(encodedToken, action, transaction) {
        if (action != "pending" && action != "accepted" && action != "blocked") {
            throw new BadRequestError("Rossz paramáter action érték");
        }

        return await this.connectionsRepository.getCurrentUserFilteredConnections(encodedToken.userID, action, { transaction });
    }

    async getUserFriendlistByID(userId, transaction) {
        const rawFriendlist = await this.connectionsRepository.getUserFriendlistByID(userId, { transaction });

        const filteredFriendlist = rawFriendlist.map(friendItem => (
            {
                friendId: friendItem.User_Requested_ID != userId ? friendItem.User_Requested_ID : friendItem.To_User_ID
            }
        ));

        const friendsWithProfile = await Promise.all(filteredFriendlist.map(
            friend => this.userRepository.getUserByID(friend.friendId, { transaction })
        )
        );


        return friendsWithProfile;
    }

    async deleteConnection(encodedToken, To_User_ID, transaction) {
        if (!To_User_ID) {
            throw new BadRequestError("Hiányzó To_User_ID");
        }


        const validUser = await this.userRepository.getUser(To_User_ID, { transaction });
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }

        const deleteProcess = await this.connectionsRepository.deleteConnection(encodedToken.userID, To_User_ID);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nem sikerült törölni a kapcsolatot.");
        }
        return deleteProcess;
    }

    async createConnection(encodedToken, To_User_ID, action, transaction, req) {
        if (!To_User_ID) {
            throw new BadRequestError("Hiányzó To_User_ID");
        }
        if (action != "pending" && action != "blocked") {
            throw new BadRequestError("Rossz paramáter action érték");
        }
        // valid user-e
        const validUser = await this.userRepository.getUser(To_User_ID, { transaction });
        
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }
        // magadat nem kezelheted
        if (To_User_ID == encodedToken.userID) {
            throw new BadRequestError("Magadat nem tudod kezelni");
        }
        if (action == "pending") {

            const friendlist = await this.getCurrentUserFilteredConnections(encodedToken, "accepted", transaction);

            const p = await this.userRepository.getUserByID(encodedToken.userID, { transaction });
            
            const maxFriend = p.profile.level + 50;

            if (friendlist.length > maxFriend) {
                throw new BadRequestError("Elérted a barát limited")
            }
        }


        const existingConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID, { transaction });

        if (existingConnection && existingConnection.Status == "accepted" && action !== "blocked") {
            throw new BadRequestError("Csak egyszer küldhetsz barátkérést egy felhasználónak!");
        }
        else if (existingConnection && existingConnection.Status == "blocked") {
            if (encodedToken.userID == existingConnection.dataValues.User_Requested_ID) {
                throw new BadRequestError("Ezt a felhasználót letiltottad, előbb oldd fel, mielőtt barátnak kéred!");
            }
            else {
                throw new BadRequestError("Ez a felhasználó letiltott téged, ezért nem tudod barátnak kérni!");
            }
        } else if (existingConnection && existingConnection.Status == "pending") {
            await this.connectionsRepository.deleteConnection(encodedToken.userID, To_User_ID, { transaction });
            // email az erintett user nek
            if (req.afterCommit && this.notificationService) {
                req.afterCommit.push(async () => {
                    await this.notificationService
                        .sendNotificationToUser(validUser, "new_friendrequest")
                        .catch(console.error);
                });
            }
            return await this.connectionsRepository.createConnection({
                User_Requested_ID: encodedToken.userID,
                To_User_ID,
                Status: action,
            },
                { transaction }
            );
        }
        else if (existingConnection && (existingConnection.Status == "accepted" || existingConnection.Status == "pending")) {
            return await this.updateConnection(encodedToken, To_User_ID, action, transaction);
        }
        else if (!existingConnection) {
            // email az erintett user nek
            if (req.afterCommit && this.notificationService) {
                req.afterCommit.push(async () => {
                    await this.notificationService
                        .sendNotificationToUser(validUser, "new_friendrequest")
                        .catch(console.error);
                });
            }
            return await this.connectionsRepository.createConnection({
                
                User_Requested_ID: encodedToken.userID,
                To_User_ID,
                Status: action
            },
                { transaction }
            );
        }
    }

    async updateConnection(encodedToken, To_User_ID, action, transaction) {
        if (!To_User_ID) {
            throw new BadRequestError("Hiányzó To_User_ID");
        }
        if (!action) {
            throw new BadRequestError("Hiányzó action");
        }
        if (!(action == "accepted" || action == "blocked")) {
            throw new BadRequestError("Rossz action érték");
        }

        // valid user-e
        console.log("asd");
        console.log(transaction);
        
        const validUser = await this.userRepository.getUser(To_User_ID, { transaction });
        
        if (!validUser) {
            throw new BadRequestError("Nincs ilyen felhasználó");
        }
        // magadat nem kezelheted
        if (To_User_ID == encodedToken.userID) {
            throw new BadRequestError("Magadat nem tudod kezelni");
        }
        const existingConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID, { transaction });
        if (!existingConnection) {
            throw new BadRequestError("Nincs ilyen kapcsolat");
        }
        // elfogadas es blockolas kezelese
        let affectedRows = 0;
        if (action == "accepted") {
            affectedRows = await this.connectionsRepository.updateConnection(To_User_ID, encodedToken.userID, { Status: action }, { transaction });
        }
        else if (action == "blocked" && encodedToken.userID == existingConnection.User_Requested_ID) {

            affectedRows = await this.connectionsRepository.updateConnection(encodedToken.userID, To_User_ID, { Status: action }, { transaction });
        }
        // blockolasnal megforditjuk a kapcsolatot, ha akihez erkezett a request, az blokkolja
        else if (action == "blocked" && encodedToken.userID == existingConnection.To_User_ID) {

            affectedRows = await this.connectionsRepository.updateConnection(To_User_ID, encodedToken.userID, {
                To_User_ID,
                User_Requested_ID: encodedToken.userID,
                Status: action
            },
                { transaction }
            );
        }
        // volt e modositas
        if (!affectedRows) {
            throw new BadRequestError("Connection nem található")
        }


        const updateConnection = await this.connectionsRepository.getConnection(encodedToken.userID, To_User_ID, { transaction });
        if (!updateConnection) {
            throw new BadRequestError("Az updatelt connection  nem található");
        }

        return updateConnection;
    }
}

module.exports = ConnectionsService;