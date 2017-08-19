//
//	mongodb
//

var mongoose = require('mongoose')
var mongodb = mongoose.createConnection(process.env.DB_HOST, process.env.DB_NAME, parseInt(process.env.DB_PORT))

module.exports = {
	cache: {},
	init: function(name, schema) {
		var _schema = new mongoose.Schema(schema);
		this.cache[name] = mongodb.model(name, _schema);
		return this.cache[name];
	},
	get: function(name) {
		return this.cache[name];
	},
	objId: function(name) {
		return {
			type: mongoose.Schema.Types.ObjectId,
			ref: name
		}
	}
}
