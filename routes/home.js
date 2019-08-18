var express = require('express');
var router = express.Router();

let passport = require('passport');
let User = require('../models/users');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;






/* GET home page. */
router.get('/',   function(req, res, next) {

  if(req.user != undefined)
  {
    if(req.user.changepassword == true){
      res.redirect('/firstlogin')

    }
    if(req.user._id == "5b1a8cee8d7ed00020a30a4f" || req.user._id == "58f518ff43a6d491cc0a3274")
    {
      res.render('home', { title: 'Ramara Certificates Home',
      user: req.user});
    }
    else{
        res.redirect('/employeeDashboard/manageEmployee')
    }

  }


      res.render('home', { title: 'Ramara Certificates Home',
      user: req.user});


});

router.get('/firstlogin',   function(req, res, next) {

    res.render('firstlogin', { title: 'Please Change Your Password',
    user: req.user});

});


router.post('/firstlogin', function(req, res, next) {
 let _id = req.user._id;
console.log(_id);
 User.findById( _id, function(err, user) {
      if (!user) {
        req.flash('error', 'no user with that name');
        return res.redirect('back');
      }
      user.changepassword = false;
      user.setPassword(req.body.password, function(){


               user.save(function(err) {

           res.redirect('/');
           });
               });
 });
      });





function usernameToLowerCase(req, res, next){
  if(req.body.username != undefined)
  {


    req.body.username = req.body.username.toLowerCase();
    next();
  }
  else{
    next();
  }
}
/* GET login */
router.get('/login', function(req, res, next) {

  let messages = req.session.messages || [];
  let messages1 = req.session.messages1 || [];
    let returnURL = req.session.returnURL || [] ;


  req.session.messages = [];
  req.session.messages1 = [];

  res.render('login', {
    title: 'Please Login',
    messages: messages,
    messages1: messages1,
    returnURL: returnURL,
    user: null
  });

});


// post @ login
router.post('/login',usernameToLowerCase,
  passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
    failureMessage: 'Invalid Login'
  })
);
//}

//});


router.get('/logout', function(req, res, next) {
req.logout();
 res.redirect('/');
})


module.exports = router;
