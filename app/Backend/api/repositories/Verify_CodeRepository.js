const { verify } = require("jsonwebtoken");
const { DbError } = require("../errors");

class Verify_CodeRepository {
    constructor(db) {
        this.Verify_Code = db.Verify_Code;
        this.sequelize = db.sequelize;
    }

    async getVerify_codes() {
        try {
            return await this.Verify_Code.scope("allVerify_CodeData").findAll({});
        } catch (error) {
            throw new DbError("Failed to fetch Verify_Code", { details: error.message });
        }
    }

    async getVerify_code(itemId) {
        try {
            return await this.Verify_Code.scope("allVerify_CodeData").findOne({
                where: {
                    ID: itemId,
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch Verify_Code", { details: error.message });
        }
    }

    async getVerify_codeByEmail(email) {
        try {
            return await this.Verify_Code.scope("allVerify_CodeData").findOne({
                where: {
                    email: email
                }
            });
        } catch (error) {
            throw new DbError("Failed to fetch Verify_Code", { details: error.message });
        }
    }

    async deleteVerify_code(itemId) {
        try {
            const deletedRow = await this.Verify_Code.destroy({ where: { ID: itemId } });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async deleteVerify_codesByEmail(email) {
        try {
            const deletedRow = await this.Verify_Code.destroy({ where: { email: email } });

            return { success: true, deleted: deletedRow };
        } catch (error) {
            throw new DbError("Sikertelen törlés", { details: error.message });
        }
    }

    async createVerify_code(verify_codeData) {
        try {
            return await this.Verify_Code.create(verify_codeData);
        } catch (error) {
            throw new DbError("Failed to create verify_code object", {
                details: error.message,
                data: verify_codeData,
            });
        }
    }

    async updateVerify_code(itemId, updateData) {
        try {
            const [affectedRows] = await this.Verify_Code.update(updateData, {
                where: { ID: itemId },
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }

    async updateVerify_codeByEmail(email, updateData) {
        try {
            const [affectedRows] = await this.Verify_Code.update(updateData, {
                where: { email: email },
            });

            return affectedRows;
        } catch (error) {
            throw new DbError("Sikertelen frissítés", { details: error.message });
        }
    }
}

module.exports = Verify_CodeRepository;
