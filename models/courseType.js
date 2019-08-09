

let mongoose = require('mongoose');

// create book schema (class)
var courseTypeSchema = new mongoose.Schema({
    coursetype: {
        type: String,
        required: ' Course Type is missing. Please enter one now.'
    }
});

// make it public
module.exports = mongoose.model('courseType', courseTypeSchema);