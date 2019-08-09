var express = require('express');
var router = express.Router();
let passport = require('passport');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;
let plm = require('passport-local-mongoose');
let date = require('date-and-time');
let course = require('../models/course');
let user = require('../models/users');
let userCourse = require('../models/usercourses');

//make entire view private
router.use( function(req, res, next) {
	if(!req.user){
    req.session.messages =["You must be logged-in to view this page"];
    req.session.messages1 = ["please enter you're credentials below"];
  

    res.redirect('/login')
  }
  next();
});

	router.use( function(req, res, next) {
	  if(req.user != undefined){
	     if(req.user.changepassword == true){
	    res.redirect('/firstlogin')
	    }
	  }
	  else{
	    req.session.messages =["You must be logged-in to view this page"];
	    req.session.messages1 = ["please enter you're credentials below"];
	      res.redirect('/login')
	  }
	  next();
	  });

/* GET users listing. */
router.get('/', function(req, res, next) {
res.render('expiringDashboard', { title: 'Employees with cetificates expiring Soon', user: req.user });
});
router.get('/date', function(req, res, next) {

	 course.find(function(err, courses) {
			if (err) {
				 console.log(err);
				 res.end(err);
				 return;
			}

				userCourse.find(function(err, allUserCourses) {
					 if (err) {
							 console.log(err);
							 res.end(err);
							 return;
						}

				 user.find(function(err, users) {
						if (err) {
							 console.log(err);
							 res.end(err);
							 return;
						}

			res.render('expiring/date/expiringByDate', {
				 courses: courses,
				 users: users,
				 allUserCourses: allUserCourses,

				 title: 'Employee certificates Expiring by Date' , user: req.user
			 });
		});
 });
	});
	});

router.get('/course', function(req, res, next) {

	console.log(req.query);
	var daysToAdd = Number(req.query.days)

	 course.find(function(err, courses) {
			if (err) {
				 console.log(err);
				 res.end(err);
				 return;
			}

				userCourse.find(function(err, allUserCourses) {
					 if (err) {
							 console.log(err);
							 res.end(err);
							 return;
						}

				 user.find(function(err, users) {
						if (err) {
							 console.log(err);
							 res.end(err);
							 return;
						}

						let now =   new Date();
						console.log(daysToAdd);
						console.log(now);
let curdate = date.addDays(now, daysToAdd)
console.log(curdate);



console.log('curdate:' + now);
			res.render('expiring/course/expiringByCourse', {
				 courses: courses,
				 users: users,
				 allUserCourses: allUserCourses,
				 curdate: curdate,
				 now: now,
				 days: daysToAdd,
				 title: 'Employee certificates Expiring by Course' , user: req.user
			 });
    });
 });
  });
  });





module.exports = router;
