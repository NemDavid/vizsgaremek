const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");
const { Op } = require("sequelize");

describe("/api/connections", () => {
    //-----------------------------------------------------------
    //    CONSTSANSOK
    //-----------------------------------------------------------
    const rawUsers = [
        {
            ID: 1, //fő
            username: "admin",
            email: "admin@example.com",
            password: "Jelszo123#",
            role: "admin",
        },
        {
            ID: 2, // Barátom
            username: "user",
            email: "user@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 3, // felkérvtem
            username: "user(2)",
            email: "user(2)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 4, // felkért engem
            username: "user(3)",
            email: "user(3)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 5, // blockltam
            username: "user(4)",
            email: "user(4)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 6, // blocklt engem
            username: "user(5)",
            email: "user(5)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 7, // ismeretlen
            username: "user(6)",
            email: "user(6)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
        {
            ID: 8, // ismeretlen
            username: "user(7)",
            email: "user(7)@example.com",
            password: "Jelszo123#",
            role: "user",
        },
    ];
    const rawProfiles = [
        {
            USER_ID: 1, //fő
            first_name: "Dávid",
            last_name: "Hartwig-Matos",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 2, // Barátom
            first_name: "Bálint",
            last_name: "Murár",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 3, // felkérve
            first_name: "Ádam",
            last_name: "Pedro",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 4, // felkért engem
            first_name: "Gergő",
            last_name: "Kássa",
            avatar_url: "/admin.png",
        },
        {
            USER_ID: 5, // blockltam
            first_name: "Dániel",
            last_name: "Szabó",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 6, // blocklt engem
            first_name: "Ádám",
            last_name: "Nagy",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 7, // ismeretlen
            first_name: "Ferenc",
            last_name: "Puskás",
            avatar_url: "/user.png",
        },
        {
            USER_ID: 8, // ismeretlen
            first_name: "test(8)",
            last_name: "test(8)",
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
        {
            ID: 5,
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
            ID: 6,
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
            ID: 7,
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
            ID: 8,
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
    const rawConnections = [
        { ID: 1, Status: "accepted", User_Requested_ID: 1, To_User_ID: 2 },
        { ID: 2, Status: "pending", User_Requested_ID: 1, To_User_ID: 3 },
        { ID: 3, Status: "pending", User_Requested_ID: 4, To_User_ID: 1 },
        { ID: 4, Status: "blocked", User_Requested_ID: 1, To_User_ID: 5 },
        { ID: 5, Status: "blocked", User_Requested_ID: 6, To_User_ID: 1 },
        { ID: 6, Status: "blocked", User_Requested_ID: 8, To_User_ID: 1 },
    ];
    const testUser = {
        ID: rawUsers[0].ID,
        username: rawUsers[0].username,
        email: rawUsers[0].email,
        role: rawUsers[0].role,
    };
    let token = undefined;
    let cookie = undefined;
    let cookieinvalid = undefined
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
        await db.Connections.bulkCreate(rawConnections);
        token = authUtils.generateUserToken(testUser);
        cookie = `user_token=${token}`;
        cookieinvalid = `user_token=${token}_invalid`;

    }, 60 * 1000);

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
        await db.Settings.destroy({ where: {} });
        await db.Connections.destroy({ where: {} });
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
    describe("GET", () => {
        describe("/", () => {
            test("should returt all connection from db", async () => {
                const res = await request(app).get("/api/connections").set("Cookie", [cookie]).expect(200);

                expect(res.body).toBeDefined();
                expect(res.body.length).toBe(rawConnections.length);
            });
            test("should throw ValidationError when token is invalid", async () => {
                const res = await request(app).get("/api/connections").set("Cookie", [cookieinvalid]).expect(403);

                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
            });
            test("should throw UnauthorizedError when missing token", async () => {
                const res = await request(app).get("/api/connections").expect(401);

                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            });
        });
        describe("/me", () => {
            test("should return logged user's connections", async () => {
                const res = await request(app)
                    .get("/api/connections/me")
                    .set("Cookie", [cookie])
                    .expect(200);

                const foundConnections = await db.Connections.findAll({
                    where: {
                        [Op.or]: [
                            {
                                To_User_ID: testUser.ID,
                            },
                            {
                                User_Requested_ID: testUser.ID,
                            },
                        ],
                    },
                });

                expect(res.body).toBeDefined();
                expect(res.body.length).toBe(foundConnections.length);
            });
            test("should throw error on invalid token", async () => {
                const res = await request(app)
                    .get("/api/connections/me")
                    .set("Cookie", [cookieinvalid])
                    .expect(403);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            });
            test("should throw UnauthorizedError when missing token", async () => {
                const res = await request(app)
                    .get("/api/connections/me")
                    .expect(401);

                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            });
        });
        describe("/filtered", () => {
            test.each([
                ["accepted"],
                ["pending"],
                ["blocked"]
            ])(
                "should return logged user's connections with given status", async (status) => {
                    const res = await request(app)
                        .get(`/api/connections/filtered?status=${status}`)
                        .set("Cookie", [cookie])
                        .expect(200);

                    const foundConnections = await db.Connections.findAll({
                        where: {
                            Status: status
                        }

                    })

                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            foundConnections.map((connection) =>
                                expect.objectContaining({
                                    Status: connection.Status,
                                }),
                            ),
                        ),
                    );
                },
            );
            test("should throw error on user role token", async () => {
                const user = {
                    ID: rawUsers[1].ID,
                    username: rawUsers[1].username,
                    email: rawUsers[1].email,
                    role: rawUsers[1].role,
                }

                const token = authUtils.generateUserToken(user);
                const cookie = `user_token=${token}`;

                const res = await request(app).get("/api/connections/filtered/?status=accepted").set("Cookie", [cookie]).expect(401);

                expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
            });
            test("should throw error on unlogged try", async () => {
                const res = await request(app).get("/api/connections/filtered/?status=accepted").expect(401);

                expect(res.body.message).toBe("Hiányzó user token");
            });
            test("should throw error on invalid status param", async () => {
                const res = await request(app).get("/api/connections/filtered/?status=_invalid").set("Cookie", [cookie]).expect(400);

                expect(res.body.message).toBe("Érvénytelen status");
            });
        });
        describe("/me/action", () => {
            test("should return logged user's friends", async () => {
                const correct = [
                    {
                        ID: 2,
                        email: 'user@example.com',
                        profile: {}
                    }
                ]
                const res = await request(app)
                    .get(`/api/connections/me/accepted`)
                    .set("Cookie", [cookie])
                    .expect(200);


                expect(res.body).toBeDefined();
                expect(res.body).toEqual(
                    expect.arrayContaining(
                        correct.map((user) =>
                            expect.objectContaining({
                                ID: user.ID,
                            }),
                        ),
                    ),
                );
            },
            );
            test("should throw error on invalid token", async () => {
                const res = await request(app)
                    .get(`/api/connections/me/friends`)
                    .set("Cookie", [cookieinvalid])
                    .expect(403);

                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            },
            );
            test("should throw error on invalid token", async () => {
                const res = await request(app)
                    .get(`/api/connections/me/friends`)
                    .expect(401);

                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
            },
            );
        });
    });
    describe("POST", () => {
        describe("/:userId/:action", () => {
            test.each([
                ["pending"],
                ["blocked"]
            ])("should do the action from the user", async (action) => {
                const res = await request(app)
                    .post(`/api/connections/7/${action}`)
                    .set("Cookie", [cookie])
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                const fc = await db.Connections.findOne({
                    where: {
                        To_User_ID: 7,
                        User_Requested_ID: 1
                    },
                });
                expect(fc.dataValues).toBeDefined()
                expect(fc.dataValues.Status).toBe(action)
            })
            test("should throw error on invalid action", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const userId = 7;
                const action = "_invalid";

                const res = await request(app)
                    .post(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Rossz paramáter action érték");
            })
            test("should throw error on invalid token", async () => {
                const userId = 7;
                const action = "blocked";

                const res = await request(app)
                    .post(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookieinvalid])
                    .expect(403);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            })
            test.each([
                [9999, "Nincs ilyen felhasználó"],
                [testUser.ID, "Magadat nem tudod kezelni"]
            ])("should throw error on invalid user id", async (userId, expectedMessage) => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const action = "blocked";

                const res = await request(app)
                    .post(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe(expectedMessage);
            })
        });
        describe("/:userId", () => {
            test("should do the action from the user without action", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const res = await request(app)
                    .post(`/api/connections/7`)
                    .set("Cookie", [cookie])
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();

                const fc = await db.Connections.findOne({
                    where: { To_User_ID: 7, User_Requested_ID: 1 },
                });

                expect(fc.dataValues).toBeDefined()
                expect(fc.dataValues.Status).toBe("pending")
            })
            test("should throw error if i blocked a user and i send frind request", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const userId = 5;


                const res = await request(app)
                    .post(`/api/connections/${userId}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Ezt a felhasználót letiltottad, előbb oldd fel, mielőtt barátnak kéred!");
            })
            test("should throw error if user blocked me and i send frind request", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const userId = 8;


                const res = await request(app)
                    .post(`/api/connections/${userId}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Ez a felhasználó letiltott téged, ezért nem tudod barátnak kérni!");
            })
            test("should throw error on two accept", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const userId = 2;

                const res = await request(app)
                    .post(`/api/connections/${userId}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Csak egyszer küldhetsz barátkérést egy felhasználónak!");
            })
        });
    });
    describe("PATCH", () => {
        describe("/:userId/:action", () => {
            test.each([
                [2, "blocked"],
                [4, "accepted"],
            ])("should update status between users", async (userId, action) => {
                const res = await request(app)
                    .patch(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookie])
                    .expect(200);

                expect(res.body).toBeDefined();
                expect(res.body).toEqual(
                    expect.objectContaining({
                        Status: action,
                    })
                );
            })

            test("should throw error on invalid action", async () => {
                const userId = 2;
                const action = "blocked";

                const res = await request(app)
                    .patch(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookieinvalid])
                    .expect(403);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            })
            test("should throw UnauthorizedError when missing token", async () => {
                const userId = 2;
                const action = "blocked";

                const res = await request(app)
                    .patch(`/api/connections/${userId}/${action}`)
                    .expect(401);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            })

            test("should throw error on invalid action", async () => {
                const userId = 2;
                const action = "blocked_invalid";

                const res = await request(app)
                    .patch(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Rossz action érték");
            })

            test.each([
                [9999, "Nincs ilyen felhasználó"],
                [testUser.ID, "Magadat nem tudod kezelni"],
            ])("should throw error on invalid user id", async (userId, expectedMessage) => {
                const action = "blocked";

                const res = await request(app)
                    .patch(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe(expectedMessage);
            })

            test("should throw error on if no connection with user", async () => {
                const userId = 7;
                const action = "blocked";

                const res = await request(app)
                    .patch(`/api/connections/${userId}/${action}`)
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Nincs ilyen kapcsolat");
            })
        });
    });
    describe("DELETE", () => {
        describe("/:userId", () => {
            test("should delete the connection between the users", async () => {
                const userId = 2;


                await request(app)
                    .delete(`/api/connections/${userId}`)
                    .set("Cookie", [cookie])
                    .expect(200);

                const foundConnection = await db.Connections.findOne({
                    where: {
                        [Op.or]: [
                            {
                                To_User_ID: testUser.ID,
                                User_Requested_ID: userId
                            },
                            {
                                To_User_ID: userId,
                                User_Requested_ID: testUser.ID
                            }
                        ]
                    }
                })


                expect(foundConnection).toBeNull();
            });

            test("should throw error on invalid token", async () => {
                const userId = 2;

                const res = await request(app)
                    .delete(`/api/connections/${userId}`)
                    .set("Cookie", [cookieinvalid])
                    .expect(403);


                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            });
            test("should throw UnauthorizedError when missing token", async () => {
                const userId = 2;

                const res = await request(app)
                    .delete(`/api/connections/${userId}`)
                    .expect(401);
                expect(res.body).toBeDefined();
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe("Hiányzó user token");
            });

            test("should throw error on invalid user id", async () => {
                const userId = 9999;

                const res = await request(app)
                    .delete(`/api/connections/${userId}`)
                    .set("Cookie", [cookie])
                    .expect(400);


                expect(res.body.message).toBe("Nincs ilyen felhasználó");
            });
        });
    });


});
