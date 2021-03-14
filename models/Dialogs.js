const { Schema, model } = require("mongoose");

const DialogSchema = new Schema(
    {
        partner: [{ type: Schema.Types.ObjectId, ref: "User" }],
        // partner: { type: Schema.Types.ObjectId, ref: "User" },
        author: { type: Schema.Types.ObjectId, ref: "User" },
        dialogName: { type: String},
        isOnePartnerOrGroup: { type: String },
        lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    },
    {
        timestamps: true,
    }
);

export const DialogModel = model<IDialog>("Dialog", DialogSchema);