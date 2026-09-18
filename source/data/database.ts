import * as Mongoose from 'mongoose';

import { databaseURL, databaseConfig } from '../constants.ts';
import { TagStorageSchema } from './schemas.ts';

// temp fix for now?
import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1"])

export const databaseConnection = await connect()
async function connect() {
    return await Mongoose.connect(databaseURL, { 
        ...databaseConfig
    }).catch(err => {
        console.error("Failed to connect to MongoDB:", err)
        process.exit(1)
    })
}

export const TagModel = databaseConnection.model('TagStorage', TagStorageSchema)

export * from './functions.ts'