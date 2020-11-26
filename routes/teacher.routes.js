const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const courseTeacherController = require("../controller/courseTeacherController");

router.post("/course", authMiddleWare, courseTeacherController.uploadNewCourse);

router.post("/content", authMiddleWare, courseTeacherController.uploadContentCourse);
router.get("", authMiddleWare, courseTeacherController.getTeacherCourses);

module.exports = router;