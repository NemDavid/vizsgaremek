const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");


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

        await db.User.bulkCreate([...users, singleUser]);
        await db.User_Profile.bulkCreate(rawProfiles);
    });

    afterEach(async () => {
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
            });
        });
    });
});
