const UserService = require("../services/UserService");
const User_ProfileService = require("../services/User_ProfileService");
const User_SettingsService = require("../services/User_SettingsService");
const authUtils = require("../utilities/authUtils");

const ADMIN_DATA = {
    email: "ad@ad.ad",
    username: "admin",
    password: "12345678",
    role: "admin",
    is_active: 1,
};
const ExampleAccunt = {
    email: "ad@ad.ad",
    username: "user",
    password: "12345678",
    role: "user",
    is_active: 1,
};

async function seedAdminUser(db) {
    try {
        // példányosítod az osztályokat
        const userService = new UserService(db);
        const userProfileService = new User_ProfileService(db);
        const Settings = new User_SettingsService(db);

        const existingAdmin = await userService.getUserByUsername(ADMIN_DATA.username);
        if (!existingAdmin) {
            // létrehozod az admin usert
            const newUser = await userService.createUser({
                email: ADMIN_DATA.email,
                password_hash: authUtils.hashPassword(ADMIN_DATA.password),
                username: ADMIN_DATA.username,
            });


            // létrehozod a profilját
            await userProfileService.createUser_Profile({
                USER_ID: newUser.ID ?? 1,
                first_name: "Admin",
                last_name: "User",
                avatar_url: "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png"
            });

            await Settings.createUser_Settings(newUser.ID ?? 1);

            console.log("[Seed] Admin felhasználó sikeresen létrehozva");
        }
        else {
            console.log("[Seed] Admin felhasználó már létezik, nem lett létrehozva újra");
        }

        const existingExampleUser = await userService.getUserByUsername(ExampleAccunt.username);
        if (!existingExampleUser) {
            // létrehozod az admin usert
            const newUser = await userService.createUser({
                email: ExampleAccunt.email,
                password_hash: authUtils.hashPassword(ExampleAccunt.password),
                username: ExampleAccunt.username,
            });


            // létrehozod a profilját
            await userProfileService.createUser_Profile({
                USER_ID: newUser.ID ?? 2,
                first_name: "Example",
                last_name: "User",
                avatar_url: "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png"
            });

            await Settings.createUser_Settings(newUser.ID ?? 2);

            console.log("[Seed] Example felhasználó sikeresen létrehozva");
        }
        else {
            console.log("[Seed] Example felhasználó már létezik, nem lett létrehozva újra");
        }


    } catch (error) {
        console.error("[Seed] Default felhasználók létrehozása sikertelen:", error.message, error.stack, error);
    }
}




module.exports = seedAdminUser;
