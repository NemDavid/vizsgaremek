const { Op } = require("sequelize")
const { DbError } = require("../errors");

class KickRepository {
    constructor(db) {
        this.Kick = db.Kick;
        this.User = db.User;
        this.sequelize = db.sequelize;
    }

    async getKicks(options = {}) {
        try {
            return await this.Kick.scope("allKickData").findAll({ transaction: options.transaction });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }

    async getMyKicks(userId, options = {}) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: {
                    [Op.or]: [
                        { FROM_USER_ID: userId },
                        { TO_USER_ID: userId }
                    ],
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }

    async getKicksWithUser(userId, targetUserId, options = {}) {
        try {
            return await this.Kick.scope("allKickData").findOne({
                where: {
                    [Op.or]: [
                        { 
                            FROM_USER_ID: userId,
                            TO_USER_ID: targetUserId,
                         },
                        { 
                            FROM_USER_ID: targetUserId,
                            TO_USER_ID: userId,
                        },
                    ],
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }
    async getMyKicks(userId, options = {}) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: {
                    [Op.or]: [
                        { FROM_USER_ID: userId },
                        { TO_USER_ID: userId }
                    ],
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }
    async getKickByUserId(FROM_USER_ID, TO_USER_ID, options = {}) {
        try {
            return await this.Kick.scope("allKickData").findOne({
                where: {
                    [Op.or]: [
                        {
                            FROM_USER_ID: FROM_USER_ID,
                            TO_USER_ID: TO_USER_ID,
                        },
                        {
                            FROM_USER_ID: TO_USER_ID,
                            TO_USER_ID: FROM_USER_ID,
                        },
                    ],
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    // én kiket rúgtam
    async getKicksSentByUser(userId, options = {}) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: { FROM_USER_ID: userId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    // ki rúgott engem
    async getKicksRecievedByUser(userId, options = {}) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: { TO_USER_ID: userId },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    async createKick(kickData, options = {}) {
        try {
            return await this.Kick.create(kickData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a rúgást.", {
                details: error.message,
                data: kickData,
            });
        }
    }

    async updateKick(ID, updatedata, options = {}) {
        try {
            const [affectedRows] = await this.Kick.update(updatedata, {
                where: { ID },
                transaction: options.transaction
            })

            return affectedRows
        } catch (error) {
            throw new DbError("A rúgást frissítése sikertelen.", { details: error.message })
        }
    }
}

module.exports = KickRepository;
