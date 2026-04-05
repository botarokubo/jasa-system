const router = require("express").Router();
const User = require("../models/User");
const { allocateJvcNumber } = require("../utils/jvc");

// View all pending users
router.get("/pending-users", async (req, res) => {
  try {
    const users = await User.find({ status: "PENDING" }).select("-passwordHash");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Approve user (Generate JVC number)
router.post("/approve-user", async (req, res) => {
  try {
    const { userId, band } = req.body;

    if (!userId || !band) {
      return res.status(400).json({ message: "userId and band required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status !== "PENDING") {
      return res.status(400).json({ message: "User is not pending" });
    }

    const jvcNumber = await allocateJvcNumber(band);

    user.status = "ACTIVE";
    user.band = band;
    user.jvcnumber = jvcNumber;
    await user.save();

    return res.json({ message: "Approved", userId: user._id, jvcNumber, band: user.band });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
        .select("name email status band jvcnumber createdAt")
        .sort({ createdAt: -1 });

    res.json(users);
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

module.exports = router;