const { Schema, model, ObjectId } = require("mongoose");
const TeacherCourse = new Schema({
    // name: {type: String, required: true},
    user: { type: ObjectId, ref: "User" },
    content: [{ type: Object }],
});
module.exports = model("TeacherCourse", TeacherCourse);
