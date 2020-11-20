const Course = require("../models/Course");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");

class courseController {
    async uploadCourse(req, res) {
        try {
            const {
                profession,
                author,
                price,
                smallDescription,
                fullDescription,
            } = req.body;

            const file = req.files.file;
            const Path = path.join(__dirname, `../static`);
            file.mv(Path + "/" + file.name);
            // console.log(Path + "/" + file.name);
            // let courses = await Course.find({ user: req.user.id });
            let courses = await Course.find();

            const repeateFilter = courses.filter((course) => {
                return course.name === file.name;
            });

            if (repeateFilter.length === 0) {
                const dbFile = new Course({
                    name: file.name,
                    // user: req.user.id,
                    profession: profession,
                    author: author,
                    price: price,
                    smallDescription: smallDescription,
                    fullDescription: fullDescription,
                });
                await dbFile.save();
                await res.json(dbFile);
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Upload error" });
        }
    }

    async getCourses(req, res) {
        try {
            // let courses = await Course.find({ user: req.user.id });
            let courses = await Course.find();
            await res.json(courses);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteCourse(req, res) {
        try {
            const course = await Course.findOne({ _id: req.query.id });
            const Path = path.join(__dirname, `../static/${req.query.name}`);
            fs.unlinkSync(Path);
            await course.remove();
            return res.json({ message: "Coure was delete" });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Delete course error" });
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file;
            const avatarName = Uuid.v4() + ".jpg";

            const Path = path.join(__dirname, `../static/avatars`);

            file.mv(Path + "/" + avatarName);

            const user = await User.findById(req.user.id);
            const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
                expiresIn: "100h",
            });

            user.avatar = avatarName;
            await user.save();

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                },
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Upload avatar error" });
        }
    }
}

module.exports = new courseController();
