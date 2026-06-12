import { TagSchema } from "./Tag.js";
import { Schema } from "mongoose";

export const ServerTagSchema = new Schema({
    serverID: String,
    tags: [TagSchema]
})