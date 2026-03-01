const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// When user register, waiting for approval (PENDING -> JVCNUMBER)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        if (!name) {
            return res.status(400).json({ message: "name, email, password and phone number required"});
    }   else if (!email){
            return res.status(400).json({message : "email required"})
    }    else if (!password){
            return res.status(400).json({message : "password required"})
    }   else if (!phoneNumber){
            return res.status(400).json({message : "phone no required"})
    }

    const exists = await User.findOne({ email });
    if(exists) return res.status(409).json({ message: "Email already exist"});

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        passwordHash,
        phoneNumber,
        ststus : "PENDING",
        band : "MEMBER",
        jvcNumber : null,
    });

    res.status(201).json({
        message : "Registered Successfully. Please wait for approval.",
        userId : user._id,
        status : user.status,
    });
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;