

let mongoose = require('mongoose');

// create book schema (class)
var departmentSchema = new mongoose.Schema({
    departmentname: {
        type: String,
        required: 'Department Title is missing. Please enter one now.'
    }
});

// make it public
module.exports = mongoose.model('department', departmentSchema);