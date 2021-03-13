const { Schema, model, ObjectId } = require("mongoose");

const Lesson = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "TeacherCourse", require: true },
    module: { type: String },
    moduleHours: { type: Number },
    moduleMinutes: { type: Number },
    moduleSeconds: { type: Number },
    moduleContent: [
        {
            fileVideo: { type: String },
            lesson: { type: String },
            lessonTime: { type: String },
            linksToResources: [
                {
                    linkName: { type: String },
                    linksToResources: { type: String },
                },
            ],
        }
    ],
});

module.exports = model("Modules", Lesson);