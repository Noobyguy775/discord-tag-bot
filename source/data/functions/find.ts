import type { Scope } from '../schemas.ts'

import { TagModel } from '../database.ts';

import type { Interaction , Snowflake } from 'discord.js';
import type { ObjectId } from 'mongoose';

export async function scopeExists(snowflake: Snowflake, scope: Scope) {
    return await TagModel.exists({ ID: snowflake, scope })
}

export async function fetchEntry(snowflake: Snowflake, scope: Scope) {
    return await TagModel.where().findContext(snowflake, scope).exec()
}

export async function fetchDualContext(interaction: Interaction<"cached">) {
    const user = await fetchEntry(interaction.user.id, "user")
    const server = await fetchEntry(interaction.guildId, "server")

    return {user, server}
}

export async function findTag(interaction: Interaction<"cached">, tagId: ObjectId) {
    const { user, server } = await fetchDualContext(interaction)

    const allTags = user.concat(server)
    
    if (allTags.length > 0) {
        return allTags.find((tag) => tag._id === tagId) || null
    } else {
        return null
    }
}