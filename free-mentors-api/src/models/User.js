/*
SERGE MUNEZA
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    bio: String,
    occupation: String,
    expertise: String,
    role: { type: String, default: "user", enum: ["user", "admin", "mentor"] }, // Add role field
},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
