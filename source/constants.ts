await import('dotenv').then(dotenv => dotenv.config());
const env = process.env


// MongoDB connection
// @see https://www.mongodb.com/docs/manual/reference/connection-string/
export const databaseURL = `mongodb+srv://cluster0.37vwudh.mongodb.net/`

// MongoDB connection config
// @see https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.connect()
export const databaseConfig = {
    dbName: env["db_name"] || 'tags',
    auth: {
        username: env["db_username"] || 'admin',
        password: env["db_password"] || ''
    },
    autoIndex: false
}

// Bot owner ID
export const ownerId = '700425671146471435'