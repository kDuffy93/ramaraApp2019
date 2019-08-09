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


router.get('/manageEmployees/delete/:_id', function(req, res, next) {

    let _id = req.params._id;
    user.remove({ _id: _id }, function (err, departments) {
      if (err)
      {
        console.log(err);
        res.render('error');
        return;
      }
      res.redirect('/employeeDashboard/manageEmployee');
    });
});

router.get('/manageEmployees/:_id', function(req, res, next) {

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
        res.render('employee/manageEmployees/edit', {
          user: userInfo,
          departments: departments,
          title: 'Edit User',
          dptName: dptName
        });
      });
    });

});

// post for register / add new employee

router.post('/manageEmployees/:_id', function(req, res, next) {

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

              res.redirect('/employeeDashboard/manageEmployee');
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
          res.redirect('/employeeDashboard/manageEmployee');
        });
      });
    }


});
