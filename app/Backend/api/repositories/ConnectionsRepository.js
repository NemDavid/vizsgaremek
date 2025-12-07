const { where } = require("sequelize");
const { DbError } = require("../errors");

class ConnectionsRepository {
    constructor(db) {
        this.Connections = db.Connections;
        this.sequelize = db.sequelize;
    }

    async getConnections() {
        try {
            return await this.Connections.scope("allConnectionData").findAll();
        } catch (error) {
            throw new DbError("Failed to fetch connections", { details: error.message });
        }
    }

    async getConnection(User_Requested_ID, To_User_ID) {
        try {
            return await this.Connections.scope("allConnectionData").findOne({
                where: {
                    User_Requested_ID: User_Requested_ID,
                    To_User_ID: To_User_ID
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch connections", { details: error.message });
        }
    }

    async getCurrentUserConnections(User_Requested_ID) {
        try {
            return await this.Connections.scope("allConnectionData").findAll({
                where: {
                    User_Requested_ID: User_Requested_ID
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch connections", { details: error.message });
        }
    }

    async deleteConnection(User_Requested_ID, To_User_ID) {
        try {
            const deletedRow = await this.Connections.destroy({
                where: {
                    User_Requested_ID: User_Requested_ID,
                    To_User_ID: To_User_ID
                }
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createConnection(connectionData) {
        
        try {
            return await this.Connections.create(connectionData);
        } catch (error) {
            throw new DbError("Failed to create connections object", {
                details: error.message,
                data: userData,
            });
        }
    }

    async updateConnection(User_Requested_ID, To_User_ID, Status) {
        try {
            const [affectedRows] = await this.Connections.update({ Status }, {
                where: {
                    User_Requested_ID: User_Requested_ID,
                    To_User_ID: To_User_ID
                }
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = ConnectionsRepository;
