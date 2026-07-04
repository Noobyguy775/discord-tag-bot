import type { Snowflake, Scope, TagSchema } from '../schemas.ts'

import { findModel } from '../database.ts';
import type { Interaction } from 'discord.js';

export async function scopeExists(snowflake: Snowflake, scope: Scope) {
    const model = findModel(scope)
    return await model.exists({ ID: snowflake })
}


const defaultfindQuery = { tags: { name: 1, flags: 1, regex: 1 } }

export async function findTags(snowflake: Snowflake, scope: Scope, query: Object = defaultfindQuery) {
    const model = findModel(scope)
    const doc = await model.findOne({ ID: snowflake }, query).exec()
    return doc ?? null
}

export async function findAllTags(interaction: Interaction<"cached">, query: Object = defaultfindQuery) {
    const user = await findTags(interaction.user.id, "user", query)
    const server = await findTags(interaction.guildId, "server", query)

    return {user, server}
}

export async function findTagContent(interaction: Interaction<"cached">, name: TagSchema["name"]) {
    const tag = await findAllTags(interaction, { tags: { name: 1, content: 1 } })
    .then((tags) => tags.find((tag) => tag.name === name))
    return tag || null
}