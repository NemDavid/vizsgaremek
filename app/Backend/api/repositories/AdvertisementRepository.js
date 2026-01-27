
const { sequelize } = require("../db");
const { DbError } = require("../errors");

class AdvertisementRepository {
    constructor(db) {
        this.Advertisement = db.Advertisement;

    }

    async getAdvertisements() {
        try {
            return await this.Advertisement.scope("allAdvertisementData").findAll();
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a hirdetéseket.", { details: error.message });
        }
    }

    async getAdvertisement(advertisementId) {
        try {
            return await this.Advertisement.scope("allAdvertisementData").findOne({
                where: { ID: advertisementId }
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a hirdetést.", { details: error.message });
        }
    }

    async getRandomAdvertisement() {
        try {
            return await this.Advertisement.scope("allAdvertisementData").findOne({
                order: sequelize.random(),
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a hirdetést.", { details: error.message });
        }
    }

    async deleteAdvertisement(advertisementId) {
        try {
            const deletedRow = await this.Advertisement.destroy({ where: { ID: advertisementId } });
            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("A hirdetés törlése sikertelen.", { details: error.message });
        }
    }

    async createAdvertisement(advertisementData) {
        try {
            return await this.Advertisement.create(advertisementData);
        } catch (error) {
            throw new DbError("Nem sikerült létrehozni a hirdetést.", {
                details: error.message,
                data: advertisementData,
            });
        }
    }

}

module.exports = AdvertisementRepository;
