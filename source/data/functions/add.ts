import type { Scope } from '../schemas.ts'
import { TagSchema } from '../schemas.ts'

import { TagModel } from '../database.ts';

export async function addTags(tags: typeof TagSchema, snowflake: string, scope: Scope) {
    return await TagModel.collection.updateOne(
        { ID: snowflake, scope },
        { $push: { tags: { $each: tags } } }
    )
}
