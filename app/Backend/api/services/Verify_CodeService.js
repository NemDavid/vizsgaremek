const { BadRequestError } = require("../errors");
const authUtils = require("../utilities/authUtils");

class Verify_codeService {
    constructor(db) {
        this.verify_codeRepository = require("../repositories")(db).verify_codeRepository;
    }

    async getVerify_codes() {
        return await this.verify_codeRepository.getVerify_codes();
    }

    async getVerify_code(itemId) {
        return await this.verify_codeRepository.getVerify_code(itemId);
    }

    async getVerify_codeByEmail(email) {
        return await this.verify_codeRepository.getVerify_codeByEmail(email);
    }

    async deleteVerify_code(itemId) {
        if (!itemId) {
            throw new BadRequestError("hiányzó itemId");
        }

        const deleteProcess = await this.verify_codeRepository.deleteVerify_code(itemId);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen code db ben");
        }
        return deleteProcess;
    }

    async deleteVerify_codesByEmail(email) {
        if (!email) {
            throw new BadRequestError("hiányzó email");
        }

        const deleteProcess = await this.verify_codeRepository.deleteVerify_codesByEmail(email);

        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("Nincs ilyen code db ben ehhez az emailhez");
        }
        return deleteProcess;
    }

    async createVerify_code(verify_codeData) {
        if (!verify_codeData.email) {
            throw new BadRequestError("hianyzó email");
        }
        verify_codeData.verify_code = !verify_codeData.verify_code ? authUtils.generateVerifyCode() : verify_codeData.verify_code;
        verify_codeData.verify_code_hash = authUtils.hashCode(""+verify_codeData.verify_code);

        const createdVerify_Code = await this.verify_codeRepository.createVerify_code(verify_codeData);
        return { ...createdVerify_Code, verify_code: verify_codeData.verify_code };
    }

    async updateVerify_code(itemId, updateData) {
        if (!itemId) throw new BadRequestError("Hiányzó verify_code ID");
        if (!updateData.email) {
            throw new BadRequestError("Hiányzó email");
        }

        const affectedRows = await this.verify_codeRepository.updateVerify_code(itemId, updateData);

        if (!affectedRows) {
            throw new BadRequestError("code nem található", { details: `id: ${itemId}` })
        }

        const updateverify_code = await this.verify_codeRepository.getVerify_code(itemId);

        if (!updateverify_code) {
            throw new BadRequestError("a frissitett code nem található", { details: `id: ${itemId}` });
        }
        return updateverify_code;
    }

    async updateVerify_codeByEmail(email, updateData) {
        if (!email) throw new BadRequestError("Hiányzó email");
        if (!updateData.verify_code) throw new BadRequestError("hiányzó verify_code");

        updateData.verify_code = !updateData.verify_code ? authUtils.generateVerifyCode() : updateData.verify_code;
        updateData.verify_code_hash = authUtils.hashCode(""+updateData.verify_code);

        const affectedRows = await this.verify_codeRepository.updateVerify_codeByEmail(email, updateData);

        if (!affectedRows) {
            throw new BadRequestError("code nem található", { details: `email: ${email}` })
        }

        const updateverify_code = await this.verify_codeRepository.getVerify_codeByEmail(email);

        if (!updateverify_code) {
            throw new BadRequestError("a frissitett code nem található", { details: `id: ${email}` });
        }
        
        updateverify_code.verify_code = updateData.verify_code;

        console.log(updateverify_code);
        

        return updateverify_code;
    }

}

module.exports = Verify_codeService;