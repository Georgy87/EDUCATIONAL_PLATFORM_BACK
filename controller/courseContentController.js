const Course = require("../models/Course");
const User = require("../models/User");
const TeacherCourse = require("../models/TeacherCourse");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");
var mongoose = require("mongoose");

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

            await res.json(parentFile);
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Get content courses error" });
        }
    }

    async deleteLesson(req, res) {
        try {
            const videoName = req.query.name;

            const parentFile = await TeacherCourse.findOne({
                user: req.user.id,
            });
            const filter = parentFile.content.filter(
                (el) => el._id.toString() !== req.query.id
            );
            parentFile.content = filter;
            const Path = path.join(__dirname, `../static/videos/${videoName}`);
            fs.unlinkSync(Path);
            parentFile.save();
            await res.json(parentFile);
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Delete content courses error" });
        }
    }

    async lessonTitleRevision(req, res) {
        try {
            const lessonTitle = req.body.newTitle;
            const lessonId = req.query.id;
            const parentFile = await TeacherCourse.findOne({
                user: req.user.id,
            });
            parentFile.content.map((element) => {
                if (element._id.toString() === lessonId) {
                    element.lesson = lessonTitle;
                    parentFile.save();
                }
            });
            await res.json(parentFile);
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Lesson title revision error" });
        }
    }

    async sendLinksToResources(req, res) {
        try {
            const { link, lessonId, linkName } = req.body;

            const courseId = req.query.id;
            const course = await TeacherCourse.findOne({
                _id: courseId,
            });

            course.content.map((element) => {
                if (element._id.toString() === lessonId) {
                    element.linksToResources = [...element.linksToResources, { linkName, link }];
                    course.save();
                }
            });

            await res.json(course);
        } catch (e) {
            return res.status(500).json({ message: "Send links error" });
        }
    }
}

module.exports = new courseContentController();
