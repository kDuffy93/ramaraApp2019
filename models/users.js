
let mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

let plm = require('passport-local-mongoose');
let findOrCreate = require('mongoose-findorcreate');
var department = require ('../models/department');
// create book schema (class)
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
  required: 'Employee First Name is missing. Please enter one now.'
    },
    surName: {
        type: String,
  required: 'Employee surname is missing. Please enter one now.'
    },
    departmentname: {
      type: mongoose.Schema.Types.Object, ref: 'department'
    },
    email: {
      type: String
    },
    phonenumber: {
    type: String
  },
  changepassword:{
    type: Boolean
  }

});
/*
userSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;
console.log('Im in the Pre save funtion !!!!!!!!!!!!!!!!!@^%@^!%#^%$&!^$&!^&!^#*!&*!^*#')
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
                console.log(user.password)
            user.password = hash;
            next();
            console.log('Im in the Pre save funtion !!!!!!!!!!!!!!!! After pw change')
              console.log(user.password)
        });
    });
});
*/
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
userSchema.plugin(plm, { hashField : 'hash' });
userSchema.plugin(findOrCreate);

// make it public
module.exports = mongoose.model('user', userSchema);
