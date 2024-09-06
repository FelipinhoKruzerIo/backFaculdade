const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectou no bancoo");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
