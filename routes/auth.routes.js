const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = new Router();
const { check, validationResult } = require("express-validator");

router.post("/registration", [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:13, max:12})
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrect request", errors});
        }

        const { email, password } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            return res
                .status(400)
                .json({ message: `User with email ${email} alredy exist` });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const user = new User({ email, password: hashPassword });
        await user.save();
        return res.json({ message: "User was created" });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "User not fount"})
        }
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
});

module.exports = router;
