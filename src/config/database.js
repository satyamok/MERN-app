const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://invoiceBn:aesM2MSbJ5qZV9DD@invoicebn.texcf1l.mongodb.net/knowledgefeed"
  );
};

module.exports = connectDB;
