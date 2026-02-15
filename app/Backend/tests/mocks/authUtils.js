// tests/mocks/authUtils.js
module.exports = {
  isValidEmail: jest.fn().mockReturnValue(true),
  isValidUsername: jest.fn().mockReturnValue(true),
  isValidPassword: jest.fn().mockReturnValue(true),
  generateUserToken: jest.fn().mockReturnValue("mock_jwt_token"),
  verifyToken: jest.fn().mockImplementation((token) => {
    if (token === "invalid_token") return null;
    return { username: "testuser", userId: 1 };
  })
};