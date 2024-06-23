const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const app = require("./app");


const DB = process.env.DATABASE;

mongoose.connect(DB, { serverApi: { version: '1', strict: true, deprecationErrors: true } }).then(() => {
	console.log("DB connection successful");
	const port = process.env.PORT || 3000;
	const server = app.listen(port, () => {
		console.log(`listening on port ${port}.`);
	})
	process.on('unhandledRejection', () => {
		console.log("Something went Wrong!!!!");
		server.close(() => {
			process.exit(1);
		});
		
	})
}).catch(err => {
	console.log(err.message);
	process.exit(1);
})




