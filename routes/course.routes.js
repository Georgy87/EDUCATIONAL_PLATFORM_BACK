const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const fileController = require("../controller/fileController");

router.post("/upload", authMiddleWare, fileController.uploadCourse);
router.get("", authMiddleWare, fileController.getCourses);

module.exports = router;