const fs = require("fs");

exports.checkID = (req, res, next, val) => {
	fs.readFile(`${__dirname}/../dev-data/data/users.json`, (err, data) => {
		data = JSON.parse(data);
		const user = data.find(user => val === user.id);
		if(!user){
			return res.send("NO USER FOUND");
		}
		next();
	})
}

exports.getAllUsers = (req, res) => {
	fs.readFile(`${__dirname}/../dev-data/data/users.json`, (err, data) => {
		res.status(200).json(Object.assign({message: "ok"}, data));
	})
}

exports.getAUser = (req, res) => {
	fs.readFile(`${__dirname}/../dev-data/users.json`, (err, data) => {
		data = JSON.parse(data);
		const id = req.params(id) * 1
		const user = data.find(val => val.id === id)
		res.status(200).json(user);
	})
}

exports.deleteAUser = (req, res) => {
	fs.readFile(`${__dirname}/../dev-data/users.json`, (err, data) => {
		data = JSON.parse(data);
		const id = req.params(id) * 1
		const user = data.find(val => val.id === id)
		res.status(200).json(user);
	})
}