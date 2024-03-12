const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(
      "https://vercel.com/ajaygupta001s-projects/authentication-backend-todo/4qrseL7fXhCBpo2T1X5dAEMi1GPv"
    );
    console.log("connected to mongodb Database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
