const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");

class FileController {
    async uploadFile(req, res) {
        try {
            const file = req.files;
            console.log(file);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Upload error" });
        }
    }
}

module.exports = new FileController();
