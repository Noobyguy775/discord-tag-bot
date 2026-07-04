import type { Snowflake } from "discord.js";
import { Schema } from "mongoose";


export const TagSchema = new Schema({
    name: String,
    flags: [String],
    regex: { type: String, required: false },
    content: String,
    pinned: Boolean,
    uses: Number
}, {
    methods: {
        IncreaseUsage(){
            return this.updateOne({ $inc: { uses: 1 } }).exec()
        }
    }
})
/* Tags stored in each document */
export type TagSchema = UserTagSchema | ServerTagSchema;
export interface ServerTagSchema {
    name: string;
    flags: string[];
    regex: string;
    content: string;
    pinned?: boolean;
    uses: number;
}
export type UserTagSchema = Omit<ServerTagSchema, 'regex'>;

export const TagStorageSchema = new Schema({
    ID: String,
    scope: String,
    tags: [TagSchema]
}, {
    methods: {
        FindByName(input: string) {
            function format(name: string){
                return { name: `✅|${name}`, value: name }
            };
            return format(this.tags.find((tag) => tag.name === input)?.name || '');
        },
        FindByFlag(input: string){
            function format(name: any[]){
                const output = [];
                for (const tagname of name)
                    output.push({ name: `🚩|${tagname}`, value: tagname });
                return output
            };
            return format(this.tags.filter((tag) => tag.flags.includes(input)))
        },
        FindByRegex(input: string){
            function format(name: any[]){
                const output = [];
                for (const tagname of name)
                    output.push({ name: `🔍|${tagname}`, value: tagname });
                return output
            };
            return format(this.tags.filter((tag) => 'regex' in tag && tag.regex !== null && new RegExp(tag.regex, 'i').test(input)))
        },
        GetPinned(){
            function format(name: any[]){
                const output = [];
                for (const tagname of name)
                    output.push({ name: `📌|${tagname}`, value: tagname });
                return output
            };
            return format(this.tags.filter((tag) => tag.pinned === true))
        }
    }
})
/* Document stored in each database */
export interface TagStorageSchema {
    ID: Snowflake;
    scope: Scope;
    tags: TagSchema[];
}

/* User data store */
export const UserDataSchema = new Schema({
    ID: String,
    data: String
})

export type { Snowflake } from "discord.js";

export type Scope = "user" | "server";