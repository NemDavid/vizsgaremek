const bcrypt = require("bcrypt")

const salt = 14

const ADMIN_DATA = {
  email: "admin@example.com",
  username: "admin",
  password: "Adminfiok#123",
  role: "admin",
  is_active: 1,
}

async function seedAdminUser(db) {
  try {
    const existingAdmin = await db.User.findOne({
      where: { username: ADMIN_DATA.username },
    })

    if (existingAdmin) {
      console.log("[Seed] Admin felhasználó már létezik")
      return
    }

    const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, salt)

    const today = new Date().toISOString().split("T")[0]
    const adminUser = await db.User.create({
      email: ADMIN_DATA.email,
      username: ADMIN_DATA.username,
      password_hash: hashedPassword,
      role: ADMIN_DATA.role,
      is_active: ADMIN_DATA.is_active,
      created_at: today,
      updated_at: today,
    })

    console.log("[Seed] Admin felhasználó sikeresen létrehozva:", {
      ID: adminUser.ID,
      email: adminUser.email,
      username: adminUser.username,
      role: adminUser.role,
    })
  } catch (error) {
    console.error("[Seed] Admin felhasználó létrehozása sikertelen:", error.message)
  }
}

module.exports = seedAdminUser
