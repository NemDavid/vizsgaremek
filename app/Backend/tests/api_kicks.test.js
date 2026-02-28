const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");
const { BadRequestError, ValidationError } = require("../api/errors");
const { Op } = require("sequelize");

describe("/api/kicks", () => {
    const rawUsers = [
        {
            ID: 1,
            username: "admin",
            email: "admin@example.com",
            password: "Jelszo123#",
            role: "admin",
        },
        {
            ID: 2,
            username: "user",
            email: "user@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 3,
            username: "user(2)",
            email: "user(2)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 4,
            username: "user(3)",
            email: "user(3)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
    ];

    const rawProfiles = [
        {
            USER_ID: 1,
            first_name: "Gergő",
            last_name: "Kovács",
            avatar_url: "/admin.png",
        },
        {
            USER_ID: 2,
            first_name: "John",
            last_name: "Doe",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 3,
            first_name: "Nem",
            last_name: "David",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 4,
            first_name: "test",
            last_name: "user",
            avatar_url: "/user.png",
        },
    ];

    const settings = [
        {
            ID: 1,
            Notifications: {
                new_post: false,
                new_comment_on_post: false,
                new_reaction_on_post: false,
                new_login: false,
                new_friend_request: false,
            },
            DataPrivacy: false,
        },
        {
            ID: 2,
            Notifications: {
                new_post: false,
                new_comment_on_post: false,
                new_reaction_on_post: false,
                new_login: false,
                new_friend_request: false,
            },
            DataPrivacy: false,
        },
        {
            ID: 3,
            Notifications: {
                new_post: false,
                new_comment_on_post: false,
                new_reaction_on_post: false,
                new_login: false,
                new_friend_request: false,
            },
            DataPrivacy: false,
        },
        {
            ID: 4,
            Notifications: {
                new_post: false,
                new_comment_on_post: false,
                new_reaction_on_post: false,
                new_login: false,
                new_friend_request: false,
            },
            DataPrivacy: false,
        },
    ];

    const rawKicks = [
        {
            FROM_USER_ID: 1,
            TO_USER_ID: 2,
        },
        {
            FROM_USER_ID: 3,
            TO_USER_ID: 1,
        },
    ];

    const testUser = {
        ID: rawUsers[0].ID,
        username: rawUsers[0].username,
        email: rawUsers[0].email,
        role: rawUsers[0].role,
    };
    let token = undefined;
    let cookie = undefined;
    let cookieinvalid = undefined;
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {
        const users = rawUsers.map((user) => ({
            ...user,
            password_hash: authUtils.hashPassword(user.password),
        }));

        await db.User.bulkCreate(users);
        await db.User_Profile.bulkCreate(rawProfiles);
        await db.Settings.bulkCreate(settings);
        await db.Kick.bulkCreate(rawKicks);
        token = authUtils.generateUserToken(testUser);
        cookie = `user_token=${token}`;
        cookieinvalid = `user_token=${token}_invalid`;
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
        await db.Settings.destroy({ where: {} });
        await db.Kick.destroy({ where: {} });
    });

    describe("GET", () => {
        describe("GET /api/kicks", () => {
            describe("GET /api/kicks/all", () => {
                test("should return all kicks from db", async () => {
                    const res = await request(app).get("/api/kicks/all").set("Cookie", [cookie]).expect(200);

                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            rawKicks.map((kick) =>
                                expect.objectContaining({
                                    FROM_USER_ID: kick.FROM_USER_ID,
                                    TO_USER_ID: kick.TO_USER_ID,
                                }),
                            ),
                        ),
                    );
                });
                test("should throw ValidationError when token is invalid", async () => {
                    const res = await request(app).get("/api/kicks/all").set("Cookie", [cookieinvalid]).expect(403);
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                });
                test("should throw UnauthorizedError when missing token", async () => {
                    const res = await request(app).get("/api/kicks/all").expect(401);
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                });
            });

            describe("GET /api/kicks/me", () => {
                test("should return all kicks from db", async () => {
                    const res = await request(app)
                        .get("/api/kicks/me")
                        .set("Cookie", [cookie])
                        .expect(200);

                    expect(res.body).toBeDefined();
                    expect(res.body.length).toBe(2);
                });

                test("should throw error on invalid token", async () => {
                    const res = await request(app)
                        .get("/api/kicks/me")
                        .set("Cookie", [cookieinvalid])
                        .expect(403);
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
                });
                test("should throw UnauthorizedError when missing token", async () => {
                    const res = await request(app)
                        .get("/api/kicks/me")
                        .expect(401);
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó user token");
                });
            });

            describe("GET /api/kicks/all/sent", () => {
                test("should return all sent kicks from loggen user", async () => {
                    const res = await request(app)
                        .get("/api/kicks/all/sent")
                        .set("Cookie", [cookie])
                        .expect(200);

                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                FROM_USER_ID: testUser.ID,
                            }),
                        ]),
                    );
                });

                test("should throw error on invalid token", async () => {
                    const res = await request(app)
                        .get("/api/kicks/all/sent")
                        .set("Cookie", [cookieinvalid])
                        .expect(403);
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
                });
                test("should throw UnauthorizedError when missing token", async () => {
                    const res = await request(app)
                        .get("/api/kicks/all/sent")
                        .expect(401);

                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó user token");
                });
            });

            describe("GET /api/kicks/all/recieved", () => {
                test("should return all recieved kicks for loggen user", async () => {
                    const res = await request(app)
                        .get("/api/kicks/all/recieved")
                        .set("Cookie", [cookie])
                        .expect(200);

                    expect(res.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                TO_USER_ID: testUser.ID,
                            }),
                        ]),
                    );
                });

                test("should throw error on invalid token", async () => {
                    const res = await request(app)
                        .get("/api/kicks/all/recieved")
                        .set("Cookie", [cookieinvalid])
                        .expect(403);

                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
                });
                test("should throw error on invalid token", async () => {
                    const res = await request(app)
                        .get("/api/kicks/all/recieved")
                        .expect(401);

                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó user token");
                });
            });
        });
    });

    describe("POST", () => {
        describe("POST /api/kicks", () => {
            describe("POST /api/kicks/:userId", () => {
                test("should create new kick", async () => {
                    const userId = rawUsers[3].ID;

                    const res = await request(app)
                        .post(`/api/kicks/${userId}`)
                        .set("Cookie", [cookie])
                        .expect(200);

                    expect(res.body).toEqual(
                        expect.objectContaining({
                            FROM_USER_ID: testUser.ID,
                            TO_USER_ID: userId,
                        }),
                    );
                });

                test("should update existing kick and swap id", async () => {
                    const userId = rawUsers[2].ID;

                    const res = await request(app)
                        .post(`/api/kicks/${userId}`)
                        .set("Cookie", [cookie])
                        .expect(200);

                    const foundKick = await db.Kick.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    FROM_USER_ID: testUser.ID,
                                    TO_USER_ID: userId,
                                },
                                {
                                    FROM_USER_ID: userId,
                                    TO_USER_ID: testUser.ID,
                                },
                            ],
                        },
                    });

                    expect(res.body.updated).toBeTruthy();
                    expect(foundKick).toEqual(
                        expect.objectContaining({
                            FROM_USER_ID: testUser.ID,
                            TO_USER_ID: userId,
                        }),
                    );
                });

                test("should throw error on invalid token", async () => {
                    const userId = rawUsers[3].ID;

                    const res = await request(app)
                        .post(`/api/kicks/${userId}`)
                        .set("Cookie", [cookieinvalid])
                        .expect(403);

                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
                });
                test("should throw error on invalid token", async () => {
                    const userId = rawUsers[3].ID;

                    const res = await request(app)
                        .post(`/api/kicks/${userId}`)
                        .expect(401);

                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó user token");
                });

                test("should throw error on invalid id", async () => {
                    const userId = 9999;

                    const res = await request(app)
                        .post(`/api/kicks/${userId}`)
                        .set("Cookie", [cookie])
                        .expect(400);

                    expect(res.body.message).toBe("Nincs ilyen felhasználó");
                });

                test("should throw error on id equal to my id", async () => {
                    const userId = testUser.ID;

                    const res = await request(app)
                        .post(`/api/kicks/${userId}`)
                        .set("Cookie", [cookie])
                        .expect(400);
                        
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBeDefined();
                    expect(res.body.message).toBe("Magadat nem rúghatod meg");
                });
            });
        });
    });
});
