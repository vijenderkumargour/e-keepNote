const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchUser");

const JWT_SECRET = "vaidikkumar";

//Route 1: Create a User using: Post "/api/auth/createUser" . Doesn't require Auth
router.post('/createUser', [
    body('name', "Enter the valid name").isLength({ min: 3 }),
    body('email', "Enter the valid email").isEmail(),
    body('password', "Password must be atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {

        //check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        }
        var authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internel server Error");
    }
});


//Route 2: Authenticate a User using : POST "/api/auth/login". No login required
router.post('/login', [
    body('email', "Enter the valid  email").isEmail(),
    body('password', "Please enter  the password").exists()
],
    async (req, res) => {
        let success = false;
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ error: "Please try to login with correct credentials email" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials password" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authtoken });

        } catch (error) {
            console.log('code nahi chal raha hai');
            console.log(error.message);
            res.status(500).send("Internal server error");
        }

    });




//ROUTE 3: Get loggedin User Details using: POST "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;