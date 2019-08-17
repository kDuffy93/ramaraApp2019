var express = require('express');
var router = express.Router();
// require passport for authentication on all routes in the index
let passport = require('passport');
let user = require('../models/users');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;
var department = require ('../models/department');
let course = require('../models/course');
let userCourse = require('../models/usercourses');
let plm = require('passport-local-mongoose');
var courseType = require ('../models/courseType');
let multer = require('multer');

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

  router.use( function(req, res, next) {
  if(!req.user){

    req.session.messages =["You must be logged-in to view this page"];
    req.session.messages1 = ["please enter you're credentials below"];
    res.redirect('/login')
  }
  next();
    });
// authenticates all routes in this view
  function isLoggedIn(req, res, next) {
  // user is logged, so call the next function
  if (req.isAuthenticated()) {
     return next(); // user is logged, so call the next function

  }


console.log('redirected from external function');
req.session.messages =["You must be logged-in to view this page"];
  req.session.messages1 = ["please enter you're credentials below"];
   res.redirect('/login'); // not logged in so redirect to home
}

var certIcon = multer({

  dest:  'public/images/certificateIcons',
   filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }

});

/* GET home page. */
router.get('/', isLoggedIn,  function(req, res, next) {

  res.render('userManagment', { title: 'User Managment Dashboard',
  user: req.user});

});

//------------------------------for course------------------------------------------------


router.get('/certificatesDashboard', function(req, res, next) {
res.render('certificatesDashboard', { title: 'Certificates Dashboard', user: req.user });
});

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
           res.redirect('/userManagment/course');

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
           res.redirect('/userManagment/course');

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
res.redirect('/userManagment/course');
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
           res.redirect('/userManagment/courseType');

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
           res.redirect('/userManagment/courseType');

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
      res.redirect('/userManagment/courseType');
   });

});






//------------------------------for users------------------------------------------------


router.get('/Users', function(req, res, next) {
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
        res.render('userManagment/user/users', {
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
router.get('/Users/add', function(req, res, next) {
  department.find(function(err, departments) {
    if (err) {
      console.log(err);
      res.end(err);
      return;
    }
    res.render('userManagment/user/add', {
      departments: departments,
      title: 'Add User',
      user: req.user
    });
  });

});
router.post('/Users/add', function(req, res, next) {
  let lowerusername = req.body.username.toLowerCase();
  user.register(new user(
    {
      username: lowerusername,
      firstName : req.body.firstName,
      surName : req.body.surName,
      departmentname :  req.body.departmentname,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      changepassword: true
    }),
    req.body.password, function (err, departments)
    {
      if (err)
      {
        console.log(err);
        res.render('error'), { title: 'create new employee error'};
        return;
      }
      res.redirect('/userManagment/Users');
    });
});

router.get('/Users/:_id', function(req, res, next) {

    // grab id from the url
    let _id = req.params._id;
    department.find(function(err, departments) {

      if (err) {
        console.log(err);
        res.end(err);
        return;
      }


      // use mongoose to find the selected book
      user.findById(_id, function(err, userInfo) {
        if (err) {
          console.log(err);
          res.render('error');
          return;
        }

        var dptName = userInfo.departmentname;
        res.render('userManagment/user/edit', {
          user: userInfo,
          departments: departments,
          title: 'Edit User',
          dptName: dptName
        });
      });
    });

});

// post for register / add new employee

router.post('/Users/:_id', function(req, res, next) {

    // grab id from url
    let _id = req.params._id;
    let lowerusername = req.body.username.toLowerCase();

    if(req.body.password != "")
    {
      if(req.body.password == req.body.confirm)
      {

        user.findById( _id, function(err, user) {
          if (!user) {
            req.flash('error', 'no user with that name');
            return res.redirect('back');
          }


          user.username= lowerusername;
          user.firstName = req.body.firstName;
          user.surName = req.body.surName;
          user.departmentname = req.body.departmentname;
          user.email= req.body.email;
          user.phonenumber= req.body.phonenumber;
          user.changepassword = true;
          console.log(user);
          user.setPassword(req.body.password, function(){


            user.save(function(err) {

              res.redirect('/userManagment/Users');
            });
          });
        });
      }
    }
    else {
      user.findById( _id, function(err, user) {
        if (!user) {
          req.flash('error', 'no user with that name');
          return res.redirect('back');
        }


        user.username= lowerusername;
        user.firstName = req.body.firstName;
        user.surName = req.body.surName;
        user.departmentname = req.body.departmentname;
        user.email= req.body.email;
        user.phonenumber= req.body.phonenumber;

        user.save(function(err) {
          res.redirect('/userManagment/Users');
        });
      });
    }


});

router.get('/Users/delete/:_id', function(req, res, next) {

    let _id = req.params._id;
    user.remove({ _id: _id }, function (err, departments) {
      if (err)
      {
        console.log(err);
        res.render('error');
        return;
      }
      res.redirect('/userManagment/Users');
    });
});




//------------------------------for departments------------------------------------------------

// when the router gets a request at this get, load the departments homepage and pass in an array of departments
router.get('/department', function(req, res, next) {
   department.find(function(err, departments) {
      if (err) {
         console.log(err);
         res.end(err);
         return;
      }
      res.render('userManagment/department/departmentIndex', {
         departments: departments,
         title: 'Departments Index' , user: req.user
      });
   });
});

// load the add a department page upon get reuqest
router.get('/department/add', function(req, res, next) {
 res.render('userManagment/department/add', {
         title: 'Add Department' , user: req.user
 });
});

// add the new department to the database assuming it meets validation critera when the router gets a post
router.post('/department/add', function(req, res, next) {
  department.create(
    {
        departmentname : req.body.departmentname
     }, function (err, departments)
        {
          if (err)
          {
              console.log(err);
              res.render('error');
              return;
          }
           res.redirect('/userManagment/department');
    });
});

// remove the department with a matching _id from the database
router.get('/department/delete/:_id', function(req, res, next) {
    let _id = req.params._id;
   department.remove({ _id: _id }, function (err, departments) {
          if (err)
          {
              console.log(err);
              res.render('error');
              return;
          }
           res.redirect('/userManagment/department');
    });
  });

// when the router gets a request at edit department it needs to get the id paramater of hte selected department from the querystring
// search the departments table for a matching record
// then load the edit page and pass the values to the view
router.get('/department/:_id', function(req, res, next) {
   let _id = req.params._id;
   department.findById(_id, function(err, department) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      //if theres a matchid id, load the edit page for that department
      res.render('userManagment/department/edit', {
         department: department,
         title: 'Edit Department' , user: req.user
      });
   });

});

// runs when the server gets a post request from the edit department table
router.post('/department/:_id', function(req, res, next) {
   let _id = req.params._id;
  // populate a local department object to update with
   let Department = new department({
      _id: _id,
      departmentname : req.body.departmentname
    });

   // update the department record with the new values
   department.update({ _id: _id }, Department,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/userManagment/department');
   });
});






module.exports = router;
