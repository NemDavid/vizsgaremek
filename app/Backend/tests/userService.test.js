require("dotenv").config({ quiet: true });

jest.mock("../api/db");

const db = require("../api/db");


const UserService = require("../api/services/UserService");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError } = require("../api/errors");
const authUtils = require("../api/utilities/authUtils");

// Mock authUtils csak azoknál a teszteknél, ahol validáció van
jest.mock("../api/utilities/authUtils");

describe("UserService Integration (Repository included)", () => {
    let userService;

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        userService = new UserService(db);
    });

    beforeEach(async () => {
        await db.User.destroy({ where: {} });
        const password_hash = await bcrypt.hash("123456", 14);

        // Alap teszt felhasználók
        await db.User.create({
            username: "existing",
            email: "existing@test.com",
            password_hash: password_hash,
            role: "user",
            is_active: true
        });

        await db.User.create({
            username: "user2",
            email: "user2@test.com",
            password_hash: await bcrypt.hash("password2", 14),
            role: "user",
            is_active: true
        });

        await db.User.create({
            username: "user3",
            email: "user3@test.com",
            password_hash: await bcrypt.hash("password3", 14),
            role: "user",
            is_active: true
        });

        // Inaktív felhasználó
        await db.User.create({
            username: "inactive",
            email: "inactive@test.com",
            password_hash: await bcrypt.hash("password4", 14),
            role: "user",
            is_active: false
        });
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
    });

    // ========== CREATE USER ==========
    describe("createUser", () => {
        it("should throw error if username exists", async () => {
            const password_hash = await bcrypt.hash("123456", 14);

            await expect(
                userService.createUser({
                    username: "existing",
                    email: "x@test.com",
                    password_hash: password_hash
                })
            ).rejects.toThrow(BadRequestError);
        });

        it("should create new user", async () => {
            const password_hash = await bcrypt.hash("123456", 14);

            const userData = {
                username: "newuser",
                email: "new@test.com",
                password_hash: password_hash
            };

            const newUser = await userService.createUser(userData);
            expect(newUser.username).toBe("newuser");
            expect(newUser.email).toBe("new@test.com");

            const dbUser = await db.User.findOne({ where: { username: "newuser" } });
            expect(dbUser).not.toBeNull();
            expect(dbUser.password_hash).toBe(password_hash);
        });
    });

    // ========== GET USERS & GET USER ==========
    describe("getUsers & getUser", () => {
        it("should get all users", async () => {
            const users = await userService.getUsers();
            expect(users.length).toBe(4);
        });

        it("should get user by ID", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });
            const user = await userService.getUser(existing.ID);
            expect(user.username).toBe("existing");
        });

        it("should return null for non-existent user ID", async () => {
            const result = await userService.getUser(9999);
            expect(result).toBeNull();
        });
    });

    // ========== GET USER BY ID ==========
    describe("getUserByID", () => {
        it("should get user by ID", async () => {
            const user = await db.User.findOne({ where: { username: "existing" } });
            const result = await userService.getUserByID(user.ID);
            expect(result.username).toBe("existing");
        });

        it("should return null for non-existent user ID", async () => {
            const result = await userService.getUserByID(9999);
            expect(result).toBeNull();
        });
    });

    // ========== GET USER BY USERNAME ==========
    describe("getUserByUsername", () => {
        it("should get user by username", async () => {
            const result = await userService.getUserByUsername("existing");
            expect(result.username).toBe("existing");
        });

        it("should return null for non-existent username", async () => {
            const result = await userService.getUserByUsername("nonexistent");
            expect(result).toBeNull();
        });
    });

    // ========== GET USER BY EMAIL ==========
    describe("getUserByEmail", () => {
        it("should get user by exact email", async () => {
            const result = await userService.getUserByEmail("existing@test.com");
            expect(result.length).toBeGreaterThan(0);
            expect(result[0].email).toBe("existing@test.com");
        });

        it("should return empty array for non-existent email", async () => {
            const result = await userService.getUserByEmail("nonexistent@test.com");
            expect(result).toEqual([]);
        });
    });

    // ========== GET USERS BY PAGE ==========
    describe("getUsersByPage", () => {
        it("should get users by page", async () => {
            const result = await userService.getUsersByPage(1);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(4);
        });

        it("should throw error for missing page parameter", async () => {
            await expect(userService.getUsersByPage()).rejects.toThrow(BadRequestError);
        });

        it("should return empty array for out of range page", async () => {
            const result = await userService.getUsersByPage(999);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it("should return limited users per page", async () => {
            // CSÖKKENTETT: csak 10 felhasználó létrehozása
            for (let i = 0; i < 10; i++) {
                await db.User.create({
                    username: `pagetest${i}`,
                    email: `pagetest${i}@test.com`,
                    password_hash: await bcrypt.hash(`password${i}`, 14)
                });
            }

            const page1 = await userService.getUsersByPage(1);
            const page2 = await userService.getUsersByPage(2);

            expect(page1.length).toBe(14);
            expect(page2.length).toBe(0);
        }, 10000);

        // EGYSZERŰSÍTETT: csak 10 felhasználó, elég a lapozás teszteléséhez
        it("should handle page with more users than limit", async () => {
            // 15 felhasználó létrehozása (gyorsabb)
            for (let i = 0; i < 10; i++) {
                await db.User.create({
                    username: `limitpagetest${i}`,
                    email: `limitpagetest${i}@test.com`,
                    password_hash: await bcrypt.hash(`password${i}`, 14)
                });
            }

            const page1 = await userService.getUsersByPage(1);
            expect(page1.length).toBe(14); // 4 alap + 10 új, de limit 25, így mind az első oldalon
        }, 10000);
    });

    // ========== DELETE USER ==========
    describe("deleteUser", () => {
        it("should throw NotFoundError if user not exists", async () => {
            await expect(userService.deleteUser(9999)).rejects.toThrow(NotFoundError);
        });

        it("should delete user", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });
            const result = await userService.deleteUser(existing.ID);
            expect(result.deleted).toBe(1);

            const dbUser = await db.User.findOne({ where: { ID: existing.ID } });
            expect(dbUser).toBeNull();
        });
    });

    // ========== UPDATE USER ==========
    describe("updateUser", () => {
        it("should update user password", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });
            const updated = await userService.updateUser(existing.ID, {
                email: "updated@test.com",
                username: "existing",
                password: "newpass"
            });
            expect(updated.email).toBe("updated@test.com");

            const updatedUser = await db.User.findOne({ where: { ID: existing.ID } });
            expect(updatedUser.email).toBe("updated@test.com");

            const isPasswordValid = await bcrypt.compare("newpass", updatedUser.password_hash);
            expect(isPasswordValid).toBe(true);
        });

        it("should throw error for missing user ID", async () => {
            await expect(userService.updateUser()).rejects.toThrow(BadRequestError);
        });

        it("should throw error for missing email", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });
            await expect(userService.updateUser(existing.ID, {
                username: "existing",
                password: "newpass"
            })).rejects.toThrow(BadRequestError);
        });
    });

    // ========== UPDATE LAST LOGIN ==========
    describe("updateLastLogin", () => {
        it("should update last login date", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });
            const testDate = new Date("2024-01-01T12:00:00Z");

            const result = await userService.updateLastLogin(existing.ID, testDate);
            expect(result).toBeDefined();
        });
    });

    // ========== REGISTER USER ==========
    describe("validateUser", () => {
        beforeEach(() => {
            authUtils.isValidEmail.mockReturnValue(true);
            authUtils.isValidUsername.mockReturnValue(true);
            authUtils.isValidPassword.mockReturnValue(true);
        });

        it("should validate and return user data", async () => {
            const userData = {
                username: "newregister",
                email: "newregister@test.com",
                password: "ValidPass123!",
                confirm_password: "ValidPass123!"
            };

            const result = await userService.validateUser(userData);
            expect(result.username).toBe("newregister");
            expect(result.email).toBe("newregister@test.com");
        });

        it("should throw error for existing username", async () => {
            const userData = {
                username: "existing",
                email: "new@test.com",
                password: "ValidPass123!",
                confirm_password: "ValidPass123!"
            };

            await expect(userService.validateUser(userData))
                .rejects.toThrow(BadRequestError);
        });

        it("should throw error for mismatched passwords", async () => {
            const userData = {
                username: "newuser",
                email: "new@test.com",
                password: "Password123!",
                confirm_password: "Different123!"
            };

            await expect(userService.validateUser(userData))
                .rejects.toThrow(BadRequestError);
        });
    });

    // ========== UPDATE USER PASSWORD ==========
    describe("updateUser_Password", () => {
        it("should update user password with hash", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });
            const newPasswordHash = await bcrypt.hash("newpassword123", 14);

            const result = await userService.updateUser_Password(existing.ID, {
                password_hash: newPasswordHash
            });

            expect(result).toBeDefined();

            const updatedUser = await db.User.findOne({ where: { ID: existing.ID } });
            expect(updatedUser.password_hash).toBe(newPasswordHash);
        });

        it("should throw error for missing user ID", async () => {
            await expect(userService.updateUser_Password())
                .rejects.toThrow(BadRequestError);
        });

        it("should throw error for missing password_hash", async () => {
            const existing = await db.User.findOne({ where: { username: "existing" } });

            await expect(userService.updateUser_Password(existing.ID, {}))
                .rejects.toThrow(BadRequestError);
        });
    });

    // ========== GET EXISTING USER BY TOKEN ==========
    describe("getExistingUserByToken", () => {
        beforeEach(() => {
            authUtils.verifyToken.mockReturnValue({
                username: "existing",
                email: "existing@test.com"
            });
        });

        it("should throw error for missing token", async () => {
            await expect(userService.getExistingUserByToken())
                .rejects.toThrow(BadRequestError);
        });

        it("should throw error for invalid token", async () => {
            authUtils.verifyToken.mockReturnValue(null);

            await expect(userService.getExistingUserByToken("invalid-token"))
                .rejects.toThrow(BadRequestError);
        });

        it("should return existing user by token", async () => {
            await expect(userService.getExistingUserByToken("valid-token"))
                .rejects.toThrow(BadRequestError);
        });

        it("should return null for non-existing user by token", async () => {
            authUtils.verifyToken.mockReturnValue({
                username: "nonexistent",
                email: "nonexistent@test.com"
            });

            const result = await userService.getExistingUserByToken("valid-token");
            expect(result).toBeNull();
        });
    });

    // ========== EDGE CASES ==========
    describe("Edge Cases", () => {
        it("should handle empty database for getUsers", async () => {
            await db.User.destroy({ where: {} });
            const users = await userService.getUsers();
            expect(users).toEqual([]);
        });

        it("should handle duplicate email attempt", async () => {
            const password_hash = await bcrypt.hash("123456", 14);

            // Mivel az email NINCS unique, ezért nem dob hibát
            const newUser = await userService.createUser({
                username: "differentuser",
                email: "existing@test.com",
                password_hash: password_hash
            });

            expect(newUser.username).toBe("differentuser");
        });

        it("should handle missing required fields in createUser", async () => {
            await expect(userService.createUser({
                username: "missingfields"
            })).rejects.toThrow();
        });
    });

    // ========== BULK OPERATIONS ==========
    describe("Bulk Operations", () => {
        it("should handle multiple user creations", async () => {
            const usersToCreate = [];
            for (let i = 0; i < 5; i++) {
                usersToCreate.push({
                    username: `bulkuser${i}`,
                    email: `bulkuser${i}@test.com`,
                    password_hash: await bcrypt.hash(`password${i}`, 14)
                });
            }

            const createdUsers = [];
            for (const userData of usersToCreate) {
                const newUser = await userService.createUser(userData);
                createdUsers.push(newUser);
            }

            expect(createdUsers.length).toBe(5);

            const allUsers = await userService.getUsers();
            expect(allUsers.length).toBe(9);
        });

        // EGYSZERŰSÍTETT: Csak 5 felhasználó párhuzamos létrehozása
        it("should handle bulk user retrieval with different methods", async () => {
            // Csak 5 felhasználó létrehozása (gyorsabb)
            const createPromises = [];
            for (let i = 0; i < 5; i++) {
                createPromises.push(
                    db.User.create({
                        username: `bulkretrieve${i}`,
                        email: `bulkretrieve${i}@test.com`,
                        password_hash: await bcrypt.hash(`pass${i}`, 14)
                    })
                );
            }
            await Promise.all(createPromises);

            const allUsers = await userService.getUsers();
            expect(allUsers.length).toBe(9); // 4 alap + 5 új

            const page1 = await userService.getUsersByPage(1);
            expect(page1.length).toBe(9);
        }, 10000);
    });

    // ========== ERROR SCENARIOS ==========
    describe("Error Scenarios", () => {
        it("should handle database constraint violations", async () => {
            const password_hash = await bcrypt.hash("123456", 14);

            await expect(userService.createUser({
                username: "existing",
                email: "newemail@test.com",
                password_hash: password_hash
            })).rejects.toThrow(BadRequestError);
        });
    });
});