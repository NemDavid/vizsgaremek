const { BadRequestError } = require("../errors");
const cloudUtils = require("../utilities/cloudUtils");


class AdvertisementService {
    constructor(db) {
        this.advertisementRepository = require("../repositories")(db).advertisementRepository;
    }

    async getAdvertisements(transaction)
    {
        return await this.advertisementRepository.getAdvertisements({ transaction });
    }

    async getAdvertisement(advertisementId, transaction) {
        if (!advertisementId) {
            throw new BadRequestError("hiányzó advertisement ID");
        }

        const validAdvertisement = await this.advertisementRepository.getAdvertisement(advertisementId, { transaction });
        if (!validAdvertisement) {
            throw new BadRequestError("Nincs ilyen hirdetés");
        }

        return validAdvertisement;
    }

    async getRandomAdvertisement(transaction) {
        const randomAdvertisement = await this.advertisementRepository.getRandomAdvertisement({ transaction });
        if (!randomAdvertisement) {
            throw new BadRequestError("Nincs hirdetés");
        }
        return randomAdvertisement;
    }

    async deleteAdvertisement(advertisementId, transaction)
    {
        if (!advertisementId) {
            throw new BadRequestError("hiányzó advertisement ID");
        }

        // van e ilyen kep
        const validAdvertisement = await this.advertisementRepository.getAdvertisement(advertisementId, { transaction });
        if (!validAdvertisement) {
            throw new BadRequestError("Nincs ilyen hirdetés");
        }

        // toroljuk a kepet a cloudbol
        cloudUtils.deleteImage(validAdvertisement.imagePath);

        // torol e sikeresen
        const deleteProcess = await this.advertisementRepository.deleteAdvertisement(advertisementId, { transaction });
        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen hirdetés");
        }
        return deleteProcess;
    }

    async createAdvertisement(advertisementData, transaction)
    {
        if (!advertisementData) {
            throw new BadRequestError("Hiányzik a data");
        }
        if (!advertisementData.imagePath) {
            throw new BadRequestError("Hiányzik a kép");
        }


        return await this.advertisementRepository.createAdvertisement(advertisementData, { transaction });
    }
}

module.exports = AdvertisementService;