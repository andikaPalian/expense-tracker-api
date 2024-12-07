const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        };
        const userAvailable = await User.findOne({email});
        if (userAvailable) {
            return res.status(400).json({message: "User already exists"});
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Hashed Password : ${hashedPassword}`);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        console.log(`user created : ${user}`);
        if (user) {
            return res.status(201).json({message: "User created successfully", user});
        } else {
            return res.status(400).json({message: "Data is not valid"});
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    };
};

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        };
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            const acccessToken = jwt.sign({
                id: user._id,
            }, process.env.ACCESS_TOKEN, {expiresIn: "1d"});
            user.password = undefined;
            return res.status(200).json({message: "User logged in successfully", user, acccessToken});
        } else {
            return res.status(401).json({message: "Email or Password is not valid"});
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error", error});
    };
};

module.exports = {registerUser, loginUser};