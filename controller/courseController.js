// const Course = require("../models/Course");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("config");
const TeacherCourse = require("../models/TeacherCourse");
const { populate } = require("../models/User");

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
                comments: [],
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
            // const c = await TeacherCourse.find({"content._id": "5feb4590675e3e305ce140eb"});

            // const query = "5feb4590675e3e305ce140eb";
            // await TeacherCourse.findOne(query, (error, doc) => {

            //     // Do some mutations
            //     doc.content.module = 'some new value'

            //     // Pass in the mutated doc and replace
            //     // MyModel.replaceOne(query, doc, (error, newDoc) => {
            //     //      console.log('It worked!')
            //     // })module

            // })
            // module.save()
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

    // В запросе: courseId, userId, text

    async createComment(req, res) {
        try {

            const { userId, courseId, text } = req.body;

            const course = await TeacherCourse.findOne({_id: courseId}).populate("comments.user").populate("comments.comments.user");
            
            course.comments.push({
                text: text,
                user: userId
            });

            course.save();

            res.json(course.comments)
        } catch (e) {
            console.log(e);
        }
    }

    async createAnswerComment(req, res) {
        try {

            const { userId, courseId, commentId, text } = req.body;

            const course = await TeacherCourse.findOne({_id: courseId}).populate("comments.user").populate("comments.comments.user");

            course.comments.map(el => {
                if (el._id.toString() === commentId) {
                    el.comments.push({
                        text: text,
                        user: userId
                    })
                    course.save();
                }
            });

            res.json(course.comments)
        } catch (e) {
            console.log(e);
        }
    }

    async getTeacherProfile(req, res) {
        try {
            const teacherId = req.query.teacherId;
            const user = await User.findOne({ _id: teacherId });
            const allTeacherCourses = await TeacherCourse.find({
                user: { $in: teacherId },
            });

            await res.json({
                avatar: user.avatar,
                email: user.email,
                id: user.id,
                name: user.name,
                surname: user.surname,
                competence: user.competence,
                courses: allTeacherCourses,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Get teacher profile error" });
        }
    }

    async getCoursesForShoppingCart(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id });
            const ids = user.shoppingCart;

            const courses = await TeacherCourse.find({ _id: { $in: ids } });
            let totalPrice = 0;
            const coursesDestructured = courses.map((element) => {
                totalPrice += Number(element.price);
                return Object.assign(
                    {},
                    {
                        photo: element.photo,
                        author: element.author,
                        price: element.price,
                        smallDescription: element.smallDescription,
                        profession: element.profession,
                        id: element._id,
                    }
                );
            });

            return res.json({
                coursesData: {
                    coursesDestructured,
                    totalPrice,
                },
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Get Course for shopping cart error" });
        }
    }

    async deleteCoursesForShoppingCart(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id });
            const courseId = req.query.id;
            const ids = user.shoppingCart;

            const UserCartShopids = ids.filter((el) => el != courseId);

            user.shoppingCart = UserCartShopids;

            const courses = await TeacherCourse.find({
                _id: { $in: UserCartShopids },
            });

            let totalPrice = 0;

            const coursesDestructured = courses.map((element) => {
                totalPrice += Number(element.price);
                return Object.assign(
                    {},
                    {
                        photo: element.photo,
                        author: element.author,
                        price: element.price,
                        smallDescription: element.smallDescription,
                        profession: element.profession,
                        id: element._id,
                    }
                );
            });

            user.save();

            return res.json({
                coursesData: {
                    coursesDestructured,
                    totalPrice,
                },
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Delete Course for shopping cart error" });
        }
    }

    async getPurchasedCourses(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id });
            const ids = user.purchasedCourses;

            const courses = await TeacherCourse.find({ _id: { $in: ids } });
            const coursesDestructured = courses.map((element) => {
                return Object.assign(
                    {},
                    {
                        photo: element.photo,
                        author: element.author,
                        smallDescription: element.smallDescription,
                        id: element._id,
                    }
                );
            });
            return res.json([...coursesDestructured]);
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Get Course for Purchased Courses error" });
        }
    }

    async getCourseForTraining(req, res) {
        try {
            const course = await TeacherCourse.findOne({ _id: req.query.id });

            res.json({ course });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Get Course for Training error" });
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
