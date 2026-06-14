import type { Snowflake } from "discord.js";


export const TagSchema = {
    name: String,
    flags: [String],
    regex: String,
    content: String,
    pinned: Boolean,
    uses: Number
}
/* Tags stored in each document */
export interface TagSchema {
    name: string;
    flags: string[];
    regex: string;
    content: string;
    pinned?: boolean;
    uses: number;
}

export const TagStorageSchema = {
    ID: String,
    scope: String,
    tags: [TagSchema]
}
/* Document stored in each database */
export interface TagStorageSchema {
    ID: Snowflake;
    scope: Scope;
    tags: TagSchema[];
}

export type { Snowflake } from "discord.js";

export type Scope = "user" | "server";