const User = require("../models/User");
const TeacherCourse = require("../models/TeacherCourse");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const mailer = require('../mailer/nodemailer');

class UserController {
    async registration(req, res) {
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
                competence: "",
                shoppingCart: [],
                purchasedCourses: [],
            });

            user.confirm_hash = await bcrypt.hash(new Date().toString(), 8);

            return user.save()
                .then((data) => {
                    const message = {
                        from: "admin@test.com",
                        to: email,
                        subject: "Подтверждение почты от Platform",
                        html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:3000/verify?hash=${data.confirm_hash}">по этой ссылке</a>`,
                    };
                    return mailer(message);
                }).catch((err) => {
                    res.send({ message: err });
                });

        } catch (e) {
            console.log(e);
            res.send({ message: "Server error" });
        }
    }

    async verify(req, res) {
        const hash = req.query.hash;

        if (!hash) {
            res.status(422).json({ errors: 'Invalid hash!' });
        } else {
            await User.findOne({ confirm_hash: hash}, (err, user) => {
                if (err || !user) {
                    res.status(404).json({
                        status: 'error',
                        message: 'Hash not found'
                    });
                }

                user.confirmed = true;
                user.save((err) => {
                    if (err) {
                        return res.status(404).json({
                            status: "error",
                            message: err,
                        });
                    }

                    res.json({
                        status: "success",
                        message: "Аккаунт успешно подтвержден!",
                    });
                });
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPassValid = bcrypt.compareSync(password, user.password);

            const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
                expiresIn: "1h",
            });

            if (isPassValid) {
                return res.json({
                    status: 'success',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        surname: user.surname,
                        avatar: user.avatar,
                        teacher: user.teacher,
                        competence: user.competence,
                        shoppingCart: user.shoppingCart,
                        purchasedCourses: user.purchasedCourses,
                    },
                });
            } else {
                return res.json({
                    status: "error",
                    message: "Incorrect password or email",
                });
            }
        } catch (e) {
            console.log(e);
            res.send({ message: "Server error" });
        }
    }

    async auth(req, res) {
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
                    competence: user.competence,
                    shoppingCart: user.shoppingCart,
                    purchasedCourses: user.purchasedCourses,
                },
            });
        } catch (e) {
            console.log(e);
            res.send({ message: "Server error" });
        }
    }

    async update(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id });

            const { name, surname, professionalСompetence } = req.body;
            user.name = name;
            user.surname = surname;
            user.competence = professionalСompetence;

            user.save();

            await TeacherCourse.updateMany(
                { user: req.user.id },
                { $set: { author: name + " " + surname } }
            );
            // await TeacherCourse.updateMany({ user: req.user.id }, { $set: { professionalСompetence: user.сompetence}});
        } catch (e) {
            console.log(e);
            res.send({ message: "User change info error" });
        }
    }

    async shoppingCart(req, res) {
        try {
            const shoppingCart = req.query.shoppingCartId;
            const user = await User.findOne({ _id: req.user.id });
            user.shoppingCart = Array.from(
                new Set(user.shoppingCart.concat(shoppingCart))
            );
            user.save();
        } catch (error) {
            res.send({ message: "User shopping cart error" });
        }
    }

    async purchasedCourses(req, res) {
        try {
            const purchasedCoursesIds = req.body.ids;
            const user = await User.findOne({ _id: req.user.id });
            user.purchasedCourses = Array.from(
                new Set(user.purchasedCourses.concat(purchasedCoursesIds))
            );
            user.save();
        } catch (error) {
            res.send({ message: "User set purchased courses error" });
        }
    }
}

module.exports = new UserController();

