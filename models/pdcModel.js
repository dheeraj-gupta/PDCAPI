var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

var pdcSchema = new Schema({

sessionID: Number,
nodes:[]
	
});

module.exports = mongoose.model('Pdc', pdcSchema);