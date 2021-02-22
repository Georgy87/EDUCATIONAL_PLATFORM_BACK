const { Schema, model, ObjectId } = require("mongoose");
const TeacherCourse = new Schema(
    {
        user: { type: ObjectId, ref: "User" },
        photo: { type: String },
        profession: { type: String },
        competence: { type: String },
        author: { type: String },
        price: { type: String },
        smallDescription: { type: String },
        fullDescription: { type: String },
        user: { type: ObjectId, ref: "User" },
        avatar: { type: String },
        comments: [
            {
                text: { type: String },
                photo: { type: String},
                user: {
                    required: true,
                    ref: "User",
                    type: Schema.Types.ObjectId,
                },
                created: {
                    type: Date,
                    default: Date.now
                },
                comments: [
                    {
                        text: { type: String },
                        photo: { type: String},
                        user: {
                            required: true,
                            ref: "User",
                            type: Schema.Types.ObjectId,
                            trim: true
                        },
                        created: {
                            type: Date,
                            default: Date.now
                        },
                    },
                ],
            },
        ],
        content: [
            {
                module: String,
                moduleHours: Number,
                moduleMinutes: Number,
                moduleSeconds: Number,
                moduleContent: [
                    {
                        fileVideo: String,
                        lesson: String,
                        lessonTime: String,
                        linksToResources: [
                            {
                                linkName: String,
                                linksToResources: String,
                            },
                        ],
                    },
                ],
                id: ObjectId,
            },
        ],
    },
    {
        timestamps: true,
    }
);
module.exports = model("TeacherCourse", TeacherCourse);
