const Course = require("../models/Course");
const User = require("../models/User");
const TeacherCourse = require("../models/TeacherCourse");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");

class courseTeacherController {
    async uploadTeacherCourse(req, res) {
        try {
            const file = req.files.file.name;
            const lesson = req.body.lesson;

            const dbFile = new TeacherCourse({
                user: req.user.id,
                content: [{ file, lesson }],
            });

            await dbFile.save();
        } catch (e) {
            return res.status(500).json({ message: "Upload teacher course error" });
        }
    }

    async uploadContentCourse(req, res) {
        try {

            const file = req.files.file.name;
            const lesson = req.body.lesson;

            const parentFile = await TeacherCourse.findOne({
                _id: "5fbbf096f7e465626d565545",
            });

            parentFile.content.push({ file, lesson });
            parentFile.save();

            const Path = path.join(__dirname, `../static/videos`);
            file.mv(Path + "/" + file.name);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Upload content course error" });
        }
    }
    async getTeacherCourses(req, res) {
        try {

            const parentFile = await TeacherCourse.findOne({
                _id: "5fbbf096f7e465626d565545",
            });
            
            await res.json(parentFile);
        } catch (e) {
            return res.status(500).json({ message: "Get course error" });
        }
    }
}

module.exports = new courseTeacherController();
