const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Session = require("../models/Session");
const { generateAuthToken } = require("../utils/jwtHelper");

let adminToken, userId, sessionId;

beforeAll(async () => {
    await User.deleteMany({}); // Ensure a clean database
    await Session.deleteMany({});

    adminToken = generateAuthToken({ id: "admin123", role: "admin" });

    const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password123",
        role: "user",
    });

    await user.save(); // Ensure user is fully saved
    userId = user._id;

    console.log("Test User Created with ID:", userId); // Debugging

    await new Promise(resolve => setTimeout(resolve, 1000)); // Ensure DB write is committed

    const session = await Session.create({
        mentorId: new mongoose.Types.ObjectId(),
        menteeId: userId,
        questions: "How can I improve my skills?",
        status: "pending",
        review: "Great session!",
    });

    sessionId = session._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Admin Routes", () => {
    it("should promote a user to mentor", async () => {
        // Check if user exists before promotion
        const user = await User.findById(userId);
        console.log("🔍 Checking User Before Promotion:", user); // Debugging

        expect(user).not.toBeNull(); // Ensure user exists before testing

        console.log("🚀 Testing Promotion for User ID:", userId);
            const res = await request(app)
    .patch(`/api/v1/admin/users/${userId.toString()}/promote`) // Ensure ObjectId is a string
    .set("Authorization", `Bearer ${adminToken}`);


        console.log("Promote User Response:", res.body); // Debugging

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "User promoted to mentor");
        expect(res.body.data.role).toBe("mentor");
    });

    it("should return error when deleting a non-existent review", async () => {
        const fakeSessionId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/v1/admin/sessions/${fakeSessionId}/review`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Session not found");
    });
});
