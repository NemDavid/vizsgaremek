const { DbError } = require("../errors");

class AdvertisementRepository {
  constructor(db) {
    this.Advertisement = db.Advertisement;
    this.sequelize = db.sequelize;
  }

  async getAdvertisements(options = {}) {
    try {
      return await this.Advertisement.scope("allAdvertisementData").findAll({
        transaction: options.transaction,
      });
    } catch (error) {
      throw new DbError("Nem sikerült lekérni a hirdetéseket.", {
        details: error.message,
      });
    }
  }

  async countAdvertisement(options = {}) {
    try {
      return await this.Advertisement.scope("allAdvertisementData").count({
        transaction: options.transaction,
      });
    } catch (error) {
      throw new DbError("Nem sikerült lekérni a hirdetést.", {
        details: error.message,
      });
    }
  }

  async getAdvertisement(advertisementId, options = {}) {
    try {
      return await this.Advertisement.scope("allAdvertisementData").findOne({
        where: { ID: advertisementId },
        transaction: options.transaction,
      });
    } catch (error) {
      throw new DbError("Nem sikerült lekérni a hirdetést.", {
        details: error.message,
      });
    }
  }

  async getRandomAdvertisement(options = {}) {
    try {
      return await this.Advertisement.scope("allAdvertisementData").findOne({
        order: this.sequelize.random(),
        transaction: options.transaction,
      });
    } catch (error) {
      throw new DbError("Nem sikerült lekérni a hirdetést.", {
        details: error.message,
      });
    }
  }

  async deleteAdvertisement(advertisementId, options = {}) {
    try {
      const deletedRow = await this.Advertisement.destroy({
        where: { ID: advertisementId },
        transaction: options.transaction,
      });
      return { success: true, deleted: deletedRow };
    } catch (error) {
      throw new DbError("A hirdetés törlése sikertelen.", {
        details: error.message,
      });
    }
  }

  async createAdvertisement(advertisementData, options = {}) {
    try {
      return await this.Advertisement.create(advertisementData, {
        transaction: options.transaction,
      });
    } catch (error) {
      throw new DbError("Nem sikerült létrehozni a hirdetést.", {
        details: error.message,
        data: advertisementData,
      });
    }
  }
}

module.exports = AdvertisementRepository;
