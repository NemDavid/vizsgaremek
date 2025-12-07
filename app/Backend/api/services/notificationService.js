const emailUtil = require('../utilities/email');
const authUtils = require('../utilities/authUtils');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../errors');

class NotificationService {
    constructor(verify_codeService, userService) {
        this.verify_codeService = verify_codeService;
        this.userService = userService;
    }
    async sendWelcome(user) {
        try {
            // Dev módban csak logoljuk, ne küldjünk emailt
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[DEV] Welcome email to ${user.email}`);
                return;
            }

            await emailUtil.sendWelcomeEmail(user);
        } catch (err) {
            // Email hiba nem akadályozza a regisztrációt
            console.error('Hiba a welcome email küldésénél:', err);
            throw err; // vagy return false, attól függően, hogy szeretnéd kezelni
        }
    }

    // ÚJ: e-mail aktiválás
    async sendRegistrationConfirm(user, confirmUrl) {
        try {
            const subject = 'MiHirunk - Regisztráció megerősítése';
            const html = `
                    <p>Szia <strong>${user.username}</strong>!</p>
                    <p>Kérjük, erősítsd meg a regisztrációdat az alábbi linkre kattintva:</p>
                    <a href="${confirmUrl}">👉 Fiók aktiválása</a>
                    <p>A link 30 percig érvényes.</p>
                `;
            const text = `Szia ${user.username}, erősítsd meg a regisztrációd itt: ${confirmUrl}`;

            await emailUtil.sendMail({ to: user.email, subject, text, html });
        } catch (err) {
            console.error("Hiba az aktiváló email küldésénél:", err);
            throw err;
        }
    }

    // send verify code for password reset
    async sendVerifyCode(email) {
        try {  
            if (!email) {
                throw new BadRequestError("hiányzó email");
            }

            const verify_code = authUtils.generateVerifyCode();

            const existing_verify_codes = await this.verify_codeService.getVerify_codeByEmail(email);
            const verify_codeData = null;
            if (!existing_verify_codes) {
                verify_codeData = await this.verify_codeService.createVerify_code({ email, verify_code });
            }
            else {
                verify_codeData = this.verify_codeService.updateVerify_code(email, {verify_code}); 
            }
            

            const subject = 'MiHirunk - Jelszó visszaállítási ellenőrző kód';
            const html = `
                    <p>Megbaszlak ezzel a koddal: :) <strong>${verify_codeData.verify_code}</strong>!</p>
                `;

            await emailUtil.sendMail({ to: email, subject, html });
        } catch (err) {
            console.error("Hiba az aktiváló email küldésénél:", err);
            throw err;
        }
    }
    // new password set
    async setNewPassword(newPasswordData) {
            if (!newPasswordData.userId) {
                throw new BadRequestError("hiányzó userId");
            }
            if (!newPasswordData.email) {
                throw new BadRequestError("hiányzó email");
            }
            if (!newPasswordData.verify_code) {
                throw new BadRequestError("hiányzó verify_code");
            }
            if (!newPasswordData.password) {
                throw new BadRequestError("hiányzó password");
            }

            const existingUser = await this.userService.getUser(newPasswordData.userId); // letezik e ilyen emailhez user
            if (!existingUser) {
                throw new BadRequestError("nincs ilyen emailhez user");
            }

            const existing_verify_codes = await this.verify_codeService.getVerify_codeByEmail(newPasswordData.email);  // van e ilyen emailhez code
            if (!existing_verify_codes) {
                throw new BadRequestError("ehez az emailhoz nem lett code generálva"); 
            }

            // van e érvényes code
            const has_valid_code = existing_verify_codes.find(vc =>
                bcrypt.compareSync(newPasswordData.verify_code, vc.verify_code_hash) &&
                !vc.used
            )
            if (!has_valid_code) {
                throw new BadRequestError("nincs érvényes verify_code ehhez az emailhez");
            }

            // update user password
            const updatedUser = await this.userService.updateUser_Password(newPasswordData.userId, { password_hash: authUtils.hashPassword(newPasswordData.password) });

            if (!updatedUser) {
                throw new BadRequestError("a user jelszava nem lett frissítve");
            }

            const deleteProcess = await this.verify_codeService.deleteVerify_codesByEmail(newPasswordData.email); // töröljük a használt codeokat
            if (deleteProcess.deleted == 0) {
                throw new BadRequestError("nem sikerült törölni a használt verify_codeokat");
            }

            return { message: "jelszó sikeresen frissítve" };
    }
}

module.exports = NotificationService;