const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");



describe("/api/profiles", () => {
    const rawUsers = [
        { ID: 1, username: "admin", email: "admin@example.com", password: "Jelszo123#", role: "admin" },
        { ID: 2, username: "user", email: "user@example.com", password: "Jelszo123#", role: "user" },
    ];

    const rawProfiles = [
        { USER_ID: 1, first_name: "Gergő", last_name: "Kovács", birth_date: "1990-05-10", bio: "Admin profil", avatar_url: "/admin.png" },
        { USER_ID: 2, first_name: "John", last_name: "Doe", birth_date: "1999-07-05", bio: "User profil", avatar_url: "/user.png" }
    ];

    const settings = [{
        ID: 1,
        Notifications: {
            new_post: false,
            new_comment_on_post: false,
            new_reaction_on_post: false,
            new_login: false,
            new_friend_request: false,
        },
        DataPrivacy: false,
    }];

    const testUser = {
        ID: rawUsers[0].ID,
        username: rawUsers[0].username,
        email: rawUsers[0].email,
        role: rawUsers[0].role,
    }
    let token = undefined;
    let cookie = undefined;
    let cookieinvalid = undefined;

    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {
        const users = rawUsers.map(user => ({
            ...user,
            password_hash: authUtils.hashPassword(user.password)
        }));
        await db.User.bulkCreate(users);
        await db.User_Profile.bulkCreate(rawProfiles);
        await db.Settings.bulkCreate(settings);
        token = authUtils.generateUserToken(testUser);
        cookie = `user_token=${token}`;
        cookieinvalid = `user_token=${token}_invalid`;
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
        await db.Settings.destroy({ where: {} });
    });

    describe("GET", () => {
        describe("GET /api/settings", () => {
            test("should return user settings by cookie", async () => {
                const res = await request(app).get("/api/settings").set("Cookie", [cookie]).expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.ID).toBe(testUser.ID);
            })
            test("should throw UnauthorizedError when missing token", async () => {
                const res = await request(app).get("/api/settings").set("Cookie", [cookieinvalid]).expect(403);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            })
            test("should throw UnauthorizedError when missing token", async () => {
                const res = await request(app).get("/api/settings").expect(401);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            })
        })
    });

    describe("POST", () => {
        describe("POST /api/settings", () => {
            test("should add settings to user", async () => {
                const res = await request(app).post("/api/settings").set("Cookie", [cookie]).expect(201);


                expect(res.body.user_Settings).toBeDefined();
            })
            test("should throw ValidationError when token is invalid", async () => {
                const res = await request(app).post("/api/settings").set("Cookie", [cookieinvalid]).expect(403);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            })
            test("should throw UnauthorizedError when missing token", async () => {
                const res = await request(app).post("/api/settings").expect(401);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            })
        })
    });

    describe("DELETE", () => {
        describe("DELETE /api/settings", () => {
            test("should delete setting", async () => {
                await request(app).delete("/api/settings").set("Cookie", [cookie]).expect(200);
            })
            test("should throw error if user hasn't settings", async () => {
                const testUser = {
                    ID: rawUsers[1].ID,
                    username: rawUsers[1].username,
                    email: rawUsers[1].email,
                    role: rawUsers[0].role,
                }
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const res = await request(app).delete("/api/settings").set("Cookie", [cookie]).expect(400);

                expect(res.body.message).toBe("Nincs ilyen settings");
            })
            test("should throw ValidationError when token is invalid", async () => {
                const res = await request(app).delete("/api/settings").set("Cookie", [cookieinvalid]).expect(403);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            })
            test("should throw ValidationError when token is invalid", async () => {
                const res = await request(app).delete("/api/settings").expect(401);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token")
            })
        })
    });

    describe("UPDATE", () => {
        describe("UPDATE /api/settings", () => {
            test("should update", async () => {
                const Notifications = {
                    new_post: true,
                    new_comment_on_post: true,
                    new_reaction_on_post: true,
                    new_login: true,
                    new_friend_request: true,
                }

                const res = await request(app).patch("/api/settings").send({ Notifications, DataPrivacy: true }).set("Cookie", [cookie]).expect(200);


                expect(res.body).toBeDefined();
                expect(res.body.Notifications).toEqual(expect.objectContaining(
                    {
                        new_post: Notifications.new_post,
                        new_comment_on_post: Notifications.new_comment_on_post,
                        new_reaction_on_post: Notifications.new_reaction_on_post,
                        new_login: Notifications.new_login,
                        new_friend_request: Notifications.new_friend_request,
                    }
                ));
            })
            test("shouldn't update if no changes", async () => {
                const Notifications = {
                    new_post: false,
                    new_comment_on_post: false,
                    new_reaction_on_post: false,
                    new_login: false,
                    new_friend_request: false,
                }

                const res = await request(app).patch("/api/settings").send({ Notifications, DataPrivacy: false }).set("Cookie", [cookie]).expect(200);

                expect(res.body).toBeDefined();
                expect(res.body.Notifications).toEqual(expect.objectContaining(
                    {
                        new_post: Notifications.new_post,
                        new_comment_on_post: Notifications.new_comment_on_post,
                        new_reaction_on_post: Notifications.new_reaction_on_post,
                        new_login: Notifications.new_login,
                        new_friend_request: Notifications.new_friend_request,
                    }
                ));
            })
            test("shouldn throw error on missing json file", async () => {
                const Notifications = undefined

                const res = await request(app).patch("/api/settings").send({ Notifications, DataPrivacy: undefined }).set("Cookie", [cookie]).expect(400);


                expect(res.body.message).toBe("Hiányzik JSON Fálj");

            })
            test("should throw ValidationError when token is invalid", async () => {
                const Notifications = {
                    new_post: true,
                    new_comment_on_post: true,
                    new_reaction_on_post: true,
                    new_login: true,
                    new_friend_request: true,
                }
                const res = await request(app).patch("/api/settings").send({ Notifications, DataPrivacy: true }).set("Cookie", [cookieinvalid]).expect(403);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            })
            test("should throw UnauthorizedError when missing token", async () => {
                const Notifications = {
                    new_post: true,
                    new_comment_on_post: true,
                    new_reaction_on_post: true,
                    new_login: true,
                    new_friend_request: true,
                }
                const res = await request(app).patch("/api/settings").send({ Notifications, DataPrivacy: true }).expect(401);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            })
        })
    });
});