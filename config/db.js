const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION);
        console.log(`database connected ${connect.connection.host} ${connect.connection.name}`);
    } catch (error) {
        console.log(error);
    };
};

module.exports = connectDb;