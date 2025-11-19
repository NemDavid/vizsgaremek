const UserService = require("../services/UserService");
const User_ProfileService = require("../services/User_ProfileService");
const authUtils = require("../utilities/authUtils");

const ADMIN_DATA = {
  email: "ad@ad.ad",
  username: "admin",
  password: "AdminAdmin",
  role: "admin",
  is_active: 1,
};

async function seedAdminUser(db) {
  try {
    // példányosítod az osztályokat
    const userService = new UserService(db);
    const userProfileService = new User_ProfileService(db);

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
      avatar_url: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bogi",
    });

    console.log("[Seed] Admin felhasználó sikeresen létrehozva");
  } catch (error) {
    console.error("[Seed] Admin felhasználó létrehozása sikertelen:", error.message, error.stack, error);
  }
}

module.exports = seedAdminUser;
