import type { Snowflake } from "discord.js";
import { TagSchema } from "./Tag.js";
import { Schema } from "mongoose";

export const ServerTagSchema = new Schema({
    ID: String,
    type: String,
    tags: [TagSchema]
})

/* Default ServerTag object */
export interface ServerTagSchema {
    ID: Snowflake;
    tags: TagSchema[];
}