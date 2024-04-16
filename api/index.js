
const app = require("./src/app")
const connectDB = require("./src/config/db")
const {serverPort} = require("./src/secret")


app.listen(serverPort,async()=>{
    console.log(`server is running at http://localhost:${serverPort}`);

   await connectDB()
});
  
