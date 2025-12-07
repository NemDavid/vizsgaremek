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

            const existingProfiles = await this.userService.getUserByEmail(email); // letezik e ilyen emailhez user
            if (existingProfiles.length == 0) {
                throw new BadRequestError("ehez az emailhez nincs felhasználói fiók");
            }

            const verify_code = authUtils.generateVerifyCode();

            const existing_verify_code = await this.verify_codeService.getVerify_codeByEmail(email);

            let verify_codeData = null;
            if (!existing_verify_code) {
                verify_codeData = await this.verify_codeService.createVerify_code({ email, verify_code });
            }
            else {
                verify_codeData = await this.verify_codeService.updateVerify_codeByEmail(email, { verify_code });
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

    // verify the code and return the profiles
    async verifyTheCode(verifyData) {
        if (!verifyData.email) {
            throw new BadRequestError("hiányzó email");
        }
        if (!verifyData.verify_code) {
            throw new BadRequestError("hiányzó verify_code");
        }

        // van e ilyen emailhez code
        const existing_verify_code = await this.verify_codeService.getVerify_codeByEmail(verifyData.email);  // van e ilyen emailhez code
        if (!existing_verify_code) {
            throw new BadRequestError("ehez az emailhoz nem lett code generálva");
        }


        // van e érvényes code  és lejárt e már
        const has_valid_code = bcrypt.compareSync(verifyData.verify_code, existing_verify_code.verify_code_hash) &&
            existing_verify_code.created_at.getTime() < existing_verify_code.expire_at.getTime();
        if (!has_valid_code) {
            throw new BadRequestError("nincs érvényes verify_code ehhez az emailhez");
        }


        // létezik e ilyen emailhez user
        const existingUsers = await this.userService.getUserByEmail(verifyData.email); // letezik e ilyen emailhez user
        if (!existingUsers) {
            throw new BadRequestError("ehez az emailhez nincs felhasználói fiók");
        }

        const filteredUsers = existingUsers.map(user => ({
            ID: user.ID,
            email: user.email,
            username: user.username,
            avatar_url: user.profile.avatar_url
        }));


        return filteredUsers;
    }

    // new password set
    async setNewPassword(newPasswordData) {
        if (!newPasswordData.userId) {
            throw new BadRequestError("hiányzó userId");
        }
        if (!newPasswordData.password) {
            throw new BadRequestError("hiányzó password");
        }


        // létezik e ilyen emailhez user
        const existingUser = await this.userService.getUserByID(newPasswordData.userId); // letezik e ilyen emailhez user
        if (!existingUser) {
            throw new BadRequestError("nincs ilyen id-vel user");
        }



        // update user password
        const updatedUser = await this.userService.updateUser_Password(newPasswordData.userId, { password_hash: authUtils.hashPassword(newPasswordData.password) });
        if (!updatedUser) {
            throw new BadRequestError("a user jelszava nem lett frissítve");
        }

        // töröljük a használt codeokat
        const deleteProcess = await this.verify_codeService.deleteVerify_codesByEmail(existingUser.email); // töröljük a használt codeokat
        if (deleteProcess.deleted == 0) {
            throw new BadRequestError("nem sikerült törölni a használt verify_codeokat");
        }


        return { message: "jelszó sikeresen frissítve" };
    }
}

module.exports = NotificationService;