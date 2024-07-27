const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Paste your own URI
        const uri = process.env.MONGODB_URI;
        const conn = await mongoose.connect(uri);
        console.log(`Connected to MongoDB ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};
const db = mongoose.connection;

module.exports = { db, connectDB };
