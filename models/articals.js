var mongoose = require("mongoose");

var articalSchema = require("../schemas/artical");

module.exports = mongoose.model("Artical",articalSchema);

