var express = require('express');
var router = express.Router();
let passport = require('passport');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;
let plm = require('passport-local-mongoose');
let user = require('../models/users');
var courseType = require ('../models/courseType');
let course = require('../models/course');
let multer = require('multer');
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

var certIcon = multer({

  dest:  'public/images/certificateIcons',
   filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }

});


router.get('/', function(req, res, next) {
res.render('certificatesDashboard', { title: 'Certificates Dashboard', user: req.user });
});

//------------------------------for course------------------------------------------------




  /* GET department page */
router.get('/course', function(req, res, next) {
   // use mongoose model to query mongodb for all books
   course.find(function(err, courses) {

      if (err) {
         console.log(err);
         res.end(err);
         return;
      }
      // no error so send the books to the index view
      res.render('certificates/course/courseIndex', {
         courses: courses,
         title: 'courses Index' , user: req.user
      });
   });
});

router.get('/course/add', function(req, res, next) {
    courseType.find(function(err, courseType) {

      if (err) {
         console.log(err);
         res.end(err);
         return;
      }

    res.render('certificates/course/add', {
user: req.user, courseType : courseType ,title: 'Add course'
    });
    });
});



router.post('/course/add', certIcon.single("certicon"), function(req, res, next) {
 console.log(req.file);



  course.create(
    {
        coursename : req.body.coursename,
        coursetype : req.body.coursetype,
        iconurl : req.file.filename
     }, function (err, course)
        {
          if (err)
          {
              console.log(err);
              res.render('error');
              return;
          }
           res.redirect('/certificatesDashboard/course');

    });
      });


  router.get('/course/delete/:_id', function(req, res, next) {

    let _id = req.params._id;
  course.remove({ _id: _id }, function (err, course) {
          if (err)
          {
              console.log(err);
              res.render('error');
              return;
          }
           res.redirect('/certificatesDashboard/course');

    });

  });


  router.get('/course/:_id', function(req, res, next) {

   // grab id from the url
   let _id = req.params._id;
   courseType.find(function(err, courseTypes) {

      if (err) {
         console.log(err);
         res.end(err);
         return;
      }

   // use mongoose to find the selected book
  course.findById(_id, function(err, courseInfo) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      console.log(courseInfo.coursetype);
      var selectedTypeName = courseInfo.coursetype;
      res.render('certificates/course/edit', {
         course: courseInfo,
          courseTypes: courseTypes,
         title: 'Edit course' ,selectedTypeName : selectedTypeName, user: req.user
      });
   });

});
  });


router.post('/course/:_id', certIcon.single("certicon"), function(req, res, next) {
  console.log("in the post...");
 console.log(req.file);
   // grab id from url
   let _id = req.params._id;
 var url;
     if(req.file == null)
     {
       console.log("the file name is NULL - using old url!");
url = course.findById(_id, function(err, course) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      console.log (course.url);
      return course.url;
    });


     }
     else
     {
       console.log("Weve got a file!  - Updating url!");
url = req.file.filename;
     }

  console.log ("course     " +  req.body.course + "     coursetype     " + req.body.courseTypes);

   // populate new book from the form
   let courseObj = new course({
      _id: _id,
      coursename : req.body.course,
      coursetype : req.body.courseTypes,
      iconurl: url
   });
console.log(courseObj);
   course.update({ _id: _id }, courseObj,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
res.redirect('/certificatesDashboard/course');
   });

});


//------------------------------for course Type------------------------------------------------




  /* GET department page */
router.get('/courseType', function(req, res, next) {
   // use mongoose model to query mongodb for all books
   courseType.find(function(err, courseTypes) {

      if (err) {
         console.log(err);
         res.end(err);
         return;
      }
      // no error so send the books to the index view
      res.render('certificates/courseType/courseTypeIndex', {
         courseTypes: courseTypes,
         title: 'course Type Index' , user: req.user
      });
   });
});

router.get('/courseType/add', function(req, res, next) {


    res.render('certificates/courseType/add', {
user: req.user, title: 'Add course'
    });

});








router.post('/courseType/add', function(req, res, next) {

  courseType.create(
    {
        coursetype : req.body.coursetype
     }, function (err, departments)
        {
          if (err)
          {
              console.log(err);
              res.render('error');
              return;
          }
           res.redirect('/certificatesDashboard/courseType');

    });
      });

  router.get('/courseType/delete/:_id', function(req, res, next) {

    let _id = req.params._id;
  courseType.remove({ _id: _id }, function (err, departments) {
          if (err)
          {
              console.log(err);
              res.render('error');
              return;
          }
           res.redirect('/certificatesDashboard/courseType');

    });

  });



  router.get('/courseType/:_id', function(req, res, next) {

   // grab id from the url
   let _id = req.params._id;

   // use mongoose to find the selected book
  courseType.findById(_id, function(err, courseTypes) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.render('certificates/courseType/edit', {
         courseTypes: courseTypes,
         title: 'Edit course' , user: req.user
      });
   });

});


router.post('/courseType/:_id', function(req, res, next) {

   // grab id from url
   let _id = req.params._id;


   // populate new book from the form
   let coursetypeObj = new courseType({
      _id: _id,
      coursetype : req.body.coursetype
   });

   courseType.update({ _id: _id }, coursetypeObj,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/certificatesDashboard/courseType');
   });

});


module.exports = router;
