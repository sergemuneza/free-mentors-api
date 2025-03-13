const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Session = require("../models/Session");
const { generateAuthToken } = require("../utils/jwtHelper");

let menteeToken, menteeId, mentorId, sessionId;

beforeAll(async () => {
    await User.deleteMany({});
    await Session.deleteMany({});

    const mentee = await User.create({
        firstName: "Alice",
        lastName: "Mentee",
        email: "mentee@example.com",
        password: "password123",
        role: "user",
    });

    const mentor = await User.create({
        firstName: "Bob",
        lastName: "Mentor",
        email: "mentor1@example.com",
        password: "password123",
        role: "mentor",
    });

    menteeId = mentee._id;
    mentorId = mentor._id;

    // Generate mentee token with correct ID
    menteeToken = generateAuthToken({ id: menteeId, role: "user" });

    console.log("Test Users Created:", { menteeId, mentorId });

    const session = await Session.create({
        mentorId,
        menteeId,
        questions: "How can I improve my skills?",
        status: "pending",
    });

    sessionId = session._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Mentorship Sessions", () => {
    it("should allow a mentee to request a session", async () => {
        console.log("🚀 Mentee ID for Session Request:", menteeId);
        console.log("🔍 Mentee Token:", menteeToken); // Add this here for debugging

        const res = await request(app)
            .post("/api/v1/sessions")
            .set("Authorization", `Bearer ${menteeToken}`) // Ensure correct token is used
            .send({
                mentorId,
                questions: "How do I get better at coding?"
            });

        console.log("Create Session Response:", res.body); // Debugging

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("_id");
    });
});
