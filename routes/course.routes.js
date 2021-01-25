const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const courseController = require("../controller/courseController");

// router.post("/upload", authMiddleWare, courseController.uploadCourse);
router.get("", courseController.getCourses);
router.delete("/", authMiddleWare, courseController.deleteCourse);
router.post("/avatar", authMiddleWare, courseController.uploadAvatar);
router.get("/profile", courseController.getProfileCourse);
router.post("/course", authMiddleWare, courseController.uploadNewCourse);
router.get("/teacher-profile", courseController.getTeacherProfile);
router.get("/shopping-cart", authMiddleWare, courseController.getCoursesForShoppingCart);
router.delete("/delete-shopping-cart", authMiddleWare, courseController.deleteCoursesForShoppingCart);
router.get("/purchased-courses", authMiddleWare, courseController.getPurchasedCourses);
router.get("/training-course", authMiddleWare, courseController.getCourseForTraining);
router.post("/comment", authMiddleWare, courseController.createComment);
router.post("/comment/answer", authMiddleWare, courseController.createAnswerComment);
router.get("/comment", courseController.getCommentForCourse);

module.exports = router;