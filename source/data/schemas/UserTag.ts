import type { Snowflake } from "discord.js";
import { TagSchema } from "./Tag.js";
import { Schema } from "mongoose";

export const UserTagSchema = new Schema({
    ID: String,
    tags: [TagSchema]
})

/* Default UserTag object */
export interface UserTagSchema {
    ID: Snowflake;
    tags: TagSchema[];
}