import { type TagSchema, type Snowflake, type Scope } from '../schemas/Tag.js'

import { findScope } from '../database.js';

export function addTags(tags: TagSchema[], snowflake: Snowflake, scope: Scope) {
    const model = findScope(scope);
}