// const Course = require("../models/Course");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");
const TeacherCourse = require("../models/TeacherCourse");

class courseController {
    async uploadNewCourse(req, res) {
        try {
            const fileVideo = req.files.file[0].name;
            const photo = req.files.file[1].name;

            const videoMv = req.files.file[0];
            const photoMv = req.files.file[1];

            const pathVideos = path.join(__dirname, `../static/videos`);
            videoMv.mv(pathVideos + "/" + videoMv.name);

            const pathPhotos = path.join(__dirname, `../static/coursePhotos`);
            photoMv.mv(pathPhotos + "/" + photoMv.name);

            const {
                profession,
                author,
                price,
                smallDescription,
                fullDescription,
                lesson,
                module,
            } = req.body;

            const dbFile = new TeacherCourse({
                user: req.user.id,
                professionalСompetence: "",
                avatar: "",
                photo,
                profession,
                competence: "",
                author,
                price,
                smallDescription,
                fullDescription,
                content: [
                    {
                        module: module,
                        moduleHours: 0,
                        moduleMinutes: 0,
                        moduleSeconds: 0,
                        moduleContent: [
                            {
                                fileVideo: fileVideo,
                                lesson: lesson,
                                lessonTime: "",
                            },
                        ],
                    },
                ],
            });

            await dbFile.save();
        } catch (e) {
            return res
                .status(500)
                .json({ message: "Upload teacher course error" });
        }
    }

    async getCourses(req, res) {
        try {
            let courses = await TeacherCourse.find();

            // const user = await User.findById(req.user.id);
            // console.log(user);
            // let ids = ["5fca4f887c15e40d698c5cf2", "5fd6705f90a0d502f02288ab", "5fd76416b84a780acc4c86d6"];
            // let data = await TeacherCourse.find({ _id: { $in: ids } });
            // console.log(data);

            await res.json({
                courses,
            });
        } catch (e) {
            console.log(e);
        }
    }

    async deleteCourse(req, res) {
        try {
            const course = await TeacherCourse.findOne({ _id: req.query.id });
            const Path = path.join(
                __dirname,
                `../static/coursePhotos/${req.query.name}`
            );
            fs.unlinkSync(Path);
            await course.remove();
            return res.json({ message: "Coure was delete" });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Delete course error" });
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
            return res.status(500).json({ message: "Upload avatar error" });
        }
    }

    async getProfileCourse(req, res) {
        try {
            const id = req.query.id;

            let courses = await TeacherCourse.find();

            const courseProfile = courses.filter((course) => course._id == id);
            const userId = courseProfile[0].user;

            const user = await User.findOne({ _id: userId });

            courseProfile[0].competence = user.competence;

            // const course = await TeacherCourse.findOne({ user: userId });
            // console.log(courseProfile[0].competence)
            // course.save();

            await TeacherCourse.updateMany(
                { user: userId },
                { $set: { competence: user.competence, avatar: user.avatar } }
            );

            await res.json(courseProfile[0]);
        } catch (e) {
            console.log(e);
        }
    }

    async getTeacherProfile(req, res) {
        try {
            const teacherId = req.query.teacherId;
            const user = await User.findOne({ _id: teacherId });
            const allTeacherCourses = await TeacherCourse.find({ user: { $in: teacherId } });

            await res.json({
                avatar: user.avatar,
                email: user.email,
                id: user.id,
                name: user.name,
                surname: user.surname,
                competence: user.competence,
                courses:  allTeacherCourses
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Get teacher profile error" });
        }
    }
}

module.exports = new courseController();

// async uploadCourse(req, res) {
//     try {
//         const {
//             profession,
//             author,
//             price,
//             smallDescription,
//             fullDescription,
//         } = req.body;

//         const file = req.files.file;
//         const Path = path.join(__dirname, `../static`);
//         file.mv(Path + "/" + file.name);
//         // console.log(Path + "/" + file.name);
//         // let courses = await Course.find({ user: req.user.id });
//         let courses = await Course.find();

//         const repeateFilter = courses.filter((course) => {
//             return course.name === file.name;
//         });

//         if (repeateFilter.length === 0) {
//             const dbFile = new Course({
//                 name: file.name,
//                 // user: req.user.id,
//                 profession: profession,
//                 author: author,
//                 price: price,
//                 smallDescription: smallDescription,
//                 fullDescription: fullDescription,
//             });
//             await dbFile.save();
//             await res.json(dbFile);
//         }
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({ message: "Upload error" });
//     }
// }
