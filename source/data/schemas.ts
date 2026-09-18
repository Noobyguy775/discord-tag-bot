import { Schema } from "mongoose";


export const TagSchema = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    flags: [{ type: String, required: true }],
    regex: { type: String, required: false },
    pinned: { type: Boolean, default: false },
    uses: { type: Number, default: 0, required: false }
}, {
    methods: {
        IncreaseUsage(){
            return this.updateOne({ $inc: { uses: 1 } }).exec()
        }
    }
})

export const TagStorageSchema = new Schema({
    ID: { type: String, required: true, unique: true },
    scope: { type: String, required: true, enum: ["user", "server"] },
    tags: [{ type: TagSchema, required: true }]
}, {
    methods: {
        FindByName(input: string) {
            return this.tags.find((tag) => tag.name === input);
        },
        FindByFlag(input: string){
            return this.tags.filter((tag) => tag.flags.includes(input))
        },
        FindByRegex(input: string){
            return this.tags.filter((tag) => 'regex' in tag && tag.regex !== null && new RegExp(tag.regex, 'i').test(input))
        },
        GetPinned(){
            return this.tags.filter((tag) => tag.pinned === true)
        }
    }, query: {
        findContext(id: string, scope: Scope) {
            return this.where('scope').equals(scope).where('ID').equals(id);
        }
    }
})

export type Scope = "user" | "server";