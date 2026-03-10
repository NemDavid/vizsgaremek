const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const { user_profileService } = require("../api/services")(db);
const authUtils = require("../api/utilities/authUtils");
const { BadRequestError, ValidationError } = require("../api/errors");

describe("/api/admins", () => {
    const rawUsers = [
        {
            ID: 1,
            username: "owner",
            email: "owner@example.com",
            password: "Jelszo123#",
            role: "owner",
        },
        {
            ID: 2,
            username: "admin(1)",
            email: "admin(1)@example.com",
            password: "Jelszo456#",
            role: "admin",
        },
        {
            ID: 3,
            username: "admin(2)",
            email: "admin(2)@example.com",
            password: "Jelszo456#",
            role: "admin",
        },
        {
            ID: 4,
            username: "user",
            email: "user@example.com",
            password: "Jelszo456#",
            role: "user",
        },
    ];

    const rawProfiles = [
        {
            USER_ID: 1,
            first_name: "Gergő",
            last_name: "Kovács",
            birth_date: "1990-05-10",
            bio: "Owner profil",
            avatar_url: "/owner.png",
        },
        {
            USER_ID: 2,
            first_name: "Lakatos",
            last_name: "Zsigmond",
            birth_date: "1995-08-20",
            bio: "Admin profil",
            avatar_url: "/admin.png",
        },
        {
            USER_ID: 3,
            first_name: "Rubik",
            last_name: "Ernő",
            birth_date: "1995-08-20",
            bio: "Admin profil",
            avatar_url: "/admin.png",
        },
        {
            USER_ID: 4,
            first_name: "Dóra",
            last_name: "Nagy",
            birth_date: "1995-08-20",
            bio: "User profil",
            avatar_url: "/user.png",
        },
    ];

    let users = undefined;
    let token = undefined;
    let cookie_owner = undefined;
    let cookie_admin = undefined;
    let cookie_user = undefined;
    let cookieinvalid = undefined;
    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {
        users = rawUsers.map((user) => ({
            ...user,
            password_hash: authUtils.hashPassword(user.password),
        }));

        await db.User.bulkCreate(users);
        await db.User_Profile.bulkCreate(rawProfiles);

        token = authUtils.generateUserToken(rawUsers[0]);
        cookie_owner = `user_token=${token}`;
        cookieinvalid = `user_token=${token}_invalid`;
        token = authUtils.generateUserToken(rawUsers[1]);
        cookie_admin = `user_token=${token}`;
        token = authUtils.generateUserToken(rawUsers[3]);
        cookie_user = `user_token=${token}`;
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
    });

    describe("GET", () => {
        describe("GET /api/admins/all", () => {
            test("should return admins with owner cookie", async () => {
                const res = await request(app)
                    .get("/api/admins/all")
                    .set("Cookie", [cookie_owner])
                    .expect(200);

                const admins = rawUsers.filter(i => i.role != "user");

                expect(res.body).toEqual(
                    expect.arrayContaining(
                        admins.map((admin) =>
                            expect.objectContaining({
                                ID: admin.ID,
                                username: admin.username,
                                email: admin.email,
                                role: admin.role,
                            }),
                        ),
                    ),
                );
            });

            test("should return admins with admin cookie", async () => {
                const res = await request(app)
                    .get("/api/admins/all")
                    .set("Cookie", [cookie_admin])
                    .expect(200);

                const admins = rawUsers.filter(i => i.role != "user");

                expect(res.body).toEqual(
                    expect.arrayContaining(
                        admins.map((admin) =>
                            expect.objectContaining({
                                ID: admin.ID,
                                username: admin.username,
                                email: admin.email,
                                role: admin.role,
                            }),
                        ),
                    ),
                );
            });

            test("should throw error on user cookie", async () => {
                const res = await request(app)
                    .get("/api/admins/all")
                    .set("Cookie", [cookie_user])
                    .expect(401);

                expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
            });

            test("should throw error on invalid token", async () => {
                const res = await request(app)
                    .get("/api/admins/all")
                    .set("Cookie", [cookieinvalid])
                    .expect(403);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            });

            test("should throw error on missing token", async () => {
                const res = await request(app)
                    .get("/api/admins/all")
                    .expect(401);

                expect(res.body.message).toBe("Hiányzó user token");
            });
        });

        describe("GET /api/admins/info", () => {
            test("should return informations with owner cookie", async () => {
                const res = await request(app)
                    .get("/api/admins/info")
                    .set("Cookie", [cookie_owner])
                    .expect(200);

                expect(res.body.users).toBe(4);
                expect(res.body.posts).toBe(0);
                expect(res.body.ads).toBe(0);
            });

            test("should return informations with admin cookie", async () => {
                const res = await request(app)
                    .get("/api/admins/info")
                    .set("Cookie", [cookie_admin])
                    .expect(200);

                expect(res.body.users).toBe(4);
                expect(res.body.posts).toBe(0);
                expect(res.body.ads).toBe(0);
            });

            test("should throw error on user cookie", async () => {
                const res = await request(app)
                    .get("/api/admins/info")
                    .set("Cookie", [cookie_user])
                    .expect(401);

                expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
            });

            test("should throw error on invalid token", async () => {
                const res = await request(app)
                    .get("/api/admins/info")
                    .set("Cookie", [cookieinvalid])
                    .expect(403);

                expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
            });

            test("should throw error on missing token", async () => {
                const res = await request(app)
                    .get("/api/admins/info")
                    .expect(401);

                expect(res.body.message).toBe("Hiányzó user token");
            });
        });
    });

    describe("DELETE", () => {
        test("should delete admin from db", async () => {
            const inputID = 2;

            await request(app).delete(`/api/admins/${inputID}`).set("Cookie", [cookie_owner]).expect(200);

            const foundAdmin = await db.User.findOne({
                where: {
                    ID: inputID,
                    role: "admin",
                },
            });

            expect(foundAdmin).toBeNull();
        });

        test("should throw error on invalid user id", async () => {
            const inputID = 9999;

            const res = await request(app).delete(`/api/admins/${inputID}`).set("Cookie", [cookie_owner]).expect(404);

            expect(res.body.message).toBe("Nincs ilyen admin");
        });

        test("should throw error when you want delete yourself", async () => {
            const inputID = 1;

            const res = await request(app).delete(`/api/admins/${inputID}`).set("Cookie", [cookie_owner]).expect(400);

            expect(res.body.message).toBe("Magadat nem tudod kezelni");
        });

        test("should throw error on admin token", async () => {
            const inputID = 3;

            const res = await request(app).delete(`/api/admins/${inputID}`).set("Cookie", [cookie_admin]).expect(401);

            expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
        });

        test("should throw error on user cookie", async () => {
            const inputID = 2;

            const res = await request(app).delete(`/api/admins/${inputID}`).set("Cookie", [cookie_user]).expect(401);

            expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
        });

        test("should throw error on invalid token", async () => {
            const inputID = 2;

            const res = await request(app).delete(`/api/admins/${inputID}`).set("Cookie", [cookieinvalid]).expect(403);

            expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
        });

        test("should throw error on missing token", async () => {
            const inputID = 2;

            const res = await request(app).delete(`/api/admins/${inputID}`).expect(401);

            expect(res.body.message).toBe("Hiányzó user token");
        });
    });

    describe("UPDATE", () => {
        test("should update user role by id", async () => {
            const inputID = 2;
            const role = "owner";

            await request(app)
                .patch(`/api/admins/${inputID}`)
                .send({ role })
                .set("Cookie", [cookie_owner])
                .expect(200);

            const foundUser = await db.User.findOne({
                where: {
                    ID: inputID,
                },
            });

            expect(foundUser).toBeDefined();
            expect(foundUser.role).toBe(role);
        });

        test.each([
            [undefined, "Hiányzó role"],
            ["invalid", "Érvénytelen role típus"]
        ])("should throw error on missing role attribute", async (role, expectedMessage) => {
            const inputID = 2;

            const res = await request(app)
                .patch(`/api/admins/${inputID}`)
                .send({ role })
                .set("Cookie", [cookie_owner])
                .expect(400);

            expect(res.body.message).toBe(expectedMessage);
        });

        test("should throw error on invalid user id", async () => {
            const inputID = 9999;
            const role = "owner";

            const res = await request(app)
                .patch(`/api/admins/${inputID}`)
                .send({ role })
                .set("Cookie", [cookie_owner])
                .expect(404);

            expect(res.body.message).toBe("Nincs ilyen felhasználó");
        });

        test("should throw error if you want update yourself", async () => {
            const inputID = 1;
            const role = "owner";

            const res = await request(app)
                .patch(`/api/admins/${inputID}`)
                .send({ role })
                .set("Cookie", [cookie_owner])
                .expect(400);

            expect(res.body.message).toBe("Magadat nem tudod kezelni");
        });

        test("should throw error on admin token", async () => {
            const inputID = 3;

            const res = await request(app).patch(`/api/admins/${inputID}`).set("Cookie", [cookie_admin]).expect(401);

            expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
        });

        test("should throw error on user cookie", async () => {
            const inputID = 2;

            const res = await request(app).patch(`/api/admins/${inputID}`).set("Cookie", [cookie_user]).expect(401);

            expect(res.body.message).toBe("Nincs jogod ehez a művelethez.");
        });

        test("should throw error on invalid token", async () => {
            const inputID = 2;

            const res = await request(app).patch(`/api/admins/${inputID}`).set("Cookie", [cookieinvalid]).expect(403);

            expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
        });

        test("should throw error on missing token", async () => {
            const inputID = 2;

            const res = await request(app).patch(`/api/admins/${inputID}`).expect(401);

            expect(res.body.message).toBe("Hiányzó user token");
        });
    });
});