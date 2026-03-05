const { DbError } = require("../errors");

class Verify_CodeRepository {
    constructor(db) {
        this.Verify_Code = db.Verify_Code;
        this.sequelize = db.sequelize;
    }

    async getVerify_codes(options = {}) {
        try {
            return await this.Verify_Code.scope("allVerify_CodeData").findAll({
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni az Verify_Code", { details: error.message });
        }
    }

    async getVerify_code(itemId, options = {}) {
        try {
            return await this.Verify_Code.scope("allVerify_CodeData").findOne({
                where: {
                    ID: itemId,
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a Verify_Code", { details: error.message });
        }
    }

    async getVerify_codeByEmail(email, options = {}) {
        try {
            return await this.Verify_Code.scope("allVerify_CodeData").findOne({
                where: {
                    email: email
                },
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Nem sikerült lekérni a Verify_Code", { details: error.message });
        }
    }

    async deleteVerify_code(itemId, options = {}) {
        try {
            const deletedRow = await this.Verify_Code.destroy({
                where: { ID: itemId },
                transaction: options.transaction
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async deleteVerify_codesByEmail(email, options = {}) {
        try {
            const deletedRow = await this.Verify_Code.destroy({
                where: { email: email },
                transaction: options.transaction
            });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createVerify_code(verify_codeData, options = {}) {
        try {
            return await this.Verify_Code.create(verify_codeData, {
                transaction: options.transaction
            });
        } catch (error) {
            throw new DbError("Szerver oldali hiba törtent, próbáld meg késöbb", {
                details: error.message,
                data: verify_codeData,
            });
        }
    }

    async updateVerify_codeByEmail(email, updateData, options = {}) {
        try {
            const [affectedRows] = await this.Verify_Code.update(updateData, {
                where: { email: email },
                transaction: options.transaction
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = Verify_CodeRepository;
