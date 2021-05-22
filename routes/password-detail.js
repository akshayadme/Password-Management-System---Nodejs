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

// password detail

router.get('/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  var id = req.params.id;
  var getPassDetails = passModel.findById({
    _id: id
  });
  getPassDetails.exec(function(err, data) {
    if (err) throw err;
    getPassCat.exec(function(err, data1) {
      res.render('edit_password_detail', {
        title: 'Password Management System',
        loginUser: loginUser,
        record: data,
        records: data1,
        success: ''
      })
    });
  });
});
router.post('/edit/:id', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  var id = req.params.id;
  var passcat = req.body.pass_cat;
  var project_name = req.body.project_name;
  var pass_details = req.body.pass_details;
  passModel.findByIdAndUpdate(
    id, {
      password_category: passcat,
      project_name: project_name,
      password_detail: pass_details
    }
  ).exec(function(err) {
    if (err) throw err;
    var getPassDetails = passModel.findById({
      _id: id
    });
    getPassDetails.exec(function(err, data) {
      if (err) throw err;
      getPassCat.exec(function(err, data1) {
        res.render('edit_password_detail', {
          title: 'Password Management System',
          loginUser: loginUser,
          record: data,
          records: data1,
          success: 'Password Updated Successfully'
        })
      });
    });
  });
});
router.get('/delete/:id', checkLoginUser, function(req, res, next) {
  var loginUser = req.session.userID;
  var id = req.params.id;
  var passdelete = passModel.findByIdAndDelete(id);
  passdelete.exec(function(err) {
    if (err) throw err;
    res.redirect('/view-all-password');
  });
});
router.get('/', checkLoginUser, function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  getAllPass.exec(function(err, data) {
    if (err) throw err;
    res.redirect('/dashboard');
  });
});

module.exports = router;