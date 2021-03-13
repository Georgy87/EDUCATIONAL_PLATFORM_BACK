// const Course = require("../models/Course");
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
            const courseId = req.query.courseId;
            TeacherCourse.findOne({
                _id: courseId,
                user: req.user.id,
            }).exec((err, course) => {
                if (err) {
                    return res.status(400).json({
                        status: "Upload content course error",
                        message: err,
                    });
                }
                if (req.files != null) {
                    const fileVideo = req.files.file.name;
                    const fileMv = req.files.file;
                    const { lesson, module } = req.body;

                    course.content.push({
                        module: module,
                        moduleHours: 0,
                        moduleMinutes: 0,
                        moduleSeconds: 0,
                        moduleContent: [
                            {
                                fileVideo: fileVideo,
                                lesson: lesson,
                                lessonTime: ''
                            },
                        ],
                    });
                    // console.log(course.content.length);
                    const Path = path.join(__dirname, `../static/videos`);
                    fileMv.mv(Path + "/" + fileMv.name);
                    course.save(() => {
                        return res.json(course);
                    });
                }
            });


        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ message: "Upload content course error" });
        }
    }

    async getContentCourses(req, res) {
        try {
            const courseId = req.query.courseId;
            TeacherCourse.findOne({
                _id: courseId,
                user: req.user.id,
            }).exec((err, course) => {
                if (err) {
                    return res.status(404).json({
                        status: "Get content courses error",
                        message: err,
                    });
                }
                return res.json(course);
            });
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Get content courses error" });
        }
    }

    async getAllTeacherCourses(req, res) {
        try {
            const getTeacherCourses = await TeacherCourse.find({
                user: req.user.id
            });

            await res.json(getTeacherCourses);

        } catch (e) {
            return res
                .status(500)
                .json({ message: "Get all teacher courses error" });
        }
    }

    async uploadLesson(req, res) {
        try {
            const { lesson, moduleId } = req.body;
            const courseId = req.query.courseId;
            const fileVideo = req.files.file.name;
            const fileMv = req.files.file;
            TeacherCourse.findOne({
                user: req.user.id,
                _id: courseId
            }).exec((err, course) => {
                if (err) {
                    return res.status(404).json({
                        status: "Upload lesson error",
                        message: err,
                    });
                }
                let val = 0;
                course.content.map((element) => {
                    if (element._id.toString() === moduleId) {
                        element.moduleContent.push({
                            fileVideo,
                            lesson,
                            lessonTime: '',
                            linksToResources: [],
                        });
                    }
                    val += element.moduleContent.length;
                });
                const Path = path.join(__dirname, `../static/videos`);
                fileMv.mv(Path + "/" + fileMv.name);
                course.save();
                return res.json(course);
            });
        } catch (e) {
            return res.status(500).json({ message: "error" });
        }
    }

    async deleteLesson(req, res) {
        try {
            const { moduleId, lessonId, videoName, hours, minutes, seconds } = req.body;
            const courseId = req.query.courseId;
            TeacherCourse.findOne({ user: req.user.id, _id: courseId }).exec((err, course) => {
                if (err) {
                    return res.status(400).json({
                        status: "`Delete lesson error",
                        message: err,
                    });
                }

                course.content.map((element) => {
                    if (element._id.toString() === moduleId) {
                        element.moduleHours -= hours;
                        element.moduleMinutes -= minutes;
                        element.moduleSeconds -= seconds;
                        const filter = element.moduleContent.filter(element => element._id.toString() !== lessonId);
                        element.moduleContent = filter;
                        course.save();
                    }
                });
                const Path = path.join(__dirname, `../static/videos/${videoName}`);
                fs.unlinkSync(Path);
                return res.json(course);
            });
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Delete content courses error" });
        }
    }

    async lessonTitleRevision(req, res) {
        try {
            const { newTitle, lessonId, moduleId } = req.body;
            const courseId = req.query.courseId;
            TeacherCourse.findOne({
                user: req.user.id,
                _id: courseId
            }).exec((err, course) => {
                if (err) {
                    return res.status(400).json({
                        status: "`Delete lesson title revision error",
                        message: err,
                    });
                }
                course.content.map((element) => {
                    if (element._id.toString() === moduleId) {
                        element.moduleContent.map((element) => {
                            if (element._id.toString() === lessonId) {
                                element.lesson = newTitle;
                                course.save();
                            }
                        });
                    }
                });
                return res.json(course);
            });

        } catch (e) {
            return res
                .status(500)
                .json({ message: "Lesson title revision error" });
        }
    }

    async sendLinksToResources(req, res) {
        try {
            const { moduleId, lessonId, linkName, linksToResources } = req.body;

            const courseId = req.query.courseId;
            TeacherCourse.findOne({
                user: req.user.id,
                _id: courseId
            }).exec((err, course) => {
                if (err) {
                    return res.status(400).json({
                        status: "Send links to resources error",
                        message: err,
                    });
                }

                course.content.map((element) => {
                    if (element._id.toString() === moduleId) {
                        element.moduleContent.map((element) => {
                            if (element._id.toString() === lessonId) {
                                element.linksToResources = [
                                    ...element.linksToResources,
                                    { linkName, linksToResources },
                                ];
                                course.save();
                            }
                        });
                    }
                });

                return res.json(course);
            });


        } catch (e) {
            return res.status(500).json({ message: "Send links error" });
        }
    }

    async setTimeModuleAndLessons(req, res) {
        try {
            const { moduleId, lessonId, hours, minutes, seconds } = req.body;

            const courseId = req.query.courseId;
            TeacherCourse.findOne({
                user: req.user.id,
                _id: courseId
            }).exec((err, course) => {
                if (err) {
                    return res.status(400).json({
                        status: "Set time module and lessons",
                        message: err,
                    });
                }
                course.content.map((element) => {
                    if (element._id.toString() === moduleId) {
                        element.moduleHours += hours;
                        element.moduleMinutes += minutes;
                        element.moduleSeconds += seconds;
                        // course.save();
                        element.moduleContent.map((element) => {
                            if (element._id.toString() === lessonId) {
                                element.lessonTime = hours + ":" + minutes + ":" + seconds;
                            }
                        });
                    }
                });
                course.save(err => {
                    res.json(course);
                });
            });
        } catch (e) {
            return res.status(500).json({ message: "Send time error" });
        }
    }
}

module.exports = new courseContentController();
