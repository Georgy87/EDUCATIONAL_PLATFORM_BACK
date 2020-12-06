const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const courseContentController  = require("../controller/courseContentController");

router.post("/content", authMiddleWare, courseContentController.uploadContentCourse);
router.get("", authMiddleWare, courseContentController.getContentCourses);
router.post("/lesson-upload", authMiddleWare, courseContentController.uploadLesson);
router.delete("/lesson", authMiddleWare, courseContentController.deleteLesson);
router.post("/lesson", authMiddleWare, courseContentController.lessonTitleRevision);
router.post("/link", authMiddleWare, courseContentController.sendLinksToResources);

module.exports = router;
