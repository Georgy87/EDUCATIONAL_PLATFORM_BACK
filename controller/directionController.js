const File = require("../models/Course");
const Direction = require("../models/Direction");
const path = require("path");
const fs = require("fs");
const Uuid = require("uuid");

class directionController {
    async uploadDirection(req, res) {
        try {
            const { direction } = req.body;

            const file = req.files.file;

            const Path = path.join(__dirname, `../static/directions`);
            file.mv(Path + "/" + file.name);

            let files = await Direction.find({ user: req.user.id });

            const repeateFilter = files.filter((files) => {
                return files.name === file.name;
            });

            if (repeateFilter.length === 0) {
                const dbDirection = new Direction({
                    name: file.name,
                    user: req.user.id,
                    direction: direction,
                });
                await dbDirection.save();
                await res.json(dbDirection);
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Upload error" });
        }
    }

    async getDirection(req, res) {
        try {
            let files = await Direction.find({ user: req.user.id });

            await res.json(files);
        } catch (e) {
            console.log(e);
        }
    }

    async filterByDirection(req, res) {
        try {
            let files = await File.find();

            const directionName = req.query.search;
            console.log(directionName)
            files = files.filter(file => file.profession.includes(directionName));
            console.log(files)
            await res.json(files);
        } catch (e) {
            console.log(e);
        }
    }


}

module.exports = new directionController();