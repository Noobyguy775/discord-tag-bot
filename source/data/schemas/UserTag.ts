import { TagSchema } from "./Tag.js";
import { Schema } from "mongoose";

export const UserTagSchema = new Schema({
    userID: String,
    tags: [TagSchema]
})