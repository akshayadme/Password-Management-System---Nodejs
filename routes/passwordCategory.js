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
      res.redirect('/');

    }
  } catch (err) {
    res.redirect('/');
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

//password category
router.get('/', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  getPassCat.exec(function(err, data) {
    if (err) throw err;
    res.render('password_category', {
      title: 'Password Management System',
      loginUser: loginUser,
      records: data,
    });
  });
});
router.get('/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  var passcat_id = req.params.id;
  var getpassCategory = passCatModel.findById(passcat_id);
  getpassCategory.exec(function(err, data) {
    if (err) throw err;
    res.render('edit_pass_category', {
      title: 'Password Management System',
      loginUser: loginUser,
      errors: '',
      success: '',
      records: data,
      id: passcat_id
    });
  });
});
router.post('/edit/', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  var passcat_id = req.body.id;
  var passwordCategory = req.body.passwordCategory;
  var update_passCat = passCatModel.findByIdAndUpdate(passcat_id, {
    password_category: passwordCategory
  });
  update_passCat.exec(function(err, data) {
    if (err) throw err;
    res.redirect('/passwordCategory');
  });
});
router.get('/delete/:id', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  var passcat_id = req.params.id;
  var passdelete = passCatModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function(err) {
    if (err) throw err;
    res.redirect('/passwordCategory');
  });
});

module.exports = router;