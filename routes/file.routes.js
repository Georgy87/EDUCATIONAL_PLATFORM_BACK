const Router = require("express");
const router = new Router();
const authMiddleWare = require("../middleware/auth.middleware");
const fileController = require("../controller/fileController");

router.post("/upload", authMiddleWare, fileController.uploadFile);
router.get("", authMiddleWare, fileController.getFiles);

router.post("/direction", authMiddleWare, fileController.uploadFileDirection);
router.get("/get", authMiddleWare, fileController.getFilesDirection);

router.get("/search", authMiddleWare, fileController.filterByDirection);
module.exports = router;
