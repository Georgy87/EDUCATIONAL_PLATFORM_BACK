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
            const fileVideo = req.files.file[0].name;
            const photo = req.files.file[1].name;

            const videoMv = req.files.file[0];
            const photoMv = req.files.file[1];

            // const photoAdd = req.files.file.name;

            const pathVideos = path.join(__dirname, `../static/videos`);
            videoMv.mv(pathVideos+ "/" +  videoMv.name);

            const pathPhotos = path.join(__dirname, `../static/coursePhotos`);
            photoMv.mv(pathPhotos + "/" +  photoMv.name);

            const {
                profession,
                author,
                price,
                smallDescription,
                fullDescription,
                lesson,
                module
            } = req.body;

            const dbFile = new TeacherCourse({
                user: req.user.id,
                photo,
                profession,
                author,
                price,
                smallDescription,
                fullDescription,
                content: [{ module: module, fileVideo, lesson: lesson }],
            });

            // const pathVideo = path.join(__dirname, `../static/videos`);
            // fileMv.mv(pathVideo + "/" + fileVideo);

            await dbFile.save();
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Upload teacher course error" });
        }
    }

    async uploadContentCourse(req, res) {
        try {


            const parentFile = await TeacherCourse.findOne({
                user: req.user.id,
            });




            const module = req.body.module;
            console.log(module);
            const Path = path.join(__dirname, `../static/videos`);
         
            if (req.files != null) {
                const fileVideo = req.files.file.name;
                const fileMv = req.files.file;
                const lesson = req.body.lesson;

                parentFile.content.push({ module: module, fileVideo, lesson });
                parentFile.save();
                fileMv.mv(Path + "/" + fileMv.name);
            }

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
                user: req.user.id,
            });
            await res.json(parentFile);
        } catch (e) {
            return res.status(500).json({ message: "Get course error" });
        }
    }
}

module.exports = new courseTeacherController();
