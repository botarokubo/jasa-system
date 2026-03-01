const router = require("express").Router();
const User = require("../models/User");
const { allocateJvcNumber } = require("../utils/jvc");

// View all pending users
router.get("/pending.users", async (req, res) => {
    try {
        const users = await User.find({ status: "PENDING" }).select("-passwordHash");
        res.json(users);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});

// Approve user (Generate JVCnumber)
router.post("/approve-user", async (req, res) => {
    try {
        const { UserId, band } = req.body;
        if (!userID || !band) return res.status(400).json({ message: "userID and band required" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({message: "User not found" });
        if (user.status !== "PENDING") return res.status(400). json ({ message: "User is not pending"});

        const jvcNumber = await allocateJvcNumber(band);

        user.status = "APPROVED";
        user.band = band;
        user.jvcNumber = jvcNumber;
        await user.save();

        res.json({ message: "Approved", userID: userId, jvcNumber });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;