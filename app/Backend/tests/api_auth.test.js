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
                    token = token + "_invalid"

                    const res = await request(app).get(`/api/auth/token/${token}`).expect(401);

                    expect(res.body.message).toEqual("Érvénytelen vagy lejárt token.");
                });
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

            describe("POST /api/auth/register", () => {
                test("should return succesfull registration", async () => {
                    const user = {
                        email: "example@example.com",
                        username: "example_user",
                        password: "Jelszo123#",
                        confirm_password: "Jelszo123#",
                    }

                    const res = await request(app).post("/api/auth/register").send(user).expect(201);

                    expect(res.body.message).toEqual("Regisztráció sikeres, ellenőrizd az email fiókodat az aktiváláshoz.");
                });

                test.each([
                    [{ email: undefined, username: "example_user", password: "Jelszo123#", confirm_password: "Jelszo123#" }, "Hiányzó email"],
                    [{ email: "example@example.com", username: undefined, password: "Jelszo123#", confirm_password: "Jelszo123#" }, "Hiányzó username"],
                    [{ email: "example@example.com", username: "example_user", password: undefined, confirm_password: "Jelszo123#" }, "Hiányzó password"],
                    [{ email: "example@example.com", username: "example_user", password: "Jelszo123#", confirm_password: undefined }, "Hiányzó confirm_password"],
                ])("should throw error on missing attributes", async (payload, expectedMessage) => {
                    const res = await request(app).post("/api/auth/register").send(payload).expect(400);

                    expect(res.body.message).toEqual(expectedMessage);
                });

                test.each([
                    [{ email: "bad_email@email@com", username: "example_user", password: "Jelszo123#", confirm_password: "Jelszo123#" }, "Érvényytelen email"],
                    [{ email: "example@example.com", username: "asd15@", password: "Jelszo123#", confirm_password: "Jelszo123#" }, "Érvénytelen username"],
                    [{ email: "example@example.com", username: "example_user", password: "jelszo123", confirm_password: "jelszo123#" }, "A jelszó nem felel meg a követelményeknek"],
                    [{ email: "example@example.com", username: "example_user", password: "Jelszo123#", confirm_password: "jelszo123" }, "A jelszó nem felel meg a követelményeknek"],
                ])("should throw error on invalid attributes", async (payload, expectedMessage) => {
                    const res = await request(app).post("/api/auth/register").send(payload).expect(403);

                    expect(res.body.message).toEqual(expectedMessage);
                });

                test("should throw error on existing username", async () => {
                    const user = {
                        email: "example@example.com",
                        username: "admin",
                        password: "Jelszo123#",
                        confirm_password: "Jelszo123#",
                    }

                    const res = await request(app).post("/api/auth/register").send(user).expect(400);

                    expect(res.body.message).toEqual("Ez a felhasználó név már létezik");
                });

                test("should throw error when passwords do not match", async () => {
                    const user = {
                        email: "example@example.com",
                        username: "admin",
                        password: "Jelszo123#_1",
                        confirm_password: "Jelszo123#_2",
                    }

                    const res = await request(app).post("/api/auth/register").send(user).expect(400);

                    expect(res.body.message).toEqual("Ez a felhasználó név már létezik");
                });
            });

            describe("POST /api/register/confirm/:token", () => {
                test("should comfirm registration", async () => {
                    const user = {
                        email: "example@example.com",
                        username: "example_user",
                        password: "Jelszo123#",
                    }

                    const profile = {
                        first_name: "example_first_name",
                        last_name: "example_last_name",
                    }


                    const token = authUtils.generateRegistrationToken(user);

                    const res = await request(app).post(`/api/auth/register/confirm/${token}`).send(profile).expect(201);



                    expect(res.body.message).toEqual("A fiókod és a profilod sikeresen létrehozva!");
                    expect(res.body.user).toEqual(expect.objectContaining(
                        {
                            username: user.username,
                            email: user.email,
                        }
                    ));
                    expect(res.body.profile).toEqual(expect.objectContaining(
                        {
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                        }
                    ));
                })

                test("should throw error on invalid token", async () => {
                    const user = {
                        email: "example@example.com",
                        username: "example_user",
                        password: "Jelszo123#",
                    }

                    const profile = {
                        first_name: "example_first_name",
                        last_name: "example_last_name",
                    }

                    let token = authUtils.generateRegistrationToken(user);
                    token = token + "_invalid";

                    const res = await request(app).post(`/api/auth/register/confirm/${token}`).send(profile).expect(400);


                    expect(res.body.message).toEqual("Érvénytelen vagy lejárt token.");
                })
            });
            describe("POST /api/reset/send-code", () => {
                test("should generate a verify code", async () => {
                    const data = {
                        email: "admin@example.com"
                    }

                    await request(app).post("/api/auth/reset/send-code").send(data).expect(201);
                })
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