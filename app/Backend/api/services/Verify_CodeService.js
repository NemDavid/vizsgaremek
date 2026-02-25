const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class Verify_codeService {
    constructor(db) {
        this.verify_codeRepository = require("../repositories")(db).verify_codeRepository;
    }

    async getVerify_codes(transaction) {
        return await this.verify_codeRepository.getVerify_codes({ transaction });
    }

    async getVerify_code(itemId, transaction) {
        return await this.verify_codeRepository.getVerify_code(itemId, { transaction });
    }

    async getVerify_codeByEmail(email, transaction) {
        if (!email) {
            throw new BadRequestError("Hiányzó email");
        }

        return await this.verify_codeRepository.getVerify_codeByEmail(email, { transaction});
    }

    async deleteVerify_code(itemId, transaction) {
        if (!itemId) {
            throw new BadRequestError("Hiányzó itemId");
        }

        const deleteProcess = await this.verify_codeRepository.deleteVerify_code(itemId, { transaction });

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen code db ben");
        }
        return deleteProcess;
    }

    async deleteVerify_codesByEmail(email, transaction) {
        if (!email) {
            throw new BadRequestError("Hiányzó email");
        }

        const deleteProcess = await this.verify_codeRepository.deleteVerify_codesByEmail(email, { transaction });

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs code db-ben ehhez az emailhez");
        }
        return deleteProcess;
    }

    async createVerify_code(verify_codeData, transaction) {
        if (!verify_codeData.email) {
            throw new BadRequestError("Hianyzó email");
        }

        verify_codeData.verify_code = !verify_codeData.verify_code ? authUtils.generateVerifyCode() : verify_codeData.verify_code;

        verify_codeData.verify_code_hash = authUtils.hashCode("" + verify_codeData.verify_code);

        const createdVerify_Code = await this.verify_codeRepository.createVerify_code(verify_codeData, { transaction });
        return { ...createdVerify_Code, verify_code: verify_codeData.verify_code };
    }

    async updateVerify_codeByEmail(email, updateData, transaction) {
        if (!email) {
            throw new BadRequestError("Hiányzó email");
        }


        updateData.verify_code = !updateData.verify_code ? authUtils.generateVerifyCode() : updateData.verify_code;
        updateData.verify_code_hash = authUtils.hashCode("" + updateData.verify_code);

        const affectedRows = await this.verify_codeRepository.updateVerify_codeByEmail(email, updateData, { transaction });

        if (!affectedRows) {
            throw new BadRequestError("Code nem található", { details: `email: ${email}` })
        }

        const updateverify_code = await this.verify_codeRepository.getVerify_codeByEmail(email, { transaction });

        if (!updateverify_code) {
            throw new BadRequestError("A frissitett code nem található", { details: `id: ${email}` });
        }

        updateverify_code.verify_code = updateData.verify_code;


        return updateverify_code;
    }

}

module.exports = Verify_codeService;