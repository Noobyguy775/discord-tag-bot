import type { Snowflake, Scope } from '../schemas.ts'

import { findModel } from '../database.ts';

export async function scopeExists(snowflake: Snowflake, scope: Scope) {
    const model = findModel(scope)
    return await model.exists({ ID: snowflake })
}