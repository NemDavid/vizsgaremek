const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");
const { Op } = require("sequelize");



describe("advertismentController", () => {
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

            describe("GET /api/advertisement/random", () => {
                test("should get one random advertisment from db", async () => {
                    const res = await request(app).get("/api/advertisement/random").expect(200);

                    expect(res.body).toBeDefined();
                    expect(res.body.title).toBeDefined();
                    expect(res.body.subject).toBeDefined();
                    expect(res.body.imagePath).toBeDefined();
                })
            });

            describe("GET /api/advertisement/:itemId", () => {
                test("should get one advertisment by itemId", async () => {
                    const itemId = 1;

                    const res = await request(app).get(`/api/advertisement/${itemId}`).expect(200);

                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            title: rawAdvertisments[0].title,
                            subject: rawAdvertisments[0].subject,
                            imagePath: rawAdvertisments[0].imagePath,
                        }))
                })

                test("should get null if id invalid", async () => {
                    const itemId = 9999;

                    const res = await request(app).get(`/api/advertisement/${itemId}`).expect(400);

                    expect(res.body.message).toBe("Nincs ilyen hirdetés");
                })
            });
        });

        describe("DELETE", () => {
            describe("DELETE /api/advertisement", () => {
                test("should delete advertisments from db", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;
                    const res = await request(app).delete("/api/advertisement/1").set("Cookie", [cookie]).expect(200);

                    const result = await db.Advertisement.findOne({
                        where: { ID: 1 }
                    });

                    expect(result).toBeNull();
                })
                test.each([
                    ["asd", { status: 400, msg: "Nincs ilyen hirdetés" }],
                    ["999", { status: 400, msg: "Nincs ilyen hirdetés" }],
                ])("should throw error when advertisments id is not valid", async (id, error) => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;
                    await request(app).delete(`/api/advertisement/${id}`).set("Cookie", [cookie]).expect(error.status);
                })
            });
        });

        describe("UPDATE", () => {
            describe("UPDATE /api/advertisement", () => {

            });
        });

        describe("POST", () => {
            describe("POST /api/advertisement", () => {
                test("should create new advertisment", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const ad_data = { title: "post_title", subject: "post_subject" };
                    const path = require("path");
                    const filePath = path.join(__dirname, "fixtures", "test_advertisment.jpg");

                    const res = await request(app)
                        .post("/api/advertisement")
                        .field("title", ad_data.title)
                        .field("subject", ad_data.subject)
                        .attach("image", filePath)
                        .set("Cookie", [cookie])
                        .expect(201);

                    // response ellenőrzés (ami ténylegesen jön)
                    expect(res.body.ID).toBeDefined();
                    expect(res.body.imagePath).toContain("/cloud/");
                    expect(res.body.imagePath).toMatch(/^http:\/\/localhost:6769\/cloud\//);
                    expect(res.body.imagePath).toMatch(/\.(jpg|jpeg|png|webp)$/i);
                    expect(res.body.created_at).toBeDefined();

                    // DB ellenőrzés (title/subject tényleg mentve van-e)
                    const created = await db.Advertisement.findOne({ where: { ID: res.body.ID } });
                    expect(created).not.toBeNull();
                    expect(created.title).toBe(ad_data.title);
                    expect(created.subject).toBe(ad_data.subject);
                })
                test("should return 400 if image is missing", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const res = await request(app)
                        .post("/api/advertisement")
                        .field("title", "post_title")
                        .field("subject", "post_subject")
                        // nincs attach("image", ...)
                        .set("Cookie", [cookie])
                        .expect(400);

                    // controllered: "Hiányzó kép fájl (file)." üzenet :contentReference[oaicite:2]{index=2}
                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBe("Hiányzó kép fájl (file).");
                });

                test("should return 403 if file type is not allowed", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const path = require("path");
                    // csinálj egy nem-kép fixture-t: tests/fixtures/not_image.txt
                    const badFile = path.join(__dirname, "fixtures", "not_image.txt");

                    const res = await request(app)
                        .post("/api/advertisement")
                        .field("title", "post_title")
                        .field("subject", "post_subject")
                        .attach("image", badFile)
                        .set("Cookie", [cookie])
                        .expect(403);

                    expect(res.body).toBeDefined();
                    expect(res.body.message).toBe("Rossz file típus");
                });

                test("should return 401/400 if auth cookie missing (depends on your middleware)", async () => {
                    const res = await request(app)
                        .post("/api/advertisement")
                        .send({ title: "x", subject: "y" })   // <- JSON, nem multipart
                        .expect(401);

                    expect(res.body.message).toBe("Hiányzó user token");
                });
            })
        });
    });
});
