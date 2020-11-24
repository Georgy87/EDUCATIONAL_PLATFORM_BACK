const { Schema, model } = require("mongoose");
const User = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String },
    avatar: { type: String },
    teacher: { type: Boolean },
});
module.exports = model("User", User);
