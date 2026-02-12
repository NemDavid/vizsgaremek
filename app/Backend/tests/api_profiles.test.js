const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const { user_profileService } = require("../api/services")(db);
const authUtils = require("../api/utilities/authUtils");
const { BadRequestError, ValidationError } = require("../api/errors");



describe("user_profile_Controller", () => {
    const rawUsers = [
        { ID: 1, username: "admin", email: "admin@example.com", password: "Jelszo123#", role: "admin" },
        { ID: 2, username: "user", email: "user@example.com", password: "Jelszo456#", role: "user" }
    ];

    const rawSingleUsers = {
        ID: 3,
        username: "admin2",
        email: "admin2@example.com",
        password: "Jelszo123#",
        role: "admin"
    };

    const rawProfiles = [
        { USER_ID: 1, first_name: "Gergő", last_name: "Kovács", birth_date: "1990-05-10", bio: "Admin profil", avatar_url: "/admin.png" },
        { USER_ID: 2, first_name: "Dóra", last_name: "Nagy", birth_date: "1995-08-20", bio: "User profil", avatar_url: "/user.png" }
    ];

    let transaction = undefined;

    let users = undefined;
    let singleUser = undefined;

    beforeAll(async () => {
        await db.sequelize.sync();
    });

    beforeEach(async () => {

        users = rawUsers.map(user => ({
            ...user,
            password_hash: authUtils.hashPassword(user.password)
        }));

        singleUser = {
            ...rawSingleUsers,
            password_hash: authUtils.hashPassword(rawSingleUsers.password)
        }

        transaction = await db.sequelize.transaction();

        await db.User.bulkCreate([...users, singleUser]);
        await db.User_Profile.bulkCreate(rawProfiles);
    });

    afterEach(async () => {

        await transaction.rollback();

        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
    });

    describe("/api/profiles", () => {
        describe("GET", () => {
            describe("GET /api/profiles/all", () => {
                test("should return the test dataset", async () => {
                    const res = await request(app).get("/api/profiles/all").set("Accept", "application/json");

                    expect(res.status).toBe(200);

                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            rawProfiles.map(profile => expect.objectContaining({
                                USER_ID: profile.USER_ID,
                                first_name: profile.first_name,
                                last_name: profile.last_name,
                                birth_date: profile.birth_date,
                                bio: profile.bio,
                                avatar_url: profile.avatar_url
                            })))
                    );
                });
            });

            describe("GET /api/profiles/:userId", () => {
                test("should return the correct profile", async () => {
                    const inputID = 1;

                    const res = await request(app).get(`/api/profiles/${inputID}`).set("Accept", "application/json");



                    expect(res.status).toBe(200);
                    expect(res).toBeDefined();
                    expect(res.body).toEqual(expect.objectContaining(
                        {
                            USER_ID: rawProfiles[0].USER_ID,
                            first_name: rawProfiles[0].first_name,
                            last_name: rawProfiles[0].last_name,
                            birth_date: rawProfiles[0].birth_date,
                            bio: rawProfiles[0].bio,
                            avatar_url: rawProfiles[0].avatar_url
                        }
                    ));
                });
            });

            describe("GET /api/profiles/pages/:paramPage", () => {
                test("should return the correct profiles", async () => {
                    const paramPage = 1;

                    const res = await request(app).get(`/api/profiles/pages/${paramPage}`).set("Accept", "application/json");

                    expect(res.status).toBe(200);
                    expect(res).toBeDefined();
                    expect(res.body.length).toBeLessThanOrEqual(25);
                });

                test("should return empty array on empty page", async () => {
                    const paramPage = 100;

                    const res = await request(app).get(`/api/profiles/pages/${paramPage}`).set("Accept", "application/json");

                    expect(res.status).toBe(200);
                    expect(res).toBeDefined();
                    expect(res.body.length).toBe(0);
                });
            });
        });

        describe("POST", () => {
            test("should create a new profile", async () => {
                const profile = {
                    USER_ID: 3,
                    first_name: "Anna",
                    last_name: "Kiss",
                    birth_date: "1992-07-15",
                    bio: "Admin2 profil",
                    avatar_url: "/admin2.png"
                }

                await request(app).post("/api/profiles").send(profile).expect(201);


                const foundProfile = await db.User_Profile.findOne(
                    {
                        where:
                        {
                            USER_ID: profile.USER_ID,
                        },
                    });

                expect(foundProfile).toBeDefined();

                expect(foundProfile.first_name).toEqual(profile.first_name);
                expect(foundProfile.last_name).toEqual(profile.last_name);
                expect(foundProfile.bio).toEqual(profile.bio);
                expect(foundProfile.avatar_url).toEqual(profile.avatar_url);

                expect(foundProfile.birth_date).toBe(profile.birth_date);
            });

            test("should throw error on invalid user id", async () => {
                const profile = {
                    USER_ID: 9999,
                    first_name: "Anna",
                    last_name: "Kiss",
                    birth_date: "1992-07-15",
                    bio: "Admin2 profil",
                    avatar_url: "/admin2.png"
                }

                const res = await request(app).post("/api/profiles").send(profile).expect(400);

                expect(res.body.message).toBe("Nincs ilyen felhasználó");
            });

            test.each([
                [{
                    USER_ID: 3,
                    first_name: undefined,
                    last_name: "Kiss",
                }, "Hiányzó first_name"],
                [{
                    USER_ID: 3,
                    first_name: "Anna",
                    last_name: undefined,
                }, "Hiányzó last_name"],
            ])("should throw error on missing name", async (payload, expectedMessage) => {

                const res = await request(app).post("/api/profiles").send(payload).expect(400);

                expect(res.body.message).toBe(expectedMessage);
            });

            test.each([
                [{ USER_ID: 3, first_name: 1, last_name: "Kiss" }, "Érvénytelen first_name"],
                [{ USER_ID: 3, first_name: "Anna", last_name: 2, }, "Érvénytelen last_name"],
                [{ USER_ID: 3, first_name: "Anna", last_name: "Kiss", schools: 3 }, "Érvénytelen schools mező"],
                [{ USER_ID: 3, first_name: "Anna", last_name: "Kiss", birth_date: new Date() }, "Érvénytelen birth_date mező"],
                [{ USER_ID: 3, first_name: "Anna", last_name: "Kiss", birth_place: 4 }, "Érvénytelen birth_place mező"],
                [{ USER_ID: 3, first_name: "Anna", last_name: "Kiss", bio: 5 }, "Érvénytelen bio"],
            ])("should throw error on invalid attributes", async (payload, expectedMessage) => {

                const res = await request(app).post("/api/profiles").send(payload).expect(403);

                expect(res.body.message).toBe(expectedMessage);
            });
        });

        describe("DELETE", () => {
            test("should delete profile from db", async () => {
                const inputID = 2;

                await request(app).delete(`/api/profiles/${inputID}`).expect(204);

                const foundProfile = await db.User_Profile.findOne(
                    {
                        where:
                        {
                            USER_ID: inputID,
                        },
                    });

                expect(foundProfile).toBeNull();
            });

            test("should throw error on invalid id", async () => {
                const inputID = 9999;

                const res = await request(app).delete(`/api/profiles/${inputID}`).expect(400);

                expect(res.body.message).toBe("Nincs ilyen felhasználói profil");
            });
        });

        describe("UPDATE", () => {

            test("should update profile from db", async () => {
                const inputID = 1;


                const updateUser = {
                    first_name: "update_Gergő",
                    last_name: "update_Kovács",
                };

                await request(app).patch(`/api/profiles/${inputID}`).send(updateUser).expect(200);

                const foundProfile = await db.User_Profile.findOne(
                    {
                        where:
                        {
                            USER_ID: inputID,
                        },
                    });

                expect(foundProfile).toBeDefined();
                expect(foundProfile.first_name).toEqual(updateUser.first_name);
                expect(foundProfile.last_name).toEqual(updateUser.last_name);
            });

            test("should return error on no update", async () => {
                const inputID = 1;


                const updateUser = {
                    first_name: "Gergő",
                    last_name: "Kovács",
                };

                const res = await request(app).patch(`/api/profiles/${inputID}`).send(updateUser);



                expect(res.body.first_name).toEqual(rawProfiles[0].first_name);
                expect(res.body.last_name).toEqual(rawProfiles[0].last_name);
            });

            test("should return error on invalid id", async () => {
                const inputID = 9999;

                const updateUser = {
                    first_name: "update_Gergő",
                    last_name: "update_Kovács",
                };

                const res = await request(app).patch(`/api/profiles/${inputID}`).send(updateUser).expect(400);

                expect(res.body.message).toBe("Nincs ilyen felhasználó");
            });

            test.each([
                [{ first_name: undefined, last_name: "update_Kovács", }, "Hiányzó first_name"],
                [{ first_name: "update_Gergő", last_name: undefined }, "Hiányzó last_name"],
            ])("should throw error on missing name", async (payload, expectedMessage) => {
                const inputID = 1;


                const res = await request(app).patch(`/api/profiles/${inputID}`).send(payload).expect(400);

                expect(res.body.message).toBe(expectedMessage);
            });

            test.each([
                [{ first_name: 1, last_name: "update_Kovács" }, "Érvénytelen first_name"],
                [{ first_name: "update_Gergő", last_name: 2 }, "Érvénytelen last_name"],
                [{ first_name: "update_Gergő", last_name: "update_Kovács", schools: 3 }, "Érvénytelen schools mező"],
                [{ first_name: "update_Gergő", last_name: "update_Kovács", birth_date: new Date() }, "Érvénytelen birth_date mező"],
                [{ first_name: "update_Gergő", last_name: "update_Kovács", birth_place: 4 }, "Érvénytelen birth_place mező"],
                [{ first_name: "update_Gergő", last_name: "update_Kovács", bio: 5 }, "Érvénytelen bio"],
            ])("should throw error on invalid attributes", async (payload, expectedMessage) => {
                const inputID = 1;

                const res = await request(app).patch(`/api/profiles/${inputID}`).send(payload).expect(403);

                expect(res.body.message).toBe(expectedMessage);
            });
        });

        describe("XP function tests", () => {

            test("should add xp to profile", async () => {
                const inputID = 1;
                const XPAmount = 50;

                const result = await user_profileService.addXPToUser(inputID, XPAmount, transaction);

                expect(result.success).toBe(true);
                expect(result.xpAdded).toBe(XPAmount);

                const { profile: updatedProfile } = await user_profileService.getUser_Profile(inputID);
                expect(updatedProfile.XP).toBe(XPAmount);
            });

            test("should throw error on missing user id", async () => {
                const inputID = undefined;
                const XPAmount = 50;

                try {
                    await user_profileService.addXPToUser(inputID, XPAmount, transaction);
                }
                catch (error) {
                    expect(error.message).toBe("Hiányzó user ID")
                    expect(error).toBeInstanceOf(BadRequestError);
                }
            });

            test("should throw error on missint xp", async () => {
                const inputID = 1;
                const XPAmount = undefined;

                try {
                        await user_profileService.addXPToUser(inputID, XPAmount, transaction);
                }
                catch (error) {
                    expect(error.message).toBe("Hiányzó xp érték")
                    expect(error).toBeInstanceOf(BadRequestError);
                }
            });

            test("should throw error on invalid xp", async () => {
                const inputID = 1;
                const XPAmount = "50";

                try {
                        await user_profileService.addXPToUser(inputID, XPAmount, transaction);
                }
                catch (error) {
                    expect(error.message).toBe("Érvénytelen XP érték")
                    expect(error).toBeInstanceOf(ValidationError);
                }
            });

            test("should throw error on invalid user", async () => {
                const inputID = 9999;
                const XPAmount = 50;

                try {
                        await user_profileService.addXPToUser(inputID, XPAmount, transaction);
                }
                catch (error) {
                    expect(error.message).toBe("User nem található")
                    expect(error).toBeInstanceOf(BadRequestError);
                }
            });

            test("should throw error on missing user profile", async () => {
                const inputID = 3;
                const XPAmount = 50;

                try {
                        await user_profileService.addXPToUser(inputID, XPAmount, transaction);
                }
                catch (error) {
                    expect(error.message).toBe("Profil nem található")
                    expect(error).toBeInstanceOf(BadRequestError);
                }
            });

            test("should throw error ValidationError in model on invalid xp", async () => {
                const inputID = 1;
                const XPAmount = 50;

                try {
                        const { profile } = await user_profileService.getUser_Profile(inputID, { transaction });

                        await profile.addXP(XPAmount, transaction);
                }
                catch (error) {
                    expect(error.message).toBe(`Érvénytelen XP érték: ${xpAmount}`)
                    expect(error).toBeInstanceOf(ValidationError);
                }
            });

            // test("should run own transaction on missing transaction", async () => {
            //     const inputID = 1;
            //     const XPAmount = 50;

            //     const { profile } = await user_profileService.getUser_Profile(inputID, { transaction });

            //     await profile.addXP(XPAmount);


            //     const { profile: updatedProfile } = await user_profileService.getUser_Profile(inputID);
            //     expect(updatedProfile.XP).toBe(XPAmount);
            // });
        });
    });
});
