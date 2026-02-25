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
    ];
    const rawConnections = [
        { ID: 1, Status: "accepted", User_Requested_ID: 1, To_User_ID: 2 },
        { ID: 2, Status: "pending", User_Requested_ID: 1, To_User_ID: 3 },
        { ID: 3, Status: "pending", User_Requested_ID: 4, To_User_ID: 1 },
        { ID: 4, Status: "blocked", User_Requested_ID: 1, To_User_ID: 5 },
        { ID: 5, Status: "blocked", User_Requested_ID: 6, To_User_ID: 1 },
    ];
    const testUser = {
        ID: rawUsers[0].ID,
        username: rawUsers[0].username,
        email: rawUsers[0].email,
        role: rawUsers[0].role,
    };
    //-----------------------------------------------------------
    //    BEFOROK/AFTEREK
    //-----------------------------------------------------------
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
    //-----------------------------------------------------------
    //    GET
    //-----------------------------------------------------------
    describe("GET", () => {
        //-----------------------------------------------------------
        //    /
        //-----------------------------------------------------------
        describe("/", () => {
            test("should returt all connection from db", async () => {
                const res = await request(app).get("/api/connections").expect(200);

                expect(res.body).toBeDefined();
                expect(res.body.length).toBe(rawConnections.length);
            });
        });
        //-----------------------------------------------------------
        //    /ME
        //-----------------------------------------------------------
        describe("/me", () => {
            test("should return logged user's connections", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;

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
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}_invalid`;

                const res = await request(app)
                    .get("/api/connections/me")
                    .set("Cookie", [cookie])
                    .expect(400);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            });
        });
        //-----------------------------------------------------------
        //    /me/received-request
        //-----------------------------------------------------------
        describe("/me/received-request", () => {
            test("should return logged user's received-requests", async () => {
                const correct = [
                    { ID: 3, User_Requested_ID: 4, To_User_ID: 1, Status: 'pending' },
                    { ID: 5, User_Requested_ID: 6, To_User_ID: 1, Status: 'blocked' }
                ]

                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const res = await request(app)
                    .get(`/api/connections/me/received-request`)
                    .set("Cookie", [cookie])
                    .expect(200);

                expect(res.body).toBeDefined();
                expect(res.body).toEqual(
                    expect.arrayContaining(
                        correct.map((profil) =>
                            expect.objectContaining({
                                User_Requested_ID: profil.User_Requested_ID,
                                To_User_ID: profil.To_User_ID
                            }),
                        ),
                    ),
                );
            },
            );
        });
        //-----------------------------------------------------------
        //    /me/friends
        //-----------------------------------------------------------
        describe("/me/friends", () => {
            test(
                "should return logged user's friends",
                async () => {
                    const correct = [
                        {
                            ID: 2,
                            email: 'user@example.com',
                            profile: {}
                        }
                    ]

                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;
                    const res = await request(app)
                        .get(`/api/connections/me/friends`)
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
        });
        //-----------------------------------------------------------
        //    /filtered
        //-----------------------------------------------------------
        describe("/filtered", () => {
            test.each([["accepted"], ["pending"], ["blocked"]])(
                "should return logged user's connections with given status", async (status) => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const res = await request(app)
                        .get(`/api/connections/filtered?status=${status}`)
                        .set("Cookie", [cookie])
                        .expect(200);

                    const foundConnections = await db.Connections.findAll({
                        Status: status
                    })

                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            foundConnections.map((connection) =>
                                expect.objectContaining({
                                    Status: connection.status,
                                }),
                            ),
                        ),
                    );
                },
            );

            test("should throw error on invalid status", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}_invalid`;

                const res = await request(app).get("/api/connections/filtered/?status=accepted").set("Cookie", [cookie]).expect(400);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            });

            test("should throw error on user token", async () => {
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

            test("should throw error on invalid status param", async () => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;

                const res = await request(app).get("/api/connections/filtered/?status=accepted").set("Cookie", [cookie]).expect(400);

                expect(res.body.message).toBe("Érvénytelen status");
            });
        });
    });
    //-----------------------------------------------------------
    //    POST
    //-----------------------------------------------------------
    describe("POST", () => {
        describe("/:userId/:action", () => {
            test.each([
                ["pending"]
                ["blocked"]
            ])("should do the action from the user", async (action) => {
                const token = authUtils.generateUserToken(testUser);
                const cookie = `user_token=${token}`;
                const res = await request(app)
                    .post(`/api/connections/7/pending`)
                    .set("Cookie", [cookie])
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();

                const fc = await db.Connections.findOne({
                    where: { To_User_ID: 7, User_Requested_ID: 1 },
                });

                expect(fc.dataValues).toBeDefined()
                expect(fc.dataValues.status).toBe(action)
            })
        });
        describe("/:userId/:action", () => {
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

            }, 60 * 1000)
        });
    });
    //-----------------------------------------------------------
    //    PATCH
    //-----------------------------------------------------------
    describe("PATCH", () => {
        describe("/:userId/:action", () => { });
    });
    //-----------------------------------------------------------
    //    DELETE
    //-----------------------------------------------------------
    describe("DELETE", () => {
        describe("/:userId", () => { });
    });


});
