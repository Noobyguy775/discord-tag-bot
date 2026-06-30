import type { Snowflake, Scope } from '../schemas.ts'

import { findModel } from '../database.ts';

export async function newScope(snowflake: Snowflake, scope: Scope) {
    const model = findModel(scope)
    return model.create({ ID: snowflake, scope: scope, tags: [] })
}
