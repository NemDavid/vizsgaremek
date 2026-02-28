const request = require("supertest");

require("dotenv").config({ quiet: true });

// ✅ UGYANÚGY MOCKOLUNK, MINT A TÖBBI TESZTNÉL
jest.mock("../api/db");
const db = require("../api/db");

const app = require("../app");
const authUtils = require("../api/utilities/authUtils");

describe("/api/users", () => {
    const rawUsers = [
        {
            ID: 1,
            username: "admin",
            email: "admin@example.com",
            password: "Jelszo123#",
            role: "admin",
            isAdmin: true,
        },
        {
            ID: 2,
            username: "user",
            email: "user@example.com",
            password: "Jelszo123#",
            role: "user",
            isAdmin: false,
        },
        {
            ID: 3,
            username: "seeuser",
            email: "seeuser@example.com",
            password: "Jelszo123#",
            role: "user",
            isAdmin: false,
        },
    ];

    let adminCookie;
    let userCookie;

    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {
        const users = rawUsers.map((u) => ({
            ID: u.ID,
            username: u.username,
            email: u.email,
            role: u.role,
            isAdmin: u.isAdmin,
            password_hash: authUtils.hashPassword(u.password),
        }));

        await db.User.bulkCreate(users);

        const adminToken = authUtils.generateUserToken({
            ID: rawUsers[0].ID,
            username: rawUsers[0].username,
            email: rawUsers[0].email,
            role: rawUsers[0].role,
            isAdmin: true,
        });
        adminCookie = `user_token=${adminToken}`;

        const userToken = authUtils.generateUserToken({
            ID: rawUsers[1].ID,
            username: rawUsers[1].username,
            email: rawUsers[1].email,
            role: rawUsers[1].role,
            isAdmin: false,
        });
        userCookie = `user_token=${userToken}`;
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
    });

    describe("GET /api/users/all", () => {
        test("should return all users (admin)", async () => {
            const res = await request(app)
                .get("/api/users/all")
                .set("Cookie", [adminCookie])
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

        test("should throw UnauthorizedError when missing token", async () => {
            const res = await request(app).get("/api/users/all").expect(401);
            expect(res.body.message).toBeDefined();
        });

        test("should throw ValidationError when token is invalid", async () => {
            const res = await request(app)
                .get("/api/users/all")
                .set("Cookie", [`${adminCookie}_invalid`])
                .expect(403);

            expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
        });
    });

    describe("GET /api/users/id/:userId", () => {
        test("should return user by ID (admin)", async () => {
            const res = await request(app)
                .get(`/api/users/id/${rawUsers[1].ID}`)
                .set("Cookie", [adminCookie])
                .expect(200);

            expect(res.body.ID).toBe(rawUsers[1].ID);
            expect(res.body.username).toBe(rawUsers[1].username);
        });

        test("should return null for non-existent (admin)", async () => {
            const res = await request(app)
                .get("/api/users/id/999999")
                .set("Cookie", [adminCookie])
                .expect(200);

            expect(res.body).toBeNull();
        });
    });

    describe("GET /api/users/see/:uniqIdentifier", () => {
        test("should return user by username (admin)", async () => {
            const res = await request(app)
                .get("/api/users/see/seeuser")
                .set("Cookie", [adminCookie])
                .expect(200);

            expect(res.body.username).toBe("seeuser");
        });

        test("should return user by ID string (admin)", async () => {
            const res = await request(app)
                .get(`/api/users/see/${rawUsers[2].ID}`)
                .set("Cookie", [adminCookie])
                .expect(200);

            expect(res.body.ID).toBe(rawUsers[2].ID);
        });
    });

    describe("PATCH /api/users/:userId", () => {
        test("should update user successfully (admin)", async () => {
            // ✅ password kötelező az API-ban update-nél
            const updateData = {
                email: "updated@test.com",
                username: "afterupdate",
                password: "Jelszo123#",
            };

            const res = await request(app)
                .patch(`/api/users/${rawUsers[1].ID}`)
                .send(updateData)
                .set("Cookie", [adminCookie])
                .expect(200);

            expect(res.body.email).toBe("updated@test.com");
            expect(res.body.username).toBe("afterupdate");
        });

        test("should return 400 for missing email in update (admin)", async () => {
            const updateData = { username: "afterupdate" };

            const res = await request(app)
                .patch(`/api/users/${rawUsers[1].ID}`)
                .send(updateData)
                .set("Cookie", [adminCookie])
                .expect(400);

            expect(res.body.message).toContain("Hiányzó email");
        });
    });

    describe("DELETE /api/users/:userId", () => {
        test("should delete user successfully (admin)", async () => {
            await request(app)
                .delete(`/api/users/${rawUsers[2].ID}`)
                .set("Cookie", [adminCookie])
                .expect(200);
        });

        test("should return 404 for non-existent user (admin)", async () => {
            await request(app)
                .delete("/api/users/999999")
                .set("Cookie", [adminCookie])
                .expect(404);
        });
    });

    describe("PATCH /api/users/password/change", () => {
        test("401: no cookie token -> Hiányzó user token", async () => {
            await request(app)
                .patch("/api/users/password/change")
                .send({ old_password: "a", new_password: "b", confirm_password: "b" })
                .expect(401);
        });

        test("should work with logged-in user (basic expectation)", async () => {
            await request(app)
                .patch("/api/users/password/change")
                .set("Cookie", [userCookie])
                .send({
                    old_password: "Jelszo123#",
                    new_password: "Jelszo123#4",
                    confirm_password: "Jelszo123#4",
                })
                .expect((res) => {
                    if (res.status === 401) throw new Error("Should not be 401 with valid cookie");
                });
        });
    });

    describe("GET /api/users/search", () => {
        test("should return user for exact username (logged in)", async () => {
            const res = await request(app)
                .get("/api/users/search")
                .set("Cookie", [userCookie])
                .query({ q: "user", page: 1, pageSize: 10 })
                .expect(200);

            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body.items)).toBe(true);
        });

        test("should throw 400 if query is less than 3 characters (logged in)", async () => {
            const res = await request(app)
                .get("/api/users/search")
                .set("Cookie", [userCookie])
                .query({ q: "ab", page: 1, pageSize: 10 })
                .expect(400);

            expect(res.body.message).toBe("Legalább 3 karakter szükséges a kereséshez");
        });

        test("should throw 400 if query parameter is missing (logged in)", async () => {
            const res = await request(app)
                .get("/api/users/search")
                .set("Cookie", [userCookie])
                .expect(400);

            expect(res.body.message).toBe("Legalább 3 karakter szükséges a kereséshez");
        });
    });
});