const { Op, where } = require("sequelize")
const { Op, where } = require("sequelize")
const { DbError } = require("../errors");

class KickRepository {
    constructor(db) {
        this.Kick = db.Kick;
        this.User = db.User;
        this.sequelize = db.sequelize;
    }

    async getKicks() {
        try {
            return await this.Kick.scope("allKickData").findAll();
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }
    async getMyKicks(userId) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: {
                    [Op.or]: [
                        { FROM_USER_ID: userId },
                        { TO_USER_ID: userId }
                    ],
                },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }
    async getMyKicks(userId) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: {
                    [Op.or]: [
                        { FROM_USER_ID: userId },
                        { TO_USER_ID: userId }
                    ],
                },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgásokat.", { details: error.message });
        }
    }
    async getKickByUserId(FROM_USER_ID, TO_USER_ID) {
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
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    // én kiket rúgtam
    async getKicksSentByUser(userId) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: { FROM_USER_ID: userId },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    // ki rúgott engem
    async getKicksRecievedByUser(userId) {
        try {
            return await this.Kick.scope("allKickData").findAll({
                where: { TO_USER_ID: userId },
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a rúgást.", { details: error.message });
        }
    }

    async createKick(kickData) {
        try {
            return await this.Kick.create(kickData);
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a rúgást.", {
                details: error.message,
                data: kickData,
            });
        }
    }

    async updateKick(ID, updatedata) {
        try {
            const [affectedRows] = await this.Kick.update(updatedata, {
                where: { ID }
            })

            return affectedRows
        } catch (error) {
            throw new DbError("A rúgást frissítése sikertelen.", { details: error.message })
        }
    }
}

module.exports = KickRepository;
