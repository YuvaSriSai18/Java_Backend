const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true }, // YYYY-MM-DD format
    time: { type: String, required: true }, // HH:mm format
    createdBy: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["ALL", "UPCOMING", "COMPLETED", "ONGOING"],
      default: "UPCOMING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
