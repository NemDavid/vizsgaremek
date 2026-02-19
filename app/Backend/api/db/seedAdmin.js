const UserService = require("../services/UserService");
const User_ProfileService = require("../services/User_ProfileService");
const User_SettingsService = require("../services/User_SettingsService");
const authUtils = require("../utilities/authUtils");

const DEFAULT_AVATAR =
  "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png";

const ADMIN_DATA = {
  email: "ad@ad.ad",
  username: "admin",
  password: "12345678",
  role: "admin",
};

const EXAMPLE_ACCOUNT = {
  email: "user@ad.ad",
  username: "user",
  password: "12345678",
  role: "user",
};

function makeTestUsers(count = 60, startIndex = 1) {
  // user1...user60 (vagy startIndex-től)
  return Array.from({ length: count }, (_, i) => {
    const n = startIndex + i;
    return {
      email: `test${n}@seed.local`,
      username: `test${n}`,
      password: "12345678",
      role: "user",
      first_name: `Test${n}`,
      last_name: "User",
      avatar_url: DEFAULT_AVATAR,
    };
  });
}

async function seedOneUser({ userService, userProfileService, settingsService }, u) {
  const existing = await userService.getUserByUsername(u.username);
  if (existing) {
    console.log(`[Seed] ${u.username} már létezik, skip`);
    return existing;
  }

  const newUser = await userService.createUser({
    email: u.email,
    password_hash: authUtils.hashPassword(u.password),
    username: u.username,
    role: u.role,
  });

  await userProfileService.createUser_Profile({
    USER_ID: newUser.ID,
    first_name: u.first_name ?? u.username,
    last_name: u.last_name ?? "User",
    avatar_url: u.avatar_url ?? DEFAULT_AVATAR,
  });

  await settingsService.createUser_SettingsByID(newUser.ID);

  console.log(`[Seed] ${u.username} létrehozva (ID=${newUser.ID})`);
  return newUser;
}

async function seedAdminUser(db) {
  try {
    const userService = new UserService(db);
    const userProfileService = new User_ProfileService(db);
    const settingsService = new User_SettingsService(db);

    const ctx = { userService, userProfileService, settingsService };

    const usersToSeed = [
      {
        ...ADMIN_DATA,
        first_name: "Admin",
        last_name: "User",
        avatar_url: DEFAULT_AVATAR,
      },
      {
        ...EXAMPLE_ACCOUNT,
        first_name: "Example",
        last_name: "User",
        avatar_url: DEFAULT_AVATAR,
      },
      ...makeTestUsers(60, 1),
    ];

    for (const u of usersToSeed) {
      await seedOneUser(ctx, u);
    }

    console.log(`[Seed] Kész: ${usersToSeed.length} user ellenőrizve/seedelve`);
  } catch (error) {
    console.error(
      "[Seed] Default felhasználók létrehozása sikertelen:",
      error.message,
      error.stack,
      error
    );
  }
}

module.exports = seedAdminUser;
