const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError } = require("../errors");
const authUtils = require("../utilities/authUtils");


class AuthService {
    constructor(db, userService, user_profileService, user_SettingsService) {
        this.userService = userService;
        this.user_profileService = user_profileService;
        this.user_SettingsService = user_SettingsService;
        this.notificationService = null;
    }

    setNotificationService(notificationService) {
        this.notificationService = notificationService;
    }

    async registerUser(userData) {
        // Csak validált adatok előkészítése
        const pendingUser = await this.userService.validateUser({
            email: userData.email,
            username: userData.username,
            password: userData.password,
            confirm_password: userData.confirm_password,
        });


        // Token generálása e-mail megerősítéshez
        const registrationToken = authUtils.generateRegistrationToken(pendingUser);

        // Aktiváló link generálása
        const confirmUrl = `${process.env.FRONTEND_URL}${registrationToken}`;

        // Welcome / aktiváló email küldése
        await this.notificationService.sendRegistrationConfirm(pendingUser, confirmUrl);
    }

    async confirmRegistration(token, profileData, transaction) {
        const decoded = authUtils.verifyToken(token);
        if (decoded === null) {
            throw new BadRequestError("Érvénytelen vagy lejárt token.");
        }


        const createdUser = await this.userService.createUser({
            username: decoded.username,
            email: decoded.email,
            password_hash: decoded.password_hash
        },
            transaction
        );

        let newProfile = {
            USER_ID: createdUser.ID,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            birth_date: profileData.birth_date,
            birth_place: profileData.birth_place,
            schools: profileData.schools,
            bio: profileData.bio,
        }

        if (profileData.file) {
            avatar_url = `http://localhost:6769/cloud/${profileData.file.filename}`;
            newProfile.avatar_url = profileData.avatar_url;
        }

        const createdUser_Profile = await this.user_profileService.createUser_Profile(newProfile,
            transaction
        );

        const user_settings = await this.user_SettingsService.createUser_SettingsByID(newProfile.USER_ID, transaction);

        return {
            user: createdUser,
            profile: createdUser_Profile,
            settings: user_settings
        };
    }

    async login(username, password, token = undefined, transaction, req) {
        if (!username) {
            throw new BadRequestError("Hiányzó username");
        }
        if (!password) {
            throw new BadRequestError("Hiányzó password");
        }


        if (token) {
            throw new BadRequestError("Már van bejelentkezett felhasználó ezen a gépen.");
        }

        const user = await this.userService.getUserByUsername(username, transaction);
        if (!user) {
            throw new NotFoundError("Nincs ilyen felhasználó");
        }


        if (!bcrypt.compareSync(password, user.password_hash)) {
            throw new BadRequestError("Hibás jelszó");
        }

        await this.userService.updateLastLogin(user.ID, { is_loggedIn: true, last_login: new Date() }, transaction);

        token = authUtils.generateUserToken(user);

        // email az erintett user nek
        req.afterCommit?.push(() =>
            this.notificationService
                .sendNotificationToUser(user, "login")
                .catch(err => console.error("Email error:", err))
        );

        return { token };
    }

    async logout(token, transaction) {
        await this.userService.updateLastLogout(token, transaction);
    }

    async getActiveTokenDetails(token) {
        const active = authUtils.verifyToken(token);

        if (active == null) {
            throw new BadRequestError("Érvénytelen vagy lejárt token.");
        }
        else {
            return { active };
        }
    }

    async sendVerifyCode(email, transaction) {
        await this.notificationService.sendVerifyCode(email, transaction);
    }

    async verifyTheCode(email, verify_code, transaction) {
        return await this.notificationService.verifyTheCode({
            email,
            verify_code,
        },
            transaction
        )
    }

    async setNewPassword(userId, password, transaction) {
        const result = await this.notificationService.setNewPassword({
            userId,
            password,
        },
            transaction
        );
        return { message: result.message };
    }
}

module.exports = AuthService;