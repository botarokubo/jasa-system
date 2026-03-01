const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// When user register, waiting for approval (PENDING -> JVCNUMBER)
router.post("/register", async (req, res) => {
    try {
        const { name, email, pasword, phonenumber } = req.body;
        if (!name || !email || !pasword || !phonenumber) {
            return res.status(400).json({ message: "name, email, password and phone number required"});
    }

    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ message: "Email already exist"});

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash,
        ststus : "PENDING",
        band : "MEMBER",
        jvcNumber : null,
    });

    res.status(201).json({
        message : "Registered Successfully. Please wait for approval.",
        userId : user_id,
        status : user.status,
    });
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;