const mongoose = require('mongoose');
// connection url 
const dbURL = process.env.MONGO_URI;

async function connectDb() {
    await mongoose.connect(dbURL)
        .then(() => {
            console.log('Connected to Mongo DB');
        })
        .catch((error) => {
            console.error('Failed to connect Mongo DB');
        })
}

module.exports = connectDb