import * as Mongoose from 'mongoose';

import { databaseURL, databaseConfig } from '../constants.ts';
import { TagStorageSchema, type Scope, type Snowflake } from './schemas.ts';

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

const { ServerTagModel, UserModel } = await applyModels()
async function applyModels() {
    const UserModel = databaseConnection.model('UserTag', TagStorageSchema)
    const ServerTagModel = databaseConnection.model('ServerTag', TagStorageSchema)

    return { UserModel, ServerTagModel }
}

export function findModel(scope: Scope) {
    switch (scope) {
        case "user": {
            return UserModel
        }
        case "server": {
            return ServerTagModel
        }
    }
}

export async function findDocument(model: typeof UserModel | typeof ServerTagModel, id: Snowflake) {
    return await model.findOne({ ID: id }).exec()
}

export async function findContext(scope: Scope, id: Snowflake) {
    return await findDocument(findModel(scope), id)
}

export * from './functions.ts'