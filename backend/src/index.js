require("dotenv").config();
const connectDB = require("./db");
const app = require("./app");

//Connecting database and runnning server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed !!!!", err);
  });
