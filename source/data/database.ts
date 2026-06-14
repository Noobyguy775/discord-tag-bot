import * as Mongoose from 'mongoose';
await import('dotenv').then(dotenv => dotenv.config());

import { databaseURL } from '../constants.js';

import { TagSchema, TagStorageSchema } from './schemas/Tag.js';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"])

const { UserDB, ServerDB } = await connect()
async function connect() {
    const UserDB = Mongoose.createConnection(databaseURL, { 
        dbName: 'user_tags',
        auth: {
            username: process.env["db_user"] || 'admin',
            password: process.env["db_password"] || ''
        },
        autoIndex: false
    }).asPromise().catch(err => {
        console.error("Failed to connect to MongoDB:", err)
        process.exit(1)
    })

    const ServerDB = Mongoose.createConnection(databaseURL, { 
        dbName: 'server_tags',
        auth: {
            username: process.env["db_user"] || 'admin',
            password: process.env["db_password"] || ''
        },
        autoIndex: false
    }).asPromise().catch(err => {
        console.error("Failed to connect to MongoDB:", err)
        process.exit(1)
    })

    await Promise.all([UserDB, ServerDB]).then(() => {
        console.log("Databases connected successfully")
    })

    return { UserDB, ServerDB }
}

const { ServerTagModel, UserModel } = await applyModels()

async function applyModels() {
    const UserModel = UserDB.model('UserTag', TagStorageSchema)
    const ServerTagModel = ServerDB.model('ServerTag', TagStorageSchema)

    return { UserModel, ServerTagModel }
}

export function findScope(scope: "user" | "server") {
    switch (scope) {
        case "user": {
            return UserModel
        }
        case "server": {
            return ServerTagModel
        }
    }
}