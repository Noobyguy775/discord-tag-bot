const env = process.env


// MongoDB connection
// @see https://www.mongodb.com/docs/manual/reference/connection-string/
export const databaseURL = `mongodb+srv://cluster0.37vwudh.mongodb.net/`

// MongoDB connection config
// @see https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.connect()
export const databaseConfig = {
    auth: {
        username: env["db_user"] || 'admin',
        password: env["db_password"] || ''
    },
    autoIndex: false
}