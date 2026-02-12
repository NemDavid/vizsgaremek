const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const { userService, user_profileService, notificationService, user_SettingsService } = require("../api/services")(db);
const authUtils = require("../api/utilities/authUtils");
const { BadRequestError, ValidationError } = require("../api/errors");



describe("authController", () => {
    const rawUsers = [
        { ID: 1, username: "admin", email: "admin@example.com", password: "Jelszo123#", role: "admin" }
    ];

    const rawProfiles = [
        { USER_ID: 1, first_name: "Gergő", last_name: "Kovács", birth_date: "1990-05-10", bio: "Admin profil", avatar_url: "/admin.png" }
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

    const testUser = { ID: 1, username: "admin", email: "admin@example.com", role: "admin", }


    let users = undefined;

    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {

        users = rawUsers.map(user => ({
            ...user,
            password_hash: authUtils.hashPassword(user.password)
        }));


        await db.User.bulkCreate(users);
        await db.User_Profile.bulkCreate(rawProfiles);
        await db.Settings.bulkCreate(settings);
    });

    afterEach(async () => {

        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
    });

    describe("/api/auth", () => {
        describe("GET", () => {
            describe("GET /api/auth/status", () => {
                test("shoult return 200 and user data if user is logged in", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const res = await request(app).get("/api/auth/status").set("Cookie", [cookie]).expect(200);


                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(expect.objectContaining(
                        {
                            userID: testUser.ID,
                            username: testUser.username,
                            email: testUser.email,
                            role: testUser.role,
                        }
                    ));
                });

                test("shoult trhow error on missing cookie", async () => {
                    cookie = undefined;

                    const res = await request(app).get("/api/auth/status").set("Cookie", [cookie]).expect(401);

                    expect(res.body.message).toEqual("Usrer token is missing");
                });
            });


            describe("GET /api/auth/token/:token", () => {
                test("shoult return 200 and user data", async () => {
                    const token = authUtils.generateUserToken(testUser);

                    const res = await request(app).get(`/api/auth/token/${token}`).expect(200);


                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(expect.objectContaining(
                        {
                            userID: testUser.ID,
                            username: testUser.username,
                            email: testUser.email,
                            role: testUser.role,
                        }
                    ));
                });

                test("shoult trhow error on missing token", async () => {
                    let token = authUtils.generateUserToken(testUser);
                    token = token + "fail"

                    const res = await request(app).get(`/api/auth/token/${token}`).expect(401);

                    expect(res.body.message).toEqual("Érvénytelen vagy lejárt token.");
                });
            });

            describe("POST", () => {
                describe("POST /api/auth/login", () => {
                    test("should set user_token on login", async () => {
                        const user = { ...testUser, password: "Jelszo123#" };
                        const res = await request(app).post("/api/auth/login").send(user).expect(200);

                        const cookies = res.headers["set-cookie"];
                        const tokenCookie = cookies.find(c => c.startsWith("user_token="));
                        const tokenValue = tokenCookie.split(";")[0].split("=")[1];

                        expect(res.body.token).toBeDefined();
                        expect(tokenValue).toBeDefined();  // a cookie token is létezik

                    });


                    test.each([
                        [{ username: "admin", password: undefined }, "Hiányzó password"],
                        [{ username: undefined, password: "Jelszo123#" }, "Hiányzó username"],
                    ])("should throw error on missing attributes", async (payload, expectedMessage) => {
                        try {
                            await request(app).post("/api/auth/login").send(payload).expect(400);
                        }
                        catch (error) {
                            expect(error.message).toEqual(expectedMessage);
                            expect(error).toBeInstanceOf(BadRequestError);
                        }
                    });

                    test("shouldn't login twice", async () => {
                        const token = authUtils.generateUserToken(testUser);
                        const cookie = `user_token=${token}`;

                        const user = { ...testUser, password: "Jelszo123#" };

                        const res = await request(app).post("/api/auth/login").set("Cookie", cookie).send(user).expect(403);

                        expect(res.body.message).toEqual("Már van bejelentkezett felhasználó ezen a gépen.");
                    });

                    test("should throw error on invalid username", async () => {
                        let user = { ...testUser, password: "Jelszo123#" };

                        user.username = "invalid_username";

                        const res = await request(app).post("/api/auth/login").send(user).expect(404);

                        expect(res.body.message).toEqual("Nincs ilyen felhasználó");
                    });

                    test("should throw error on bad password", async () => {
                        let user = { ...testUser, password: "Jelszo123#_invalid" };

                        const res = await request(app).post("/api/auth/login").send(user).expect(401);

                        expect(res.body.message).toEqual("Hibás jelszó");
                    });
                });
            });

            describe("DELETE", () => {
                describe("DELETE /api/auth/logout", () => {
                    test("shoult clear cookie and return 200", async () => {
                        const token = authUtils.generateUserToken(testUser);
                        const cookie = `user_token=${token}`;

                        const res = await request(app).delete("/api/auth/logout").set("Cookie", [cookie]).expect(200);


                        expect(res.body.message).toBe("OK");
                        expect(res.headers['set-cookie']).toEqual(
                            expect.arrayContaining([
                                expect.stringContaining('user_token=;')  // a clearCookie által üresre állított cookie
                            ])
                        );
                    });
                });
            });
        });
    });
});