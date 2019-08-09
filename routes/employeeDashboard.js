let express = require('express');
let router = express.Router();
let multer = require('multer');
let course = require('../models/course');
let user = require('../models/users');
let userCourse = require('../models/usercourses');
let passport = require('passport');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;
let plm = require('passport-local-mongoose');

//auth on every page
var department = require ('../models/department');
/* GET department page */
router.use( function(req, res, next) {

  if(!req.user){
    req.session.messages =["You must be logged-in to view this page"];
    req.session.messages1 = ["please enter you're credentials below"];
    req.session.returnURL = [];
    req.session.returnURL = req.url;

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

var certPhoto = multer({

  dest:  'public/images/certificate-photos',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

/* GET the employee dashboard */
router.get('/', function(req, res, next) {
  res.render('employeeDashboard', { title: 'Employee Dashboard', user: req.user });
});



//------------------------------for users------------------------------------------------



/* GET department page */
router.get('/manageEmployee', function(req, res, next) {
  course.find(function(err, allCourses) {
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
        let now = new Date();
        res.render('employee/manageEmployees/manageEmployeeIndex', {
          searchBy: "First Names",
          allUserCourses: allUserCourses,
          allCourses: allCourses,
          users: users,

          now: now,
          title: 'Users Index' , user: req.user
        });
      }).sort({surName: 'asc'}).exec(function(err, docs) {  });
    });
  });
});


//------------------------------for employee Certificates------------------------------------------------


router.get('/employeeCertifications/:_id', function(req, res, next) {

  // grab id from the url
  let _id = req.params._id;
  user.findById(_id, function(err, users) {
    if (err) {

      console.log( err);
      res.render('error');
      return;
    }
    console.log( users);
    course.find(function(err, courses) {

      if (err) {
        console.log(err);
        res.end(err);
        return;
      }

      res.render('employee/manageEmployees/cert', {
        users: users,
        uid: users._id,
        courses: courses,
        expiry: Date.now(),
        coursename: null,
        expires: true,
        takenOn: 0000-00-00,
        edit: false,
        title: '' , user: req.user
      });
    });
  });
});

router.get('/employeeCertifications/:user_id/:course_id', function(req, res, next) {

  // grab id from the url
  let _id = req.params.user_id;
  let course_id = req.params.course_id;
let dateTakenLocal;
let expiryLocal;
  userCourse.findById(course_id, function(err, userCourse) {
    if (err) {

      console.log( err);
      res.render('error');

      return;
    }
    console.log( userCourse);
    user.findById(_id, function(err, users) {
      if (err) {
        console.log( err);
        res.render('error');
        return;
      }
      console.log( users);
      course.find(function(err, courses) {

        if (err) {
          console.log(err);
          res.end(err);
          return;
        }

let dateTakenLocal = null;
let expiryLocal = null;
if(userCourse.takenOn != null)
{

     dateTakenLocal = userCourse.takenOn.toISOString().substr(0, 10);
}

if(userCourse.expiry != null)
{
    expiryLocal = userCourse.expiry.toISOString().substr(0, 10);
}

        let expiresBool = userCourse.expires;

        if(userCourse.coursename)

        console.log(dateTakenLocal, "***" ,expiryLocal );
        res.render('employee/manageEmployees/cert', {
          users: users,
          uid: users._id,
          courses: courses,
          expiry: userCourse.expiry,
          coursename: userCourse.coursename,
          expires:  expiresBool,
          expiry:  expiryLocal,
          takenOn: dateTakenLocal,
          edit: true,
          title: 'Departments Index' , user: req.user
        });
      });
    });
  });
});

router.post('/employeeCertifications/:_id', certPhoto.single("certphoto"), function(req, res, next) {

  console.log(" coursename      " + req.body.coursename);
  console.log("expiresCheckBox      " + req.body.expiresCheckBox);
  console.log("expiry      " + req.body.expiry);
  console.log("takenDate      " + req.body.takenDate);


  let expirescheckboxVar;
  if(req.body.expiresCheckBox == undefined)
  {
    expirescheckboxVar = false
  }
  else if(req.body.expiresCheckBox == "on")
  {
    expirescheckboxVar = true
  }

  console.log("expirescheckboxVar     " + expirescheckboxVar);



  // grab id from url
  let user_id = req.params._id;

  userCourse.find({ 'userid' :  user_id },function(err, selectedUsersCourses) {

    if (err) {
      console.log(err);
      res.end(err);
      return;
    }
    console.log(selectedUsersCourses.length + "   " + selectedUsersCourses);

    if(selectedUsersCourses.length != 0)
    {
      console.log("in if");

      for (let i=0; i < selectedUsersCourses.length; i++) {
        console.log("in for");
        if(req.body.coursename == selectedUsersCourses[i].coursename)
        {
          let updatedUserCourse;

          if(expirescheckboxVar == true){
            updatedUserCourse = new userCourse({
              _id: selectedUsersCourses[i]._id,
              userid: user_id,
              coursename: req.body.coursename,
              expires: expirescheckboxVar,
              expiry: req.body.expiry,
              takenOn:req.body.takenDate,
              photourl : req.file.filename
            });
            console.log("populated new model from if ");
            userCourse.update({ _id: selectedUsersCourses[i]._id }, updatedUserCourse,  function(err) {
              if (err) {
                console.log("from update" + err);
                res.render('error');
                return;
              }
              console.log("after update");
  res.redirect('/employeeDashboard/manageEmployee');
            });
          }
          else if(expirescheckboxVar != true){
            updatedUserCourse = new userCourse({
              _id: selectedUsersCourses[i]._id,
              userid: user_id,
              coursename: req.body.coursename,
              expires: expirescheckboxVar,
              expiry: '',
              takenOn:req.body.takenDate,
              photourl : req.file.filename
            });
            console.log("populated new model from else ");

            userCourse.update({ _id: selectedUsersCourses[i]._id }, updatedUserCourse,  function(err) {
              if (err) {
                console.log("from update" + err);
                res.render('error');
                return;
              }
              console.log("after update");
              res.redirect('/employeeDashboard/manageEmployee');
            });
          }




          console.log("before return");
          return;
        }

      }
      console.log("before next()");

    }
    if(typeof req.file != undefined)
    {
      if(expirescheckboxVar == true){
        console.log("if******expirescheckboxVar == true){");
  userCourse.create(
          {
            userid: user_id,
            coursename: req.body.coursename,
            expires: expirescheckboxVar,
            expiry: req.body.expiry,
            takenOn:req.body.takenDate,
  photourl : req.file.filename


});}
        else if(expirescheckboxVar != true){

          userCourse.create(
            {
              userid: user_id,
              coursename: req.body.coursename,
              expires: expirescheckboxVar,
              expiry: '',
              takenOn:req.body.takenDate,
              photourl : req.file.filename

            });
          }
    }
    if(typeof req.file == undefined)
    {
      if(expirescheckboxVar == true){
        console.log("if******expirescheckboxVar == true){");


        userCourse.create(
          {
            userid: user_id,
            coursename: req.body.coursename,
            expires: expirescheckboxVar,
            expiry: req.body.expiry,
            takenOn:req.body.takenDate,



        });}
        else if(expirescheckboxVar != true){

          userCourse.create(
            {
              userid: user_id,
              coursename: req.body.coursename,
              expires: expirescheckboxVar,
              expiry: '',
              takenOn:req.body.takenDate,


            });
          }
    }

        res.redirect('/employeeDashboard/manageEmployee');
      });
    });

    router.post('/employeeCertifications/:_id/:course_id', certPhoto.single("certphoto"), function(req, res, next) {

      console.log(" coursename      " + req.body.coursename);
      console.log("expiresCheckBox      " + req.body.expiresCheckBox);
      console.log("expiry      " + req.body.expiry);
      console.log("takenDate      " + req.body.takenDate);


      let expirescheckboxVar;
      if(req.body.expiresCheckBox == undefined)
      {
        expirescheckboxVar = false
      }
      else if(req.body.expiresCheckBox == "on")
      {
        expirescheckboxVar = true
      }

      console.log("expirescheckboxVar     " + expirescheckboxVar);




      // grab id from url
      let user_id = req.params._id;

      userCourse.find({ 'userid' :  user_id },function(err, selectedUsersCourses) {

        if (err) {
          console.log(err);
          res.end(err);
          return;
        }
        console.log(selectedUsersCourses.length + "   " + selectedUsersCourses);

        if(selectedUsersCourses.length != 0)
        {
          console.log("in if");

          for (let i=0; i < selectedUsersCourses.length; i++) {
            console.log("in for");
            if(req.body.coursename == selectedUsersCourses[i].coursename)
            {


  let localPhotoUrl;
              if(req.file == undefined)
              {
                if (selectedUsersCourses[i].photourl) {
                  localPhotoUrl = selectedUsersCourses[i].photourl;
                }
                if (!selectedUsersCourses[i].photourl) {
                  localPhotoUrl = "";
                }

              }
              else{
                  localPhotoUrl = req.file.filename == undefined
              }
              let updatedUserCourse;

              if(expirescheckboxVar == true){
                updatedUserCourse = new userCourse({
                  _id: selectedUsersCourses[i]._id,
                  userid: user_id,
                  coursename: req.body.coursename,
                  expires: expirescheckboxVar,
                  expiry: req.body.expiry,
                  takenOn:req.body.takenDate,
                  photourl : localPhotoUrl
                });
                console.log("populated new model from if ");
                userCourse.update({ _id: selectedUsersCourses[i]._id }, updatedUserCourse,  function(err) {
                  if (err) {
                    console.log("from update" + err);
                    res.render('error');
                    return;
                  }
                  console.log("after update");
  res.redirect('/employeeDashboard/manageEmployee');
                });
              }
              else if(expirescheckboxVar != true){
                updatedUserCourse = new userCourse({
                  _id: selectedUsersCourses[i]._id,
                  userid: user_id,
                  coursename: req.body.coursename,
                  expires: expirescheckboxVar,
                  expiry: '',
                  takenOn:req.body.takenDate,
                  photourl : localPhotoUrl
                });
                console.log("populated new model from else ");

                userCourse.update({ _id: selectedUsersCourses[i]._id }, updatedUserCourse,  function(err) {
                  if (err) {
                    console.log("from update" + err);
                    res.render('error');
                    return;
                  }
                  console.log("after update");
                    res.redirect('/employeeDashboard/manageEmployee');
                });
              }




              console.log("before return");
              return;
            }

          }
          console.log("before next()");

        }


            res.redirect('/employeeDashboard/manageEmployee');
          });
        });


    router.get('/viewEmployeeCertifications/:_id', function(req, res, next) {


      // grab id from the url
      let _id = req.params._id;
      user.findById(_id, function(err, users) {
        if (err) {
          console.log(err);
          res.render('error');
          return;
        }

        userCourse.find({ 'userid' :   _id }, function(err, userCourses) {
          if (err) {
            console.log(err);
            res.render('error');
            return;
          }


          res.render('employee/manageEmployees/viewemployeecertifications', {
            users: users,
            userCourses: userCourses,
            title: 'Departments Index' , user: req.user
          });
        });
      });
    });

    router.get('/viewEmployeeCertifications/delete/:_id/:user_id', function(req, res, next) {
      console.log(req.params);
      let _id = req.params._id;
      let user_id = req.params.user_id;
      userCourse.remove({ _id: _id }, function (err, departments) {
        if (err)
        {
          console.log(err);
          res.render('error');
          return;
        }
        res.redirect('/employeeDashboard/viewEmployeeCertifications/' + user_id);
      });
    });



    router.get('/viewEmployeeCertifications/viewImage/:photourl', function(req, res, next) {
      let photourl = req.params.photourl;

      //if theres a matchid id, load the edit page for that department
      res.render('employee/manageEmployees/viewCertificateImage', {
        photourl: photourl,
        title: 'View Image' , user: req.user
      });
    });

    module.exports = router;
