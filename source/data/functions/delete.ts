import { type TagSchema, type Snowflake, type Scope } from '../schemas.ts'

import { findContext } from '../database.ts';

export async function deleteTags(name: TagSchema["name"], snowflake: Snowflake, scope: Scope) {
    const doc = await findContext(scope, snowflake)
    if (doc) {
        return await doc.updateOne({ $pull: { tags: { name: name } } }).exec()
    }
}