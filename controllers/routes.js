const routes = require("express").Router();
const User = require("../models/users");
routes.get("/api/users", async (req, res) => {
	const userData = await User.find({}, "username");
	res.json(userData);
});

routes.post("/api/users", async (req, res) => {
	const data = req.body;
	const userData = new User({ username: data.username });
	const result = await userData.save();
	res.json({ username: result.username, _id: result._id });
});

function dateParser(obj) {
	return {
		description: obj.description,
		duration: obj.duration,
		date: new Date(obj.date).toDateString(),
	};
}

routes.get("/api/users/:_id/logs", async (req, res) => {
	let query = req.query;
	let limit = Number(query.limit);
	const result = await User.findOne({ _id: req.params._id }, { __v: 0 });
	if (query.from && query.to) {
		let date1 = new Date(query.from);
		let date2 = new Date(query.to);
		const filteredResult = await result.log
			.filter(({ date }) => {
				if (date >= date1 && date <= date2) {
					return true;
				}
			})
			.map(dateParser);
		if (limit) {
			res.json({
				username: result.username,
				count: limit,
				_id: result._id,
				log: filteredResult.slice(0, limit),
			});
		} else {
			res.json({
				username: result.username,
				count: filteredResult.length,
				_id: result._id,
				log: filteredResult,
			});
		}
	} else {
		if (limit) {
			res.json({
				username: result.username,
				count: limit,
				_id: result._id,
				log: result.log.map(dateParser).slice(0, limit),
			});
		} else {
			res.json({
				username: result.username,
				count: result.log.length,
				_id: result._id,
				log: result.log.map(dateParser),
			});
		}
	}
});

routes.post("/api/users/:_id/exercises", async (req, res) => {
	const data = req.body;
	const userData = await User.findOne({ _id: req.params._id });
	const date =
		(await data["date"]) !== undefined
			? new Date(data["date"])
			: new Date();
	const duration = Number(data["duration"]);
	userData.log.push({
		description: data["description"],
		duration: duration,
		date: date,
	});
	await userData.save();
	res.json({
		_id: userData._id,
		username: userData.username,
		date: date.toDateString(),
		duration: Number(data.duration),
		description: data["description"],
	});
});

module.exports = routes;
