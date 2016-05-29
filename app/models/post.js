// grab the packages that we need for the user model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// use schema
var PostShema = new Schema({
    title: {type: String, index: {unique: true}},
    text: String,
    description: String,
    rate: {type: Number, default: 1},
    author: String,
    image: String,
    show: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now()}
});

// return the models
module.exports = mongoose.model('Post', PostShema);