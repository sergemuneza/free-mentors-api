const request = require("supertest");
const app = require("../../src/server");
const { generateAuthToken } = require("../../src/utils/jwtHelper");
const User = require("../../src/models/User");

describe("Mentor Routes", () => {
  let mentorId, token;

  beforeAll(async () => {
    await User.deleteMany({}); 
    // Create a mentor user
    const mentor = await User.create({
      firstName: "Alice",
      lastName: "Johnson",
      email: "mentor@example.com",
      password: "securePass",
      role: "mentor",
    });
    mentorId = mentor._id;

    // Generate a token for authentication
    token = generateAuthToken({ id: "user123", role: "user" });
  });

  it("should get all mentors", async () => {
    const res = await request(app)
      .get("/api/v1/mentors")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get a specific mentor by ID", async () => {
    const res = await request(app)
      .get(`/api/v1/mentors/${mentorId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.firstName).toBe("Alice");
  });

  it("should return error for invalid mentor ID", async () => {
    const res = await request(app)
      .get(`/api/v1/mentors/invalidID`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid mentor ID format");
  });
});
