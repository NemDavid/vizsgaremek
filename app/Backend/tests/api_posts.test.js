const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");
const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");

describe("user_Posts_Router (/api/posts)", () => {
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

    const rawPosts = [
        {
            ID: 1,
            USER_ID: 2,
            content: "test comment (1)",
            title: "test title (1)",
        },
        {
            ID: 2,
            USER_ID: 3,
            content: "test comment (2)",
            title: "test title (2)",
        },
        {
            ID: 3,
            USER_ID: 4,
            content: "test comment (3)",
            title: "test title (3)",
        },
        { ID: 4, USER_ID: 2, content: "test comment (4)", title: "test title (4)" },
        { ID: 5, USER_ID: 3, content: "test comment (5)", title: "test title (5)" },
        { ID: 6, USER_ID: 4, content: "test comment (6)", title: "test title (6)" },
        { ID: 7, USER_ID: 2, content: "test comment (7)", title: "test title (7)" },
        { ID: 8, USER_ID: 3, content: "test comment (8)", title: "test title (8)" },
        { ID: 9, USER_ID: 4, content: "test comment (9)", title: "test title (9)" },
        { ID: 10, USER_ID: 2, content: "test comment (10)", title: "test title (10)", },
        { ID: 11, USER_ID: 3, content: "test comment (11)", title: "test title (11)", },
        { ID: 12, USER_ID: 4, content: "test comment (12)", title: "test title (12)", },
        { ID: 13, USER_ID: 2, content: "test comment (13)", title: "test title (13)", },
        { ID: 14, USER_ID: 3, content: "test comment (14)", title: "test title (14)", },
        { ID: 15, USER_ID: 4, content: "test comment (15)", title: "test title (15)", },
        { ID: 16, USER_ID: 2, content: "test comment (16)", title: "test title (16)", },
        { ID: 17, USER_ID: 3, content: "test comment (17)", title: "test title (17)", },
        { ID: 18, USER_ID: 4, content: "test comment (18)", title: "test title (18)", },
        { ID: 19, USER_ID: 2, content: "test comment (19)", title: "test title (19)", },
        { ID: 20, USER_ID: 3, content: "test comment (20)", title: "test title (20)", },
        { ID: 21, USER_ID: 4, content: "test comment (21)", title: "test title (21)", },
        { ID: 22, USER_ID: 2, content: "test comment (22)", title: "test title (22)", },
        { ID: 23, USER_ID: 3, content: "test comment (23)", title: "test title (23)", },
        { ID: 24, USER_ID: 4, content: "test comment (24)", title: "test title (24)", },
        { ID: 25, USER_ID: 2, content: "test comment (25)", title: "test title (25)", },
        { ID: 26, USER_ID: 3, content: "test comment (26)", title: "test title (26)", },
        { ID: 27, USER_ID: 4, content: "test comment (27)", title: "test title (27)", },
        { ID: 28, USER_ID: 2, content: "test comment (28)", title: "test title (28)", },
        { ID: 29, USER_ID: 3, content: "test comment (29)", title: "test title (29)", },
        { ID: 30, USER_ID: 4, content: "test comment (30)", title: "test title (30)", },
        { ID: 31, USER_ID: 2, content: "test comment (31)", title: "test title (31)", },
        { ID: 32, USER_ID: 3, content: "test comment (32)", title: "test title (32)", },
        { ID: 33, USER_ID: 4, content: "test comment (33)", title: "test title (33)", },
        { ID: 34, USER_ID: 1, content: "test comment (34)", title: "test title (34)", },
    ];
    const testUser = {
        ID: rawUsers[0].ID,
        username: rawUsers[0].username,
        email: rawUsers[0].email,
        role: rawUsers[0].role,
    };
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
        await db.User_Post.bulkCreate(rawPosts);
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
        await db.Settings.destroy({ where: {} });
        await db.User_Post.destroy({ where: {} });
    });

    afterAll(async () => {
        await db.sequelize.close();
    });

    // =============================
    // GET
    // =============================

    describe("GET /api/posts/all", () => {
        test("should return all user posts", async () => {
            const res = await request(app).get("/api/posts/all").expect(200);
            expect(res.body).toBeDefined();
            expect(res.body).toEqual(
                expect.arrayContaining(
                    rawPosts.map((p) =>
                        expect.objectContaining({
                            USER_ID: p.USER_ID,
                            ID: p.ID,
                        }),
                    ),
                ),
            );
        });
    });

    describe("GET /api/posts", () => {
        test.each([
            [{ page: 1, perPage: 1 }, 4],
            [{ page: 2, perPage: 1 }, 3],
            [{ page: 3, perPage: 1 }, 2],
        ])("should get all posts by page and perpage attributes", async (query, Cursor) => {
            const res = await request(app).get("/api/posts").query(query).expect(200);
            expect(res.body).toBeDefined();
            const expectedPosts = {
                data: [rawPosts[rawPosts.length - query.page - 1]], //[{"ID": 30, "USER_ID": 4, "comments": [], "content": "test comment (30)", "created_at": "2026-02-23", "dislike": 0, "like": 0, "media_url": "", "reactions": [], "title": "test title (30)", "updated_at": "2026-02-23"}]
                nextCursor: Cursor
            }
            expect(res.body.data).toEqual(
                expect.arrayContaining(
                    expectedPosts.data.map((p) =>
                        expect.objectContaining({
                            USER_ID: p.USER_ID,
                            ID: p.ID,
                        }),
                    ),
                ),
            );
        });

        test.each([
            [{ page: 1, perPage: undefined }, "Hiányzó Adatok"],
            [{ page: undefined, perPage: 10 }, "Hiányzó Adatok"],
            [{ page: undefined, perPage: undefined }, "Hiányzó Adatok"],
        ])("should throw BadRequestError with unexisting query data for getting posts", async (payload, expectedMessage) => {
            const res = await request(app).get("/api/posts").query(payload).expect(400);
            expect(res.body.message).toBe(expectedMessage);
        });

        test.each([
            [{ page: -10, perPage: 10 }, "Rossz adatok"],
            [{ page: 1, perPage: -10 }, "Rossz adatok"],
            [{ page: -1000, perPage: -1000 }, "Rossz adatok"],
        ])("should throw ValidationError with invalide query data for posts", async (payload, expectedMessage) => {
            const res = await request(app).get("/api/posts").query(payload).expect(403);
            expect(res.body.message).toBe(expectedMessage);
        });
    });


    describe("GET /api/posts/user/:userId", () => {
        test("should return posts by userId", async () => {
            const res = await request(app)
                .get(`/api/posts/user/${testUser.ID}`)
                .expect(200);
            expect(res.body).toBeDefined();
            const UserPostedPosts = rawPosts.filter((e) => e.USER_ID == testUser.ID);
            expect(res.body).toEqual(
                expect.arrayContaining(
                    UserPostedPosts.map((p) =>
                        expect.objectContaining({
                            USER_ID: p.USER_ID,
                            ID: p.ID,
                        }),
                    ),
                ),
            );
        });

        test("should throw error by using not defined userId", async () => {
            const res = await request(app).get(`/api/posts/user/999`).expect(400);
            expect(res.body).toBeDefined();
            expect(res.body.message).toEqual("Nincs ilyen felhasználó");
        });
    });

    // =============================
    // POST
    // =============================

    describe("POST /api/posts", () => {
        test.each([
            [{ content: "Skibidi 1 test content", title: "Skibidi 1 test title" }],
            [{ content: "Skibidi 2 test content", title: "Skibidi 2 test title" }],
        ])("should create new user post with media", async (post) => {
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}`;
            const res = await request(app).post("/api/posts").send(post).set("Cookie", [cookie]).expect(201);

            expect(res.body).toBeDefined();
        });

        test.each([
            [{ content: "Skibidi test content", title: "Skibidi test title" }, "Hiányzó vagy lejárt token.", 400, "_invalid"],
            [{ content: "Skibidi test content", title: undefined }, "Hiányzó cim", 400, ""],
            [{ content: "Skibidi test content", title: "1" }, "A cím 3 és 255 karakter között lehet", 403, ""],
            [{ content: undefined, title: "Skibidi test title" }, "hiányzó content", 400, ""],
            [{ content: "12", title: "Skibidi test title" }, "A tartalom 3 és 1000 karakter között lehet", 403, ""],
        ])("should create new user post with media", async (post, errorMessage, errorStatus, tokenInvalid) => {
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}${tokenInvalid}`;

            const res = await request(app).post("/api/posts").send(post).set("Cookie", [cookie]).expect(errorStatus);

            expect(res.body.message).toBe(errorMessage);
        });
    });

    // =============================
    // PATCH
    // =============================

    describe("PATCH /api/posts/:postId", () => {
        test.each([
            [{ ID: 34, USER_ID: 1 }, { content: "updated" }],
            [{ ID: 34, USER_ID: 1 }, { title: "updated" }]
        ])("should update user post", async (data, updatedData) => {
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}`;            
            const res = await request(app)
                .patch(`/api/posts/${data.ID}`)
                .send(updatedData)
                .set("Cookie", [cookie])
                .expect(200);

            expect(res.body).toBeDefined();

            const result = await db.User_Post.findOne({ where: { ID: data.ID } });
            expect(result).toBeTruthy();


            Object.keys(updatedData).forEach((k) => {
                expect(result[k]).toBe(updatedData[k]);
            });
        })

        test.each([
            [{message:"Nincs ilyen post", status:400}, {ID: 999, content: "update", title: "update"}],
            [{message:"Ez nem a te posztod", status: 400}, {ID: 1, content: "update", title: "update"}],
            [{message:"Hiányzó adat", status: 400}, {ID: 34, content: undefined, title: undefined}],
        ])("should throw error on bad update post", async (error, data) => {
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}`;            
            
            const res = await request(app)
                .patch(`/api/posts/${data.ID}`)
                .send(data)
                .set("Cookie", [cookie])
                .expect(error.status);

                expect(res.body.message).toBe(error.message);
        })

        test("should throw error on invalid token", async () => {
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}_invalid`; 

            const data = { ID: 34, content: "update", title: "update" };

            const res = await request(app)
                .patch(`/api/posts/${data.ID}`)
                .send(data)
                .set("Cookie", [cookie])
                .expect(400);

            expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
        })
    });

    // =============================
    // DELETE
    // =============================

    describe("DELETE /api/posts/:postId", () => {
        test("should delete user post", async () => {
            const itemId = 34;
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}`;
            await request(app).delete(`/api/posts/${itemId}`).set("Cookie", [cookie]).expect(200);

            const result = await db.User_Post.findOne({
                where: { ID: itemId }
            });

            expect(result).toBeNull();
        });

        test.each([
            [9999, "Nincs ilyen post"],
            [1, "Ez nem a te posztod"],
        ])("should throw error on missing id for post deletion", async (itemId, expectedMessage) => {
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}`;

            const res = await request(app).delete(`/api/posts/${itemId}`).set("Cookie", [cookie]).expect(400);

            expect(res.body.message).toBe(expectedMessage);
        });

        test("should throw error on invalid token", async () => {
            const itemId = 34;
            const token = authUtils.generateUserToken(testUser);
            const cookie = `user_token=${token}_invalid`;
            const res = await request(app).delete(`/api/posts/${itemId}`).set("Cookie", [cookie]).expect(400);

            expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
        });
    });
});
