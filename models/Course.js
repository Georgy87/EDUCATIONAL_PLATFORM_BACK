const { Schema, model, ObjectId } = require("mongoose");
const Course = new Schema({
    name: {type: String, required: true},
    user: {type: ObjectId, ref: 'User'},
    profession: {type: String},
    smallDescription: {type: String},
    fullDescription: {type: String},
    author: {type: String},
    price: {type: String},
    professionalСompetence: { type: String },
    avatar: { type: String }
});
module.exports = model("Course", Course);