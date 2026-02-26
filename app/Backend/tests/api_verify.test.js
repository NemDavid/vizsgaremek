const request = require("supertest");
const bcrypt = require("bcrypt");

require("dotenv").config({ quiet: true });

const app = require("../app");

jest.mock("../api/db");

const db = require("../api/db");

const authUtils = require("../api/utilities/authUtils");

describe("user_settings_Controller", () => {
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
  ];

  const rawProfiles = [
    {
      USER_ID: 1,
      first_name: "Gergő",
      last_name: "Kovács",
      birth_date: "1990-05-10",
      bio: "Admin profil",
      avatar_url: "/admin.png",
    },
    {
      USER_ID: 2,
      first_name: "John",
      last_name: "Doe",
      birth_date: "1999-07-05",
      bio: "User profil",
      avatar_url: "/user.png",
    },
  ];

  const codes = [
    {
      ID: 1,
      email: "admin@example.com",
      verify_code_hash: authUtils.hashCode("" + authUtils.generateVerifyCode()),
    },
  ];

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
    await db.Verify_Code.bulkCreate(codes);
  });

  afterEach(async () => {
    await db.User.destroy({ where: {} });
    await db.User_Profile.destroy({ where: {} });
    await db.Verify_Code.destroy({ where: {} });
  });

  describe("/api/verify", () => {
    describe("GET", () => {
      describe("GET /api/verify", () => {
        test("should get all codes in db", async () => {
          const res = await request(app).get("/api/verify").expect(200);

          expect(res.body).toBeDefined();
          expect(res.body).toEqual(
            expect.arrayContaining(
              codes.map((code) =>
                expect.objectContaining({
                  email: code.email,
                  verify_code_hash: code.verify_code_hash,
                }),
              ),
            ),
          );
        });
      });

      describe("GET /api/verify/:itemId", () => {
        test("should get one code by itemId", async () => {
          const itemId = 1;

          const res = await request(app)
            .get(`/api/verify/${itemId}`)
            .expect(200);

          expect(res.body).toBeDefined();
          expect(res.body).toEqual(
            expect.objectContaining({
              email: codes[itemId - 1].email,
              verify_code_hash: codes[itemId - 1].verify_code_hash,
            }),
          );
        });
      });

      describe("GET /api/verify/Email", () => {
        test("should get one code to its email", async () => {
          const email = rawUsers[0].email;
          const token = authUtils.generateUserToken(rawUsers[0]);
          const cookie = `user_token=${token}`;

          const res = await request(app)
            .get("/api/verify/Email")
            .send({ email })
            .set("Cookie", [cookie])
            .expect(200);

          expect(res.body).toBeDefined();
          expect(res.body).toEqual(
            expect.objectContaining({
              email: codes[0].email,
              verify_code_hash: codes[0].verify_code_hash,
            }),
          );
        });

        test("should throw error on missing email", async () => {
          const email = undefined;
          const token = authUtils.generateUserToken(rawUsers[0]);
          const cookie = `user_token=${token}`;

          const res = await request(app)
            .get("/api/verify/Email")
            .send({ email })
            .set("Cookie", [cookie])
            .expect(400);

          expect(res.body.message).toBe("Hiányzó email");
        });
      });
    });

    describe("POST", () => {
      describe("POST /api/verify", () => {
        test("should create code", async () => {
          const email = rawUsers[1].email;
          const res = await request(app)
            .post("/api/verify")
            .send({ email })
            .expect(201);

          expect(res.body).toBeDefined();
          expect(res.body.Verify_code.dataValues.email).toBe(rawUsers[1].email);
        });

        test("should throw error on duplicaded email attribute", async () => {
          const email = rawUsers[0].email;
          await request(app).post("/api/verify").send({ email }).expect(500);
        });

        test("should throw error on missing email", async () => {
          const email = undefined;
          const res = await request(app)
            .post("/api/verify")
            .send({ email })
            .expect(400);

          expect(res.body.message).toBe("Hianyzó email");
        });
      });
    });

    describe("DELETE", () => {
      describe("DELETE /api/verify", () => {
        test("should delete code by email in body", async () => {
          const email = rawUsers[0].email;
          await request(app).delete("/api/verify").send({ email }).expect(200);

          const foundCode = await db.Verify_Code.findOne({
            where: { email: email },
          });

          expect(foundCode).toBeNull();
        });

        test("should thorw error on email that hasn't code", async () => {
          const email = rawUsers[1].email;
          const res = await request(app)
            .delete("/api/verify")
            .send({ email })
            .expect(400);

          expect(res.body.message).toBe("Nincs code db-ben ehhez az emailhez");
        });

        test("should throw error on missing email", async () => {
          const email = undefined;
          const res = await request(app)
            .delete("/api/verify")
            .send({ email })
            .expect(400);

          expect(res.body.message).toBe("Hiányzó email");
        });
      });

      describe("DELETE /api/verify/:itemId", () => {
        test("should delete code by itemId", async () => {
          const itemId = codes[0].ID;
          await request(app).delete(`/api/verify/${itemId}`).expect(200);

          const foundCode = await db.Verify_Code.findOne({
            where: { ID: itemId },
          });

          expect(foundCode).toBeNull();
        });

        test("should throw error on invalid itemId", async () => {
          const itemId = 9999;
          const res = await request(app)
            .delete(`/api/verify/${itemId}`)
            .expect(400);

          expect(res.body.message).toBe("Nincs ilyen code db ben");
        });
      });
    });

    describe("UPDATE", () => {
      describe("UPDATE /api/verify/email/:email", () => {
        test("should update code by itemId", async () => {
          const email = rawUsers[0].email;
          const verify_code = "" + authUtils.generateVerifyCode();

          await request(app)
            .patch(`/api/verify/email/${email}`)
            .send({ verify_code })
            .expect(200);

          const foundCode = await db.Verify_Code.findOne({
            where: { email: email },
          });

          expect(foundCode.email).toBe(email);
          expect(
            bcrypt.compareSync(verify_code, foundCode.verify_code_hash),
          ).toBeTruthy();
        });

        test("should throw error on email that hasn't code", async () => {
          const email = "invalid@gmail.com";
          const verify_code = authUtils.generateVerifyCode();

          const res = await request(app)
            .patch(`/api/verify/email/${email}`)
            .send({ verify_code })
            .expect(400);

          expect(res.body.message).toBe("Code nem található");
        });

        test("should generate code on missing code input", async () => {
          const email = rawUsers[0].email;
          const verify_code = undefined;

          const res = await request(app)
            .patch(`/api/verify/email/${email}`)
            .send({ verify_code })
            .expect(200);

          expect(res.body.email).toBe(email);
        });
      });
    });
  });
});
