const File = require("../models/File");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");

class FileController {
    async uploadFile(req, res) {
        try {
            const file = req.files.file;
            const Path = path.join(__dirname, "../files");
            file.mv(Path + "/" + file.name);

            let files = await File.find({ user: req.user.id });

            const repeateFilter = files.filter((files) => {
                return files.name === file.name;
            });

            if(repeateFilter.length === 0) {
                const dbFile = new File({
                    name: file.name,
                    user: req.user.id,
                });
                await dbFile.save();
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Upload error" });
        }
    }
}

module.exports = new FileController();
