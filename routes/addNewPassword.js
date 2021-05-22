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

//add new password page
router.get('/', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  getPassCat.exec(function(err, data) {
    if (err) throw err;
    res.render('add-new-password', {
      title: 'Password Management System',
      loginUser: loginUser,
      records: data,
      errors: '',
      success: '',
    });
  });
});

router.post('/', checkLoginUser, checkLoginUser, [check('project_name', 'Please! Enter All Fields').isLength({
  min: 1
})], function(req, res, next) {
  var loginUser = req.session.userID;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('add-new-password', {
      title: 'Password Management System',
      loginUser: loginUser,
      records: '',
      errors: errors.mapped(),
      success: '',
    });
  } else {
    var pass_cat = req.body.pass_cat;
    var pass_details = req.body.pass_details;
    var project_name = req.body.project_name;
    var password_details = new passModel({
      password_category: pass_cat,
      password_detail: pass_details,
      project_name: project_name,
    })
    password_details.save(function(err, data) {
      getPassCat.exec(function(err, data) {
        if (err) throw err;
        res.render('add-new-password', {
          title: 'Password Management System',
          loginUser: loginUser,
          records: data,
          errors: '',
          success: 'Password Details Inserted Successfully',
        });
      });
    });
  }
});

module.exports = router;