const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const courseController = require("../controller/courseController");

router.post("/upload", authMiddleWare, courseController.uploadCourse);
router.get("", authMiddleWare, courseController.getCourses);
router.delete("/", authMiddleWare, courseController.deleteCourse);
router.post("/avatar", authMiddleWare, courseController.uploadAvatar);

module.exports = router;