const { DbError } = require("../errors");

class ConnectionsRepository {
    constructor(db) {
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
        this.Op = db.Sequelize.Op;
    }

    async getConnections(options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({ transaction: options.transaction });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a kapcsolatokat.", { details: error.message });
        }
    }

    async getConnection(User_Requested_ID, To_User_ID, options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findOne({
                where: {
                    [this.Op.or]: [
                        {
                            User_Requested_ID: User_Requested_ID,
                            To_User_ID: To_User_ID
                        },
                        {
                            User_Requested_ID: To_User_ID,
                            To_User_ID: User_Requested_ID
                        }
                    ]
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a kapcsolatot.", { details: error.message });
        }
    }

    async getCurrentUserConnectionsAll(User_Requested_ID, options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    [this.Op.or]: [
                        { User_Requested_ID },
                        { To_User_ID: User_Requested_ID }
                    ]
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó kapcsolatait.", { details: error.message });
        }
    }

    async getCurrentUserConnections(status, options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    Status: status
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a felhasználó kapcsolatait.", { details: error.message });
        }
    }

    async getCurrentUserFriendRequests(User_Requested_ID, options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    To_User_ID: User_Requested_ID,
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a barátkérelmeket.", { details: error.message });
        }
    }

    async getCurrentUserFriendlist(userId, options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    Status: "accepted",
                    [this.Op.or]: [
                        { User_Requested_ID: userId },
                        { To_User_ID: userId }
                    ]
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a barátlistát.", { details: error.message });
        }
    }

    async getUserFriendlistByID(userId, options = {}) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    Status: "accepted",
                    [this.Op.or]: [
                        { User_Requested_ID: userId },
                        { To_User_ID: userId }
                    ]
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a barátlistát.", { details: error.message });
        }
    }

    async deleteConnection(User_Requested_ID, To_User_ID, options = {}) {
        try {
            const deletedRow = await this.Connections.destroy({
                where: {
                    [this.Op.or]: [
                        {
                            User_Requested_ID: User_Requested_ID,
                            To_User_ID: To_User_ID
                        },
                        {
                            User_Requested_ID: To_User_ID,
                            To_User_ID: User_Requested_ID
                        }
                    ]
                },
                transaction: options.transaction
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A kapcsolat törlése sikertelen.", { details: error.message });
        }
    }

    async createConnection(connectionData, options = {}) {
        try {
            return await this.Connections.create(connectionData, { 
                transaction: options.transaction 
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a kapcsolatot.", {
                details: error.message,
                data: userData,
            });
        }
    }

    async updateConnection(User_Requested_ID, To_User_ID, updateData, options = {}) {
        try {
            const [affectedRows] = await this.Connections.update(updateData, {
                where: {
                    User_Requested_ID,
                    To_User_ID
                },
                transaction: options.transaction
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("A kapcsolat frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = ConnectionsRepository;
