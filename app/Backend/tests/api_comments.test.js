const request = require("supertest");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");
const { BadRequestError, ValidationError } = require("../api/errors");
const { Op } = require("sequelize");

describe("/api/comments", () => {
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
  ];

  const rawComments = [
    {
      ID: 1,
      USER_ID: 1,
      POST_ID: 1,
      comment: "test comment (1)",
    },
    {
      ID: 2,
      USER_ID: 2,
      POST_ID: 1,
      comment: "test comment (2)",
    },
    {
      ID: 3,
      USER_ID: 3,
      POST_ID: 2,
      comment: "test comment (3)",
    },
    {
      ID: 4,
      USER_ID: 4,
      POST_ID: 2,
      comment: "test comment (4)",
    },
  ];

  const testUser = {
    ID: rawUsers[0].ID,
    username: rawUsers[0].username,
    email: rawUsers[0].email,
    role: rawUsers[0].role,
  };

  const invalidComment = `
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        x`;

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
    await db.User_Post_Comment.bulkCreate(rawComments);
  });

  afterEach(async () => {
    await db.User.destroy({ where: {} });
    await db.User_Profile.destroy({ where: {} });
    await db.Settings.destroy({ where: {} });
    await db.User_Post.destroy({ where: {} });
    await db.User_Post_Comment.destroy({ where: {} });
  });

  describe("GET", () => {
    describe("GET /api/comments", () => {
      test("should get all comments from db", async () => {
        const res = await request(app).get("/api/comments").expect(200);

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
          expect.arrayContaining(
            rawComments.map((comment) =>
              expect.objectContaining({
                USER_ID: comment.USER_ID,
                POST_ID: comment.POST_ID,
                comment: comment.comment,
              }),
            ),
          ),
        );
      });
    });

    describe("GET /api/comments/:itemId", () => {
      test("should get one comment from db by id", async () => {
        const itemId = 1;
        const res = await request(app)
          .get(`/api/comments/${itemId}`)
          .expect(200);

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
          expect.objectContaining({
            USER_ID: rawComments[itemId - 1].USER_ID,
            POST_ID: rawComments[itemId - 1].POST_ID,
            comment: rawComments[itemId - 1].comment,
          }),
        );
      });
      test("should get null on invalid id", async () => {
        const itemId = 9999;
        const res = await request(app)
          .get(`/api/comments/${itemId}`)
          .expect(200);

        expect(res.body).toBeNull();
      });
    });

    describe("GET /api/comments/postComments/:itemId", () => {
      test("should get one post comments by post id", async () => {
        const itemId = 2;
        const res = await request(app)
          .get(`/api/comments/postComments/${itemId}`)
          .expect(200);

        const foundComments = await db.User_Post_Comment.findAll({
          where: { POST_ID: itemId },
        });

        expect(res.body).toBeDefined();
        expect(res.body).toEqual(
          expect.arrayContaining(
            foundComments.map((comment) =>
              expect.objectContaining({
                USER_ID: comment.USER_ID,
                POST_ID: comment.POST_ID,
                comment: comment.comment,
              }),
            ),
          ),
        );
      });

      test("should get empty array on uncommented post", async () => {
        const itemId = 3;
        const res = await request(app)
          .get(`/api/comments/postComments/${itemId}`)
          .expect(200);

        expect(res.body).toBeDefined();
        expect(res.body.length).toBe(0);
      });

      test("should throw error on invalid post id", async () => {
        const itemId = 9999;
        const res = await request(app)
          .get(`/api/comments/postComments/${itemId}`)
          .expect(400);

        expect(res.body.message).toBe("Ez a post nem létezik");
      });
    });
  });

  describe("POST", () => {
    describe("POST /api/comments", () => {
      test("should create a new comment", async () => {
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}`;
        const commentData = {
          ID: 5,
          POST_ID: 3,
          comment: "test comment (post)",
        };

        const res = await request(app)
          .post("/api/comments")
          .send(commentData)
          .set("Cookie", [cookie])
          .expect(201);

        const foundComment = await db.User_Post_Comment.findOne({
          where: { ID: commentData.ID },
        });

        expect(foundComment).toBeDefined();
        expect(res.body.comment).toEqual(
          expect.objectContaining({
            POST_ID: commentData.POST_ID,
            comment: commentData.comment,
          }),
        );
      });

      test("should throw error on invalid token", async () => {
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}_invalid`;
        const commentData = {
          POST_ID: 3,
          comment: "test comment (post)",
        };

        const res = await request(app)
          .post("/api/comments")
          .send(commentData)
          .set("Cookie", [cookie])
          .expect(400);

        expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
      });

      test("should throw error on invalid post id", async () => {
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}`;
        const commentData = {
          POST_ID: 9999,
          comment: "test comment (post)",
        };

        const res = await request(app)
          .post("/api/comments")
          .send(commentData)
          .set("Cookie", [cookie])
          .expect(400);

        expect(res.body.message).toBe("A cél post nem található");
      });

      test.each([
        [
          { POST_ID: undefined, comment: "test comment (post)" },
          "Hiányzó post id",
        ],
        [{ POST_ID: 3, comment: undefined }, "A komment nem lehet üres"],
        [{ POST_ID: 3, comment: "" }, "A komment nem lehet üres"],
        [{ POST_ID: 3, comment: "      " }, "A komment nem lehet üres"],
        [
          { POST_ID: 3, comment: invalidComment },
          "A komment túl hosszú (max 500 karakter)",
        ],
      ])(
        "should throw error on invalid attributes",
        async (payload, expectedMessage) => {
          const token = authUtils.generateUserToken(testUser);
          const cookie = `user_token=${token}`;

          const res = await request(app)
            .post("/api/comments")
            .send(payload)
            .set("Cookie", [cookie])
            .expect(400);

          expect(res.body.message).toBe(expectedMessage);
        },
      );
    });
  });

  describe("DELETE", () => {
    describe("DELETE /api/comments/:itemId", () => {
      test("should delete comment by id", async () => {
        const itemId = 1;
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}`;

        await request(app)
          .delete(`/api/comments/${itemId}`)
          .set("Cookie", [cookie])
          .expect(200);

        const foundComment = await db.User_Post_Comment.findOne({
          where: { ID: itemId },
        });

        expect(foundComment).toBeNull();
      });

      test("should throw error on invalid comment id", async () => {
        const itemId = 9999;
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}`;

        const res = await request(app)
          .delete(`/api/comments/${itemId}`)
          .set("Cookie", [cookie])
          .expect(400);

        expect(res.body.message).toBe("A cél comment nem található");
      });

      test("should throw error on invalid token", async () => {
        const itemId = 1;
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}_invalid`;

        const res = await request(app)
          .delete(`/api/comments/${itemId}`)
          .set("Cookie", [cookie])
          .expect(400);

        expect(res.body.message).toBe("Hiányzó vagy lejárt token.");
      });

      test("should throw error if user is not the owner of the comment", async () => {
        const itemId = 4;
        const token = authUtils.generateUserToken(testUser);
        const cookie = `user_token=${token}`;

        const res = await request(app)
          .delete(`/api/comments/${itemId}`)
          .set("Cookie", [cookie])
          .expect(400);

        expect(res.body.message).toBe("Ez nem a te commented");
      });
    });
  });
});
