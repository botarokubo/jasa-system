const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //generate token for login
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
        status : "PENDING",
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

// For login route
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email){
            return res.status(400).json({message: "Email Required"});
        }else if (!password){
            return res.status(400).json({message: "Password Required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid Email or Password"});
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if(!passwordMatch){
            return res.status(401).json({message: "Invalid email or Password"});
        }

        if (user.status !== "APPROVED"){
            return res.status(403).json({message: "Invalid email or Password"});
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                band: user.band,
                jvcNumber: user.jvcNumber,
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
            );

        return res.status(200).json({
            message: "Login Successful",
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                status: user.status,
                band: user.band,
                jvcNumber: user.jvcNumber,
            },
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
});
module.exports = router;