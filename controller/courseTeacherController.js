const Course = require("../models/Course");
const User = require("../models/User");
const TeacherCourse = require("../models/TeacherCourse");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");

class courseTeacherController {
    async uploadNewCourse(req, res) {
        try {
            // const fileVideo = req.files.file.name;
            const photo = req.files.file[0].name;
            const fileVideo = req.files.file[1].name;

            // const lesson = req.body.lesson;

            const {
                profession,
                author,
                price,
                smallDescription,
                fullDescription,
                lesson
            } = req.body;

            console.log(lesson);
            const dbFile = new TeacherCourse({
                user: req.user.id,
                photo,
                profession,
                author,
                price,
                smallDescription,
                fullDescription,
                content: [{ fileVideo, lesson: lesson }],
            });

            await dbFile.save();
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Upload teacher course error" });
        }
    }

    async uploadContentCourse(req, res) {
        try {
            const file = req.files.file.name;
            const fileMv = req.files.file;
            console.log(fileMv);
            const lesson = req.body.lesson;

            const parentFile = await TeacherCourse.findOne({
                _id: "5fbe72335cb9481b761e8adf",
            });

            parentFile.content.push({ file, lesson });
            parentFile.save();

            const Path = path.join(__dirname, `../static/videos`);
            fileMv.mv(Path + "/" + file);
        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ message: "Upload content course error" });
        }
    }
    async getTeacherCourses(req, res) {
        try {
            const parentFile = await TeacherCourse.findOne({
                _id: "5fbe72335cb9481b761e8adf",
            });

            await res.json(parentFile);
        } catch (e) {
            return res.status(500).json({ message: "Get course error" });
        }
    }
}

module.exports = new courseTeacherController();
