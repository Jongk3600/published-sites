var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
	name: String,
	location: String,
	price: String,
	image: String,
	description: String,
	comments: [
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}
	],
	wifi: String,
	tent: String,
	power: String,
	rv: String,
	handicap: String,
	pets: String,
	boatramp: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String
	},
	createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Campground", campgroundSchema);