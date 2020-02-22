require("dotenv").config();
const serviceAccount =  JSON.parse(process.env.serviceAccount)

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    clientId: process.env.clientId,
    secret: process.env.secret,
    callback: process.env.callback,
    serviceAccount,
    firebaseURL: process.env.firebaseURL    
}