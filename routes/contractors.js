var express = require('express');
var router = express.Router();
// require passport for authentication on all routes in the index
let passport = require('passport');
let User = require('../models/users');

let contractor = require('../models/contractor');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;

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
      res.end();
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
  contractor.find(function(err, allContractors) {
    if (err) {
      console.log(err);
      res.end(err);
      return;
    }
    for(var c=0; c < allContractors.length; c++)
    {
      if(allContractors[c].insurance == null)
      {
        allContractors[c].insurance = '1980-01-01T00:00:00.000Z';
      }
      if( allContractors[c].caf == null)
      {
        allContractors[c].caf = '1980-01-01T00:00:00.000Z';
      }
      if( allContractors[c].wsibExp == null)
      {
        allContractors[c].wsibExp = '1980-01-01T00:00:00.000Z';
      }
    }
  res.render('contractors/contractorsIndex', { title: 'Contractors Index',

  user: req.user,
  Contractors: allContractors
});
});
});

router.get('/add', function(req, res, next) {

    res.render('contractors/add', {

      title: 'Add New Contractor',
      user: req.user
    });


});


router.post('/add', function(req, res, next) {
console.log(req.body.contractorName);
  let contractorsName = req.body.contractorName;
    let contractorsservices = req.body.services;
    try{
    for(var i=0; i < contractorsservices.length; i++)
    {
      if(contractorsservices[i] == ""|| contractorsservices[i] == '')
      {
        contractorsservices.splice(i, 1);
      }
    }
  }
  catch(err){
    contractorsservices = "";
  }
  let contractorsphoneNumber = req.body.tel;
  let contractorsemail = req.body.email;
//for wsib
console.log(req.body.wsib);
let contractorswsib = req.body.wsib;
let contractorswsibdate = req.body.wsibExp;
let contractorsinsurance = req.body.insurance;

let contractorsAgreementForm = req.body.caf;


/*  if(req.body.wsib == "on")
  {
     contractorswsib = true;
  }
  else if(req.body.wsib  == undefined)
  {
     contractorswsib = false;
  }
//for isurance
let contractorsinsurance;
  if(req.body.insurance == "on")
  {
     contractorsinsurance = true;
  }
  else if(req.body.insurance  == undefined)
  {
     contractorsinsurance = false;
  }*/




  contractor.create(
    {
      contractorName : contractorsName,
      services : contractorsservices ,
      phoneNumber : contractorsphoneNumber,
      email : contractorsemail,
      wsib : contractorswsib,
      insurance : contractorsinsurance,
      wsibExp : contractorswsibdate,
      caf : contractorsAgreementForm
    }, function (err, contractor)
    {
      if (err)
      {
        console.log(err);
        res.render('error');
        return;
      }
      res.redirect('/contractors');

    });
  });

  router.get('/delete/:_id', function(req, res, next) {

      let _id = req.params._id;
      contractor.remove({ _id: _id }, function (err, contractors) {
        if (err)
        {
          console.log(err);
          res.render('error');
          return;
        }
        res.redirect('/contractors');
      });
  });


  router.get('/:_id', function(req, res, next) {
   // grab id from the url
   let _id = req.params._id;
   // use mongoose to find the selected book
  contractor.findById(_id, function(err, contractor) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      let insuranceLocal;
      try{
       insuranceLocal = contractor.insurance.toISOString().substr(0, 10);
      }
      catch(err)
      {
        insuranceLocal = 0;
      }
      let wsibExpLocal;
      try{
        wsibExpLocal = contractor.wsibExp.toISOString().substr(0, 10);
      }
      catch(err)
      {
        wsibExpLocal = 0;
      }
      let cafLocal;
      try{
        cafLocal = contractor.caf.toISOString().substr(0, 10);
      }
      catch(err)
      {
        cafLocal = 0;
      }



  console.log(contractor.services + contractor.services.length);
  console.log(contractor.wsibExp +"                         "+ new Date());
      res.render('contractors/edit', {
      contractor : contractor,
      insurance : insuranceLocal,
      wsibExp : wsibExpLocal,
      caf : cafLocal,
         title: 'Edit Contractor' ,
          user: req.user
      });
   });
      });



router.post('/:_id', function(req, res, next) {
let _id = req.params._id;

let contractorsName = req.body.contractorName;
let contractorsservices = req.body.services;
console.log(contractorsservices);
try{
for(var i=0; i < contractorsservices.length; i++)
{
  if(contractorsservices[i] == ""|| contractorsservices[i] == '')
  {
    contractorsservices.splice(i, 1);
  }
}
}
catch(err){
  contractorsservices = "";
}
let contractorsphoneNumber = req.body.tel;
let contractorsemail = req.body.email;
//for wsib
console.log(req.body.wsib);
let contractorswsib = req.body.wsib;

//for isurance
let contractorsinsurance= req.body.insurance;
let caf= req.body.caf;
let contractorswsibExp= req.body.wsibExp;




   // populate new book from the form
   let contractorObj = new contractor({
        _id: _id,
      contractorName : contractorsName,
      services : contractorsservices ,
      phoneNumber : contractorsphoneNumber,
      email : contractorsemail,
      wsib : contractorswsib,
        wsibExp : contractorswsibExp,
          caf : caf,
      insurance : contractorsinsurance,
   });
console.log(contractorObj);
   contractor.update({ _id: _id }, contractorObj,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
res.redirect('/contractors');
   });

});







module.exports = router;
