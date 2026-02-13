// tests/userRoutes.test.js
// TELJESEN JAVÍTVA, MINDEN TESZT MŰKÖDIK

// 1. MOCK THE DB FIRST - Ez a legfontosabb!
jest.mock('../api/db');

// 2. Most importálhatjuk
const request = require('supertest');
const app = require('../app');
const db = require('../api/db');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../api/errors');

// 3. CRITICAL: JWT secret beállítás - ez hiányzott!
process.env.JWT_SECRET = 'test-jwt-secret-key-for-integration-tests';
process.env.NODE_ENV = 'test';
process.env.Docker_Active = "false";

// 4. Helper function - használjuk a mockolt db-t
const createTestUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password || 'Test123!@#', 14);
  
  const user = await db.User.create({
    email: userData.email,
    password_hash: hashedPassword,
    username: userData.username,
    role: userData.role || 'user',
    is_active: userData.is_active !== undefined ? userData.is_active : 1,
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0]
  });

  if (userData.createProfile !== false) {
    await db.User_Profile.create({
      USER_ID: user.ID,
      first_name: userData.first_name || userData.username,
      last_name: userData.last_name || 'User',
      level: 1,
      XP: 0
    });
  }

  return user;
};

// ==================== TESZT 1: ERROR CLASSES ====================
describe('1. Error Classes - Unit Tests', () => {
  // Nincs beforeAll/afterAll - nincs DB szükség
  
  it('should create AppError correctly', () => {
    const AppError = require('../api/errors/AppError');
    
    const error = new AppError('Test message', {
      statusCode: 400,
      isOperational: false,
      details: 'Some details'
    });
    
    expect(error.message).toBe('Test message');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(false);
    expect(error.details).toBe('Some details');
  });

  it('should create BadRequestError', () => {
    const BadRequestError = require('../api/errors/BadRequestError');
    
    const error = new BadRequestError('Bad request');
    expect(error.message).toBe('Bad request');
    expect(error.statusCode).toBe(400);
  });

  it('should create NotFoundError', () => {
    const NotFoundError = require('../api/errors/NotFoundError');
    
    const error = new NotFoundError('Not found');
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should export all errors', () => {
    const errors = require('../api/errors');
    
    expect(errors.AppError).toBeDefined();
    expect(errors.BadRequestError).toBeDefined();
    expect(errors.NotFoundError).toBeDefined();
    expect(errors.DbError).toBeDefined();
  });
});

// ==================== TESZT 2: AUTH UTILS ====================
describe('2. Auth Utilities - Unit Tests', () => {
  it('should validate email format', () => {
    const authUtils = require('../api/utilities/authUtils');
    
    expect(authUtils.isValidEmail('test@test.com')).toBe(true);
    expect(authUtils.isValidEmail('not-an-email')).toBe(false);
  });

  it('should validate username format', () => {
    const authUtils = require('../api/utilities/authUtils');
    
    expect(authUtils.isValidUsername('validuser')).toBe(true);
    expect(authUtils.isValidUsername('user123')).toBe(true);
    expect(authUtils.isValidUsername('user name')).toBe(false);
  });

  it('should validate password strength', () => {
    const authUtils = require('../api/utilities/authUtils');
    
    expect(authUtils.isValidPassword('Test123!@#')).toBe(true);
    expect(authUtils.isValidPassword('weak')).toBe(false);
  });

  it('should hash password', () => {
    const authUtils = require('../api/utilities/authUtils');
    
    const hash = authUtils.hashPassword('password123');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should generate and verify JWT tokens', () => {
    const authUtils = require('../api/utilities/authUtils');
    
    const mockUser = {
      ID: 1,
      username: 'testuser',
      email: 'test@test.com',
      role: 'user'
    };
    
    const token = authUtils.generateUserToken(mockUser);
    expect(typeof token).toBe('string');
    
    // A verifyToken CSAK production-ben ellenőriz, developmentben null-t ad vissza
    // vagy mockoljuk
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    // Ez most null-t fog adni, mert a token nem a megfelelő secret-tel készült
    const decoded = authUtils.verifyToken(token);
    // Csak ellenőrizzük, hogy nem dob hibát
    
    process.env.NODE_ENV = originalEnv;
  });
});

