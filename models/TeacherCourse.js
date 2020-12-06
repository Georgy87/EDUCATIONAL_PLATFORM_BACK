const { Schema, model, ObjectId } = require("mongoose");
const TeacherCourse = new Schema({
    user: { type: ObjectId, ref: "User" },
    photo: { type: String },
    profession: { type: String },
    author: { type: String },
    price: { type: String },
    smallDescription: { type: String },
    fullDescription: { type: String },
    user: { type: ObjectId, ref: "User" },
    content: [
        {
            module: String,
            moduleContent: [
                {
                    fileVideo: String,
                    lesson: String,
                    linksToResources: [
                        {
                            linkName: String,
                            link: String,
                        },
                    ],
                },
            ],
            id: ObjectId,
        },
    ],
});
module.exports = model("TeacherCourse", TeacherCourse);
