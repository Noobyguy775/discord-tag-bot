import type { Snowflake, Scope, TagSchema } from '../schemas.ts'

import { findContext } from '../database.ts';

export async function addTags(tags: TagSchema[], snowflake: Snowflake, scope: Scope) {
    const doc = await findContext(scope, snowflake)
    if (doc)
        return await (doc.updateOne({ $push: { tags: { $each: tags } } }).exec())
    return null
}
