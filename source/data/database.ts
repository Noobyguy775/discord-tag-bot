import * as Mongoose from 'mongoose';
import { databaseURL } from '@constants';

const { UserDB, TagDB } = await start()

async function start() {
    const UserDB = Mongoose.createConnection(databaseURL, { 
        dbName: 'user_tags',
        auth: {
            username: process.env["db_user"] || 'admin',
            password: process.env["db_password"] || ''
        },
        autoIndex: false
    })

    const TagDB = Mongoose.createConnection(databaseURL, { 
        dbName: 'user_tags',
        auth: {
            username: process.env["db_user"] || 'admin',
            password: process.env["db_password"] || ''
        },
        autoIndex: false
    })
    return { UserDB, TagDB }
}

export { UserDB, TagDB };