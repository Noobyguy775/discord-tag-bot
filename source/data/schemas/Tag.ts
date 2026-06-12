import Mongoose from "mongoose"

export const TagSchema = {
    name: String,
    flags: [String],
    regex: String,
    content: String,
    pinned: Boolean,
    uses: Number
} as Mongoose.SchemaDefinition