

let mongoose = require('mongoose');

// create book schema (class)
var contractorSchema = new mongoose.Schema({
    contractorName: {
        type: String,
        required: 'contractorName is null; error'
    },
    services: [{
      type: String, default: ""
    }],

    phoneNumber: {
     type: String,
   },
     email: {
      type: String,

    },
     wsib: {
      type: String,

    },
    wsibExp: {
     type: Date,

   },
     insurance: {
      type: Date,

    },
    caf: {
     type: Date,

   }
});

// make it public
module.exports = mongoose.model('contractors', contractorSchema);
