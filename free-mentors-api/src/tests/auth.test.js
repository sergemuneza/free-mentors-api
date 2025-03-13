const request = require("supertest");
const app = require("../../src/server");
const User = require("../../src/models/User");

describe("User Authentication", () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clear users before running each test
  });

  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "password123",
      address: "NY",
      bio: "Developer",
      occupation: "Software Engineer",
      expertise: "Node.js"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not allow duplicate emails", async () => {
    // First signup
    await request(app).post("/api/v1/auth/signup").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "test@example.com",
      password: "password123"
    });

    // Second signup attempt with same email
    const res = await request(app).post("/api/v1/auth/signup").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "test@example.com",
      password: "password123"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email already exists");
  });
});
