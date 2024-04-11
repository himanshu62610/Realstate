const mongoose = require("mongoose");
require("dotenv").config();

//const MONGODB_URL
const MONGODB_URL=process.env.MONGODB_URL;

const connect = () => {
	mongoose
		.connect(MONGODB_URL, {
			useNewUrlparser: true,
			useUnifiedTopology: true,
		})
		.then(console.log(`DB Connection Success`))
		.catch((err) => {
			console.log(`DB Connection Failed`);
			console.log(err);
			process.exit(1);// Forcefully exits the Node.js process with an exit code of 1
		});
};
module.exports=connect;