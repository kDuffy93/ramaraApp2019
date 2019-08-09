

let mongoose = require('mongoose');

// create book schema (class)
var userCoursesSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: 'User is null; error'
    },
     coursename: {
      type: String,
        required: 'Course name is missing. Please enter one.'
    },
    expires: {
     type: Boolean,
   },
     expiry: {
      type: Date,

    },
     takenOn: {
      type: Date,
        required: 'When was this course taken?'
    },
     photourl: {
      type: String,
      
    }
});

// make it public
module.exports = mongoose.model('userCourses', userCoursesSchema);
