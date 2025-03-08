/*
SERGE MUNEZA
*/

const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    review: {
      score: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
      remark: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
