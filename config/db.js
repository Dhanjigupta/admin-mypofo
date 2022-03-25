const mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost:27017/my-pofo', {useNewUrlParser: true, useCreateIndex: true,});
const dbConnect = async () => {
    try {
      const conn = await mongoose.connect("mongodb+srv://admin:admin@pofo.hbhje.mongodb.net/pofo?retryWrites=true&w=majority", {
        
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.log(err);
    }
  };
  
  module.exports = dbConnect;