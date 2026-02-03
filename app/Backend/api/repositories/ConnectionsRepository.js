const { DbError } = require("../errors");

class ConnectionsRepository {
    constructor(db) {
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
        this.Op = this.sequelize.Op;
    }

    async getConnections() {
        try {
            return await this.Connections.scope("allConnectionData").findAll();
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a kapcsolatokat.", { details: error.message });
        }
    }

    async getConnection(User_Requested_ID, To_User_ID) {
        try {
            return await this.Connections.scope("allConnectionData").findOne({
                where: {
                    [Op.or]: [
                        {
                            User_Requested_ID: User_Requested_ID,
                            To_User_ID: To_User_ID
                        },
                        {
                            User_Requested_ID: To_User_ID,
                            To_User_ID: User_Requested_ID
                        }
                    ]
                }


            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a kapcsolatot.", { details: error.message });
        }
    }

    async getCurrentUserConnectionsAll(User_Requested_ID) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    [Op.or]: [
                        { User_Requested_ID },
                        { To_User_ID: User_Requested_ID }
                    ]
                }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó kapcsolatait.", { details: error.message });
        }
    }

    async getCurrentUserConnections(User_Requested_ID, status) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    User_Requested_ID,
                    Status: status
                }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó kapcsolatait.", { details: error.message });
        }
    }

    async getCurrentUserFriendRequests(User_Requested_ID) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    To_User_ID: User_Requested_ID,
                }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a barátkérelmeket.", { details: error.message });
        }
    }

    async getCurrentUserFriendlist(userId) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    Status: "accepted",
                    [Op.or]: [
                        { User_Requested_ID: userId },
                        { To_User_ID: userId }
                    ]
                }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a barátlistát.", { details: error.message });
        }
    }

    async getUserFriendlistByID(userId) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    Status: "accepted",
                    [Op.or]: [
                        { User_Requested_ID: userId },
                        { To_User_ID: userId }
                    ]
                }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a barátlistát.", { details: error.message });
        }
    }

    async deleteConnection(User_Requested_ID, To_User_ID) {
        console.log(User_Requested_ID, To_User_ID);
        
        try {
            const deletedRow = await this.Connections.destroy({
                where: {
                    [Op.or]: [
                        {
                            User_Requested_ID: User_Requested_ID,
                            To_User_ID: To_User_ID
                        },
                        {
                            User_Requested_ID: To_User_ID,
                            To_User_ID: User_Requested_ID
                        }
                    ]
                }
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A kapcsolat törlése sikertelen.", { details: error.message });
        }
    }

    async createConnection(connectionData) {
        try {
            return await this.Connections.create(connectionData);
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a kapcsolatot.", {
                details: error.message,
                data: userData,
            });
        }
    }

    async updateConnection(User_Requested_ID, To_User_ID, updateData) {
        try {
            const [affectedRows] = await this.Connections.update(updateData, {
                where: {
                    User_Requested_ID,
                    To_User_ID
                }
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A kapcsolat frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = ConnectionsRepository;
