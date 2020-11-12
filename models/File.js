const { Schema, model, ObjectId } = require("mongoose");
const File = new Schema({
    name: {type: String, required: true},
    user: {type: ObjectId, ref: 'User'},
    profession: {type: String},
    smallDescription: {type: String},
    fullDescription: {type: String},
    author: {type: String},
    price: {type: String},
});
module.exports = model("File", File);