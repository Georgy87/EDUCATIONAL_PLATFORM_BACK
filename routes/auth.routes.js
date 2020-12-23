const Router = require("express");
const User = require("../models/User");
const TeacherCourse = require("../models/TeacherCourse");
const bcrypt = require("bcryptjs");
const router = new Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleWare = require("../middleware/auth.middleware");

router.post("/registration",
    [
        check("email", "Uncorrect email").isEmail(),
        check(
            "password",
            "Password must be longer than 3 and shorter than 12"
        ).isLength({ min: 3, max: 12 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Uncorrect request", errors });
            }

            const { email, password, name, surname, teacher } = req.body;

            const candidate = await User.findOne({ email, name });

            if (candidate) {
                return res
                    .status(400)
                    .json({ message: `User with email ${email} alredy exist` });
            }

            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({
                email: email,
                password: hashPassword,
                name: name,
                surname: surname,
                teacher: teacher,
                competence: ""
            });

            await user.save();
            return res.json({ message: "User was created" });
        } catch (e) {
            console.log(e);
            res.send({ message: "Server error" });
        }
    }
);

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not fount" });
        }
        const isPassValid = bcrypt.compareSync(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
            expiresIn: "1h",
        });
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                avatar: user.avatar,
                teacher: user.teacher,
                competence: user.competence
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
});

router.get("/auth", authMiddleWare, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });

        const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
            expiresIn: "100h",
        });
        
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                avatar: user.avatar,
                teacher: user.teacher,
                competence: user.competence
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
});

router.post("/change-info", authMiddleWare, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });

        const { name, surname, professionalСompetence } = req.body;
        user.name = name;
        user.surname = surname;
        user.competence = professionalСompetence;

        user.save();

        await TeacherCourse.updateMany({ user: req.user.id }, { $set: { author: name + " " + surname}});
        // await TeacherCourse.updateMany({ user: req.user.id }, { $set: { professionalСompetence: user.сompetence}});

    } catch (e) {
        console.log(e);
        res.send({ message: "User change info error" });
    }
});

module.exports = router;
