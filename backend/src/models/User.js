const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        phonenumber: { type: String, required: true, unique: true, trim: true},

        status: { type: String, enum: ["PENDING", "ACTIVE", "INACTIVE"], default: "PENDING" },
        band: { type: String, enum: ["MAINBOARD", "SUBCOM", "MEMBER"], default: "MEMBER" },

        jvcnumber: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
