const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://shanmukhpulijalajunk16:ZqzVSuVXrCM9mD00@cluster0.cx9lvf9.mongodb.net/ERSShan';
        const conn = await mongoose.connect(uri);
        console.log(`Connected to MongoDB ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};
const db = mongoose.connection;

module.exports = { db, connectDB };
