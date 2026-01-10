const { where } = require("sequelize");
const { DbError } = require("../errors");

class KickRepository {
    constructor(db) {
        this.Kick = db.Kick;
        this.User = db.User;
        this.sequelize = db.sequelize;
    }
    ///--------------------CRUD NEM VÉGLEGES-----------------------------
    async getKicks() {
        try {
            return await this.Kick.scope("allKickData").findAll();
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }

    async getKickByID(FROM_USER_ID, TO_USER_ID) {
        try {
            return await this.Kick.scope("allKickData").findOne({
                where: { 
                    FROM_USER_ID: FROM_USER_ID,
                    TO_USER_ID: TO_USER_ID
                },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    async getKicksSentByUser(userId) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: { FROM_USER_ID: userId },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    async getKicksRecievedByUser(userId) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: { TO_USER_ID: userId },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    async getKicksByPage(page) {
        const limit = 25;
        const offset = (page - 1) * limit;
        try {
            return await this.Kick.scope("allKickData").findAll({
                limit,
                offset,
                order: [["ID", "ASC"]],
            });
        } catch (error) {
            throw new DbError("Érvénytelen lapozási paraméter.", { details: error.message });
        }
    }

    async deleteKick(kickId) {
        try {
            const deletedRow = await this.Kick.destroy({ where: { ID: KickId } });
            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A rúgás törlése sikertelen.", { details: error.message });
        }
    }

    async createKick(KickData, options = {}) {
        try {
            return await this.Kick.create(KickData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a rúgást.", {
                details: error.message,
                data: KickData,
            });
        }
    }

    async updateKick(KickId, updateData) {
        try {
            const [affectedRows] = await this.Kick.update(updateData, {
                where: { ID: KickId },
            });
            return affectedRows;
        } catch (error) {
            throw new DbError("A rúgást frissítése sikertelen.", { details: error.message });
        }
    }
}

module.exports = KickRepository;
