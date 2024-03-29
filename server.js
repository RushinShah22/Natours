const dotenv = require("dotenv");
dotenv.config({ path : "./config.env"});
const mongoose = require("mongoose");
const app = require("./app");


const DB = process.env.DATABASE;

mongoose.connect(DB, { serverApi: { version: '1', strict: true, deprecationErrors: true } }).then(() => {
	console.log("connection successful")
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on port ${port}.`);
})