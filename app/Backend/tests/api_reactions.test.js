const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const { } = require("../api/services")(db);
const authUtils = require("../api/utilities/authUtils");



describe("user_settings_Controller", () => {
    const rawUsers = [
        { ID: 1, username: "admin", email: "admin@example.com", password: "Jelszo123#", role: "admin" },
        { ID: 2, username: "user", email: "user@example.com", password: "Jelszo123#", role: "user" },
    ];

    const rawProfiles = [
        { USER_ID: 1, first_name: "Gergő", last_name: "Kovács", birth_date: "1990-05-10", bio: "Admin profil", avatar_url: "/admin.png" },
        { USER_ID: 2, first_name: "John", last_name: "Doe", birth_date: "1999-07-05", bio: "User profil", avatar_url: "/user.png" },
    ];

    const settings = [
        {
            ID: 1,
            Notifications:
            {
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
            Notifications:
            {
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
        { ID: 1, USER_ID: 1, content: "(1) test post content", title: "(1) test post title" },
        { ID: 2, USER_ID: 2, content: "(2) test post content", title: "(2) test post title" },
        { ID: 3, USER_ID: 2, content: "(3) test post content", title: "(3) test post title" },
    ];

    const rawPostsReactions = [
        { ID: 1, USER_ID: 1, POST_ID: 1, reaction: "like" },
        { ID: 2, USER_ID: 1, POST_ID: 2, reaction: "dislike" },
        { ID: 3, USER_ID: 2, POST_ID: 2, reaction: "dislike" },
        { ID: 4, USER_ID: 2, POST_ID: 1, reaction: "like" },
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
        await db.Settings.bulkCreate(settings);
        await db.User_Post.bulkCreate(rawPosts);
        await db.User_Post_Reaction.bulkCreate(rawPostsReactions);
    });

    afterEach(async () => {
        await db.User.destroy({ where: {} });
        await db.User_Profile.destroy({ where: {} });
        await db.Settings.destroy({ where: {} });
        await db.User_Post_Reaction.destroy({ where: {} });
    });

    describe("/api/reactions", () => {
        describe("GET", () => {
            describe("GET /api/reactions", () => {
                test("should get all reactions in db", async () => {
                    const res = await request(app).get("/api/reactions").expect(200);

                    expect(res.body).toBeDefined();
                    expect(res.body.length).toBe(4);
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            rawPostsReactions.map(reaction => expect.objectContaining({
                                USER_ID: reaction.USER_ID,
                                POST_ID: reaction.POST_ID,
                                reaction: reaction.reaction,
                            })))
                    );
                })
            });

            describe("GET /api/reactions/:itemId", () => {
                test("should one item by itemId(post id) and token", async () => {
                    const itemId = 1;
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const res = await request(app).get(`/api/reactions/${itemId}`).set("Cookie", [cookie]).expect(200);


                    expect(res.body).toBeDefined();
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            USER_ID: rawPostsReactions[0].USER_ID,
                            POST_ID: rawPostsReactions[0].POST_ID,
                            reaction: rawPostsReactions[0].reaction,
                        }));
                })

                test("should return null on invalid id", async () => {
                    const itemId = 9999;
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const res = await request(app).get(`/api/reactions/${itemId}`).set("Cookie", [cookie]).expect(200);


                    expect(res.body).toBeNull();
                })

                test("should throw error on invalid token", async () => {
                    const itemId = 1;
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}_invalid`;

                    const res = await request(app).get(`/api/reactions/${itemId}`).set("Cookie", [cookie]).expect(400);


                    expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
                })
            })
        });

        describe("POST", () => {
            describe("POST /api/reactions", () => {
                test("should create new reaction", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const reactionData = {
                        POST_ID: rawPosts[2].ID,
                        reaction: "like",
                    }

                    const res = await request(app).post("/api/reactions").send(reactionData).set("Cookie", [cookie]).expect(200);



                    expect(res.body).toBeDefined();
                    expect(res.body.createdReaction).toEqual(
                        expect.objectContaining({
                            POST_ID: reactionData.POST_ID,
                            reaction: reactionData.reaction,
                        }));
                })

                test("should update existing raction", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const reactionData = {
                        POST_ID: rawPosts[1].ID,
                        reaction: "like",
                    }

                    const res = await request(app).post("/api/reactions").send(reactionData).set("Cookie", [cookie]).expect(200);


                    const foundReaction = await db.User_Post_Reaction.findOne({
                        where: { POST_ID: reactionData.POST_ID }
                    })

                    expect(res.body).toBeDefined();
                    expect(res.body.updatedReaction).toBe(1);
                    expect(foundReaction).toEqual(
                        expect.objectContaining({
                            reaction: reactionData.reaction,
                        }));
                })

                test("should remove reaction", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const reactionData = {
                        POST_ID: rawPosts[1].ID,
                        reaction: "dislike",
                    }

                    const res = await request(app).post("/api/reactions").send(reactionData).set("Cookie", [cookie]).expect(200);


                    const foundReaction = await db.User_Post_Reaction.findOne({
                        where: { POST_ID: reactionData.POST_ID, USER_ID: testUser.ID }
                    })

                    expect(res.body).toBeDefined();
                    expect(res.body.removedReaction).toBeTruthy();
                    expect(foundReaction).toBeNull();
                })

                test("should throw error on invalid token", async () => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}_invalid`;

                    const reactionData = {
                        POST_ID: rawPosts[2].ID,
                        reaction: "like",
                    }

                    const res = await request(app).post("/api/reactions").send(reactionData).set("Cookie", [cookie]).expect(400);

                    expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
                })

                test.each([
                    [{ POST_ID: undefined, reaction: "like", }, "Hiányzó post id"],
                    [{ POST_ID: rawPosts[2].ID, reaction: undefined, }, "Hiányzó reaction"],
                    [{ POST_ID: 9999, reaction: "like", }, "A cél post nem található"],
                ])("should throw error on missing attributes", async (payload, expextedMessage) => {
                    const token = authUtils.generateUserToken(testUser);
                    const cookie = `user_token=${token}`;

                    const res = await request(app).post("/api/reactions").send(payload).set("Cookie", [cookie]).expect(400);

                    expect(res.body.message).toBe(expextedMessage);
                })
            })
        });

        describe("DELETE", () => {
            describe("DELETE /api/reactions", () => {
                test("should delete reaction by ID", async () => {
                    const itemId = 1;

                    await request(app).delete(`/api/reactions/${itemId}`).expect(200);

                    const foundReaction = await db.User_Post_Reaction.findOne({
                        where: { ID: itemId }
                    })

                    expect(foundReaction).toBeNull();
                })

                test("should throw error on invalid id", async () => {
                    const itemId = 9999;

                    const res = await request(app).delete(`/api/reactions/${itemId}`).expect(400);

                    expect(res.body.message).toBe("Nincs ilyen user post reakció.");
                })
            })
        });
    });
});
