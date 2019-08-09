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



/* GET home page. */
router.get('/', isLoggedIn,  function(req, res, next) {

  res.render('userManagment', { title: 'User Managment Dashboard',
  user: req.user});

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
