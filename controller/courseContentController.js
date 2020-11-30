const Course = require("../models/Course");
const User = require("../models/User");
const TeacherCourse = require("../models/TeacherCourse");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");

class courseContentController {
    async uploadContentCourse(req, res) {
        try {
            const parentFile = await TeacherCourse.findOne({
                user: req.user.id,
            });

            const module = req.body.module;
            const Path = path.join(__dirname, `../static/videos`);

            if (req.files != null) {
                const fileVideo = req.files.file.name;
                const fileMv = req.files.file;
                const lesson = req.body.lesson;

                parentFile.content.push({ module: module, fileVideo, lesson });
                parentFile.save();
                fileMv.mv(Path + "/" + fileMv.name);
            }
            await res.json(parentFile);

        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ message: "Upload content course error" });
        }
    }

    async getContentCourses(req, res) {
        try {
            const parentFile = await TeacherCourse.findOne({
                user: req.user.id,
            });
            // console.log(parentFile);
            await res.json(parentFile);
        } catch (e) {
            return res.status(500).json({ message: "Get course error" });
        }
    }
}

module.exports = new courseContentController();
