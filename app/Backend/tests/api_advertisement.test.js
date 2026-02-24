const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");
const { Op } = require("sequelize");



describe("user_settings_Controller", () => {
    const rawUsers = [
        { ID: 1, username: "admin", email: "admin@example.com", password: "Jelszo123#", role: "admin" },
        { ID: 2, username: "user", email: "user@example.com", password: "Jelszo123#", role: "user" },
        { ID: 3, username: "user(2)", email: "user(2)@example.com", password: "Jelszo123#", role: "user" },
        { ID: 4, username: "user(3)", email: "user(3)@example.com", password: "Jelszo123#", role: "user" },
    ];

    const rawProfiles = [
        { USER_ID: 1, first_name: "Gergő", last_name: "Kovács", avatar_url: "/admin.png" },
        { USER_ID: 2, first_name: "John", last_name: "Doe", avatar_url: "/user.png" },
        { USER_ID: 3, first_name: "Nem", last_name: "David", avatar_url: "/user.png" },
        { USER_ID: 4, first_name: "test", last_name: "user", avatar_url: "/user.png" },
    ];

    const rawAdvertisments = [
        { ID: 1, title: "test_title (1)", subject: "test_subject (1)", imagePath: "/advertisment_1.png" },
        { ID: 2, title: "test_title (2)", subject: "test_subject (2)", imagePath: "/advertisment_2.png" },
    ];


    const testUser = {
        ID: rawUsers[0].ID,
        username: rawUsers[0].username,
        email: rawUsers[0].email,
        role: rawUsers[0].role,
    }


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
        await db.Advertisement.bulkCreate(rawAdvertisments);
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
        await db.Advertisement.destroy({ where: {} });
    });

    describe("/api/advertisement", () => {
        describe("GET", () => {
            describe("GET /api/advertisement/all", () => {
                test("should get all advertisments from db", async () => {
                    const res = await request(app).get("/api/advertisement/all").expect(200);

                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            rawAdvertisments.map(ad => expect.objectContaining({
                                title: ad.title,
                                subject: ad.subject,
                                imagePath: ad.imagePath,
                            })))
                    );
                })
            });
        });

        describe("DELETE", () => {
            describe("DELETE /api/advertisement", () => {

            });
        });

        describe("UPDATE", () => {
            describe("UPDATE /api/advertisement", () => {

            });
        });

        describe("POST", () => {
            describe("POST /api/advertisement", () => {

            })
        });
    });
});
