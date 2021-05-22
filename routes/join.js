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

//view all password
router.get('/', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var perPage = 1;
  var page = 1;
  getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err, data) {
      if (err) throw err;
      passModel.countDocuments({}).exec((err, count) => {
        res.render('view-all-password', {
          title: 'Password Management System',
          loginUser: loginUser,
          records: data,
          current: page,
          pages: Math.ceil(count / perPage),
        })
      });
    });
});

router.get('/:page', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var perPage = 1;
  var page = req.params.page || 1;
  getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err, data) {
      if (err) throw err;
      passModel.countDocuments({}).exec((err, count) => {
        res.render('view-all-password', {
          title: 'Password Management System',
          loginUser: loginUser,
          records: data,
          current: page,
          pages: Math.ceil(count / perPage),
        })
      });
    });
});

module.exports = router;