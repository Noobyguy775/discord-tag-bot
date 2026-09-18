import type { Snowflake, Scope } from '../schemas.ts'

import { determineModel } from '../database.ts';

export async function newScope(snowflake: Snowflake, scope: Scope) {
    const model = determineModel(scope)
    return model.create({ ID: snowflake, scope: scope, tags: [] })
}
