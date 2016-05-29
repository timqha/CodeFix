
// grab the packages that we need for the user model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// use schema
var CategoryShema = new Schema({
    name: {type: String, required: true},
    show: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now()}
});

// return the models
module.exports = mongoose.model('Category', CategoryShema);