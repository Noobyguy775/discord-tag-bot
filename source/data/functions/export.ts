import { type Snowflake, type Scope } from '../schemas.ts'

import { findContext } from '../database.ts';

export async function exportTags(snowflake: Snowflake, scope: Scope) {
    const doc = await findContext(scope, snowflake)
    if (doc) {
        return doc.toObject().tags
    }
    return null
}