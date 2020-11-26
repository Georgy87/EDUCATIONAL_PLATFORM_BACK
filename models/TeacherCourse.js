const { Schema, model, ObjectId } = require("mongoose");
const TeacherCourse = new Schema({
    user: { type: ObjectId, ref: "User" },
    photo: {type: String},
    profession: {type: String},
    author: {type: String},
    price: {type: String},
    smallDescription: {type: String},
    fullDescription: {type: String},
    content: [{ type: Object }],
});
module.exports = model("TeacherCourse", TeacherCourse);
