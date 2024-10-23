const mongoose = require("mongoose");

const connection = async (uri) => {
  try {
    const dbConnect = await mongoose.connect(uri);
    if (dbConnect) {
      console.log("Database connection is successful");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
