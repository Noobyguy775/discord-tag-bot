import { type ColorResolvable , EmbedBuilder } from 'discord.js'

import type { TagSchema } from '@/data/schemas.js'

export function TagEmbedBuilder(obj: TagSchema, color: ColorResolvable = 0x5C146C, snowflake: string) {
    return new EmbedBuilder()
        .setColor(color)
        .setDescription(obj.content.replaceAll('\\n', '\n') + '\n\n' + `-# <@${snowflake}> used the tag "${obj.name}"`)
}