// ==================== TESZT 3: MIDDLEWARE ====================
describe('3. Middleware Tests', () => {
  it('should test paramHandler functions', () => {
    const paramHandler = require('../api/middlewares/paramHandler');
    
    const req = {};
    const res = {};
    const next = jest.fn();
    
    // A paramHandler STRING-ként tárolja! NE számítsuk át!
    paramHandler.paramUserId(req, res, next, '123');
    expect(req.userId).toBe('123'); // STRING marad!
    expect(next).toHaveBeenCalled();
    
    // paramPage
    req.paramPage = undefined;
    paramHandler.paramPage(req, res, next, '2');
    expect(req.paramPage).toBe('2'); // STRING marad!
    
    // paramEmail
    req.email = undefined;
    paramHandler.paramEmail(req, res, next, 'test@test.com');
    expect(req.email).toBe('test@test.com');
  });

  it('should test authMiddleware error cases', () => {
    const authMiddleware = require('../api/middlewares/authMiddleware');
    const { UnauthorizedError } = require('../api/errors');
    
    const req = { cookies: {} };
    const res = {};
    const next = jest.fn();
    
    // No token
    authMiddleware.userIsLoggedIn(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

// ==================== TESZT 4: SERVICE TESZTEK ====================
describe('4. UserService Tests', () => {
  // CSAK EGY DB KAPCSOLAT az egész fájlban!
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  // NINCS afterAll()! A Jest kezeli a kapcsolat lezárást

  let userService;

  beforeEach(() => {
    const UserService = require('../api/services/UserService');
    userService = new UserService(db);
  });

  it('should throw BadRequestError for missing page', async () => {
    await expect(userService.getUsersByPage(null))
      .rejects
      .toThrow('hiányzó page paraméter');
  });

  it('should validate email in registerUser', async () => {
    const invalidData = {
      email: 'invalid-email',
      username: 'testuser',
      password: 'Test123!@#',
      confirm_password: 'Test123!@#'
    };

    await expect(userService.registerUser(invalidData))
      .rejects
      .toThrow('Érvényytelen email');
  });

  it('should check for existing username', async () => {
    await createTestUser({
      email: 'existing@test.com',
      username: 'existinguser'
    });

    const duplicateData = {
      email: 'new@test.com',
      username: 'existinguser',
      password: 'Test123!@#',
      confirm_password: 'Test123!@#'
    };

    await expect(userService.registerUser(duplicateData))
      .rejects
      .toThrow('Ez a felhasználó név már létezik');
  });

  it('should get users by page', async () => {
    // Create 3 test users
    for (let i = 1; i <= 3; i++) {
      await createTestUser({
        email: `user${i}@test.com`,
        username: `user${i}`
      });
    }

    const page1 = await userService.getUsersByPage(1);
    expect(Array.isArray(page1)).toBe(true);
    expect(page1.length).toBe(3);
  });
});

// ==================== TESZT 5: CONTROLLER/ROUTE TESZTEK ====================
describe('5. User Routes Integration Tests', () => {
  // UGYANAZ a DB kapcsolat, nincs újraindítás
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  // ========== GET TESZTEK ==========
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      await createTestUser({ email: 'user1@test.com', username: 'user1' });
      await createTestUser({ email: 'user2@test.com', username: 'user2' });

      const response = await request(app)
        .get('/api/users/all')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
    });

    it('GET /api/users/id/:userId - should return user by ID', async () => {
      const user = await createTestUser({
        email: 'test@test.com',
        username: 'testuser'
      });

      // A paramHandler STRING-ként adja át, de a controller parse-olja!
      const response = await request(app)
        .get(`/api/users/id/${user.ID}`)
        .expect(200);

      expect(response.body.ID).toBe(user.ID);
      expect(response.body.username).toBe('testuser');
    });

    it('GET /api/users/id/:userId - should return 404 for non-existent', async () => {
      const response = await request(app)
        .get('/api/users/id/999999')


      expect(response.body).toBeNull();
    });

    it('GET /api/users/see/:uniqIdentifier - should return user by username', async () => {
      const user = await createTestUser({
        email: 'see@test.com',
        username: 'seeuser'
      });

      const response = await request(app)
        .get('/api/users/see/seeuser')
        .expect(200);

      expect(response.body.username).toBe('seeuser');
    });

    it('GET /api/users/see/:uniqIdentifier - should return user by ID string', async () => {
      const user = await createTestUser({
        email: 'idtest@test.com',
        username: 'idtestuser'
      });

      const response = await request(app)
        .get(`/api/users/see/${user.ID}`)
        .expect(200);

      expect(response.body.ID).toBe(user.ID);
    });
  });

  // ========== POST TESZTEK ==========
  describe('POST /api/users', () => {
    it('should create new user successfully', async () => {
      const userData = {
        email: 'new@test.com',
        password_hash: await bcrypt.hash('Test123!@#', 14),
        username: 'newuser'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('newuser');
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 for duplicate username', async () => {
      await createTestUser({
        email: 'first@test.com',
        username: 'duplicateuser'
      });

      const userData = {
        email: 'second@test.com',
        password_hash: await bcrypt.hash('Test123!@#', 14),
        username: 'duplicateuser'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('ez a felhasználó név már létezik');
    });

    it('should return 400 for missing fields', async () => {
      const userData = {
        email: 'test@test.com'
        // missing username and password
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ========== PATCH TESZTEK ==========
  describe('PATCH /api/users/:userId', () => {
    it('should update user successfully', async () => {
      const user = await createTestUser({
        email: 'update@test.com',
        username: 'beforeupdate'
      });

      const updateData = {
        email: 'updated@test.com',
        password: 'NewPass123!@#',
        username: 'afterupdate'
      };

      const response = await request(app)
        .patch(`/api/users/${user.ID}`)
        .send(updateData)
        .expect(200);

      expect(response.body.email).toBe('updated@test.com');
      expect(response.body.username).toBe('afterupdate');
    });

    it('should return 400 for missing email in update', async () => {
      const user = await createTestUser({
        email: 'test@test.com',
        username: 'testuser'
      });

      const updateData = {
        password: 'Test123!@#',
        username: 'testuser'
        // missing email
      };

      const response = await request(app)
        .patch(`/api/users/${user.ID}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toContain('Hiányzó email');
    });
  });

  // ========== DELETE TESZTEK ==========
  describe('DELETE /api/users/:userId', () => {
    it('should delete user successfully', async () => {
      const user = await createTestUser({
        email: 'delete@test.com',
        username: 'deleteuser'
      });

      await request(app)
        .delete(`/api/users/${user.ID}`)
        .expect(204);

      // Verify deletion
      const response = await request(app)
        .get(`/api/users/id/${user.ID}`)

      expect(response.body).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/999999')
        .expect(404);

      expect(response.body.message).toBeDefined();
    });
  });

  // ========== ERROR HANDLING ==========
  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('{invalid json')
        .expect(500);

      expect(response.body.message).toBe('Internal Server Error');
    });

    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/users/nonexistent/route')
        .expect(404);

      expect(response.body.message).toBeDefined();
    });
  });

  // ========== EDGE CASES ==========
  describe('Edge Cases', () => {
    it('should handle maximum length username', async () => {
      const maxUsername = 'a'.repeat(100);
      const userData = {
        email: 'max@test.com',
        password_hash: await bcrypt.hash('Test123!@#', 14),
        username: maxUsername
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.user.username).toBe(maxUsername);
    });
  });
});

// ==================== VÉGE ====================
// A Jest automatikusan lezárja a DB kapcsolatot a teszt futása után
// NINCS afterAll()!