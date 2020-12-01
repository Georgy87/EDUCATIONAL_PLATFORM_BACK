const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const courseContentController  = require("../controller/courseContentController");

router.post("/content", authMiddleWare, courseContentController.uploadContentCourse);
router.get("", authMiddleWare, courseContentController.getContentCourses);
router.delete("/", authMiddleWare, courseContentController.deleteLesson);

module.exports = router;