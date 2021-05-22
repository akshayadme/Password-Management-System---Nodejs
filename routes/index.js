var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var jwt = require('jsonwebtoken');
var userModel = require('../modules/user');
var passCatModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
const {
  check,
  validationResult
} = require('express-validator');

var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
//middleware for check user is login
function checkLoginUser(req, res, next) {
  var userToken = localStorage.getItem('userToken');
  try {
    if (req.session.userID) {
      var decode = jwt.verify(userToken, 'loginToken');
    } else {
      res.redirect('/')

    }
  } catch (err) {
    res.redirect('/')
  }
  next();
}

//middleware for email checking
function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexistemail = userModel.findOne({
    email: email
  });
  checkexistemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', {
        title: 'Password Management System',
        msg: 'Email Already Exist'
      });
    }
    next();
  });
}

//middleware for username checking
function checkUsername(req, res, next) {
  var uname = req.body.uname;
  var checkexistname = userModel.findOne({
    username: uname
  });
  checkexistname.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('signup', {
        title: 'Password Management System',
        msg: 'Username Already Exist'
      });
    }
    next();
  });
}

/* login page. */
router.get('/', function(req, res, next) {
  var loginUser = req.session.userID;
  if (req.session.userID) {
    res.redirect('./dashboard');
  } else {
    res.render('index', {
      title: 'Password Management System',
      msg: ''
    });
  }
});


router.post('/', function(req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModel.findOne({
    username: username
  });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render('index', {
        title: 'Password Management System',
        msg: 'Invalid Username & password'
      });
    } else {
      if (err) throw err;
      var getUserID = data._id;
      var getPassword = data.password;
      if (bcrypt.compareSync(password, getPassword)) {
        var token = jwt.sign({
          userID: 'getUserID'
        }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        req.session.userID = username;
        res.redirect('/dashboard');
      } else {
        res.render('index', {
          title: 'Password Management System',
          msg: 'Invalid Username & password'
        });
      }
    }
  });
});

// Signup page
router.get('/signup', function(req, res, next) {
  var loginUser = req.session.userID;
  if (req.session.userID) {
    res.redirect('./dashboard');
  } else {
    res.render('signup', {
      title: 'Password Management System',
      msg: ''
    });
  }
});

router.post('/signup', checkEmail, checkUsername, function(req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;

  if (password != cpassword) {
    res.render('signup', {
      title: 'Password Management System',
      msg: 'Password Does not Match,'
    });
  } else {
    password = bcrypt.hashSync(password, 10);
    var userDetails = new userModel({
      username: username,
      email: email,
      password: password
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('signup', {
        title: 'Password Management System',
        msg: 'User Registration Successful'
      });
    });
  }
});

//logout
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      res.redirect('/')
    }
  });
  res.redirect('/')
});


module.exports = router;