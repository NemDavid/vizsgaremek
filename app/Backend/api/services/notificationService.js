const bcrypt = require('bcrypt');
const { BadRequestError } = require('../errors');
const emailUtils = require("../utilities/email");
const authUtils = require("../utilities/authUtils");
const emailTemplates = require("../utilities/emailTemplates");

class NotificationService {
    constructor(verify_codeService, userService, user_SettingsService, connectionService) {
        this.verify_codeService = verify_codeService;
        this.userService = userService;
        this.user_SettingsService = user_SettingsService;
        this.connectionService = connectionService
    }

    async sendNotificationToFriends(user, notificationType) { 
        try {
            // Dev módban csak logoljuk, ne küldjünk emailt
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[DEV] Notification to ${user.email}`);
                return;
            }

            const friendlist = await this.connectionService.getUserFriendlistByID(user.ID);

            await Promise.all(friendlist.map(
                friend => this.sendUserNotification(friend.ID, notificationType)
            )
            );


        } catch (err) {
            // Email hiba nem akadályozza az értesítési folyamatot
            console.error('Hiba az értesítéssel kapcsolatban:', err);
            throw err;
        }
    }

    async sendUserNotification(userId, notificationType) {
        try {
            const user = await this.userService.getUser(userId);

            const userSettings = await this.user_SettingsService.getUser_SettingsByID(user.ID);
            const Notifications = typeof userSettings.Notifications == "string"
                ? JSON.parse(userSettings.Notifications)
                : userSettings.Notifications;

            const subject = 'MiHirunk - Értesítés a fiókoddal kapcsolatban';

            let text = "", html = "", sendEmail = false;


            switch (notificationType) {
                case "new_post":
                    {
                        const template = emailTemplates.newPostNotificationTemplate(user.username);
                        text = template.text;
                        html = template.html;
                        sendEmail = Notifications.new_post;
                    }

                    break;
                default:
                    throw new BadRequestError("Ismeretlen értesítési típus");
            }


            if (sendEmail) {
                await emailUtils.sendEmail({ to: user.email, subject, text, html });
            }

        } catch (err) {
            // Email hiba nem akadályozza az értesítési folyamatot
            console.error('Hiba az értesítéssel kapcsolatban:', err);
            throw err;
        }
    }



    async sendNotificationToUser(user, notificationType) {
        
        try {
            // Dev módban csak logoljuk, ne küldjünk emailt
            if (process.env.NODE_ENV !== 'production') {
                console.log(`[DEV] Login notification to ${user.email}`);
                return;
            }




            const userSettings = await this.user_SettingsService.getUser_SettingsByID(user.ID);
            const Notifications = typeof userSettings.Notifications == "string"
                ? JSON.parse(userSettings.Notifications)
                : userSettings.Notifications;

            const subject = 'MiHirunk - Értesítés a fiókoddal kapcsolatban';

            let text = "", html = "";
            let sendEmail = true;




            switch (notificationType) {
                case "login":
                    {

                        const template = emailTemplates.loginNotificationTemplate(user.username);
                        text = template.text;
                        html = template.html;
                        sendEmail = Notifications.new_login;
                    }

                    break;
                case "new_friendrequest":
                    {
                        const template = emailTemplates.newFriendRequestNotificationTemplate(user.username);
                        text = template.text;
                        html = template.html;
                        sendEmail = Notifications.new_friend_request;
                    }

                    break;
                case "new_post_comment":
                    {
                        const template = emailTemplates.newCommentNotificationTemplate(user.username);
                        text = template.text;
                        html = template.html;
                        sendEmail = Notifications.new_comment_on_post;
                    }

                    break;
                case "new_post_reaction":
                    {
                        const template = emailTemplates.newReactionNotificationTemplate(user.username);
                        text = template.text;
                        html = template.html;
                        sendEmail = Notifications.new_reaction_on_post;
                    }

                    break;
                default:
                    throw new BadRequestError("Ismeretlen értesítési típus");
            }


            if (!sendEmail) return;

            await emailUtils.sendEmail({ to: user.email, subject, text, html });


        } catch (err) {
            // Email hiba nem akadályozza az értesítési folyamatot
            console.error('Hiba az értesítéssel kapcsolatban:', err);
            throw err;
        }
    }

    // ÚJ: e-mail aktiválás
    async sendRegistrationConfirm(user, confirmUrl) {
        try {
            const subject = 'MiHirunk - Regisztráció megerősítése';
            const html =
                `
                    <p>Szia <strong>${user.username}</strong>!</p>
                    <p>Kérjük, erősítsd meg a regisztrációdat az alábbi linkre kattintva:</p>
                    <a href="${confirmUrl}">👉 Fiók aktiválása</a>
                    <p>A link 30 percig érvényes.</p>
                `;
            const text = `Szia ${user.username}, erősítsd meg a regisztrációd itt: ${confirmUrl}`;

            await emailUtils.sendEmail({ to: user.email, subject, text, html });
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

            await emailUtils.sendEmail({ to: email, subject, html });
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