var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var User     = require('../models/User');
var async    = require('async');

router.get('/new', function(req,res)
{
  res.render('users/new', {
                            formData: req.flash('formData')[0],
                            emailError: req.flash('emailError')[0],
                            nicknameError: req.flash('nicknameError')[0],
                            passwordError: req.flash('passwordError')[0]
                          }
  );
}); // new
router.post('/', checkUserRegValidation, function(req,res,next)
{
  User.create(req.body.user, function (err,user)
  {
    if(err) return res.json({success:false, message:err});
    req.flash("loginMessage","회원가입이 되었습니다.");
    res.redirect('/login');
  });
}); // create
router.get('/:id', isLoggedIn, function(req,res)
{
    User.findById(req.params.id, function (err,user)
    {
      if(err) return res.json({success:false, message:err});
      res.render("users/show", {user: user});
    });
}); // show
router.get('/:id/edit', isLoggedIn, function(req,res)
{
  if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});
  User.findById(req.params.id, function (err,user)
   {
    if(err) return res.json({success:false, message:err});
    res.render("users/edit", {
                              user: user,
                              formData: req.flash('formData')[0],
                              emailError: req.flash('emailError')[0],
                              nicknameError: req.flash('nicknameError')[0],
                              passwordError: req.flash('passwordError')[0]
                             }
    );
  });
}); // edit
router.put('/:id', isLoggedIn, checkUserRegValidation, function(req,res)
{
  if(req.user._id != req.params.id) return res.json({success:false, message:"Unauthrized Attempt"});
  User.findById(req.params.id, function (err,user)
  {
    if(err) return res.json({success:"false", message:err});
    if(user.authenticate(req.body.currentPassword))
    {
      if(req.body.user.newPassword)
      {
        req.body.user.password = user.hash(req.body.user.newPassword);
      }
      User.findByIdAndUpdate(req.params.id, req.body.user, function (err,user)
      {
        if(err) return res.json({success:"false", message:err});
        res.redirect('/users/'+req.params.id);
      });
    } else
    {
      req.flash("formData", req.body.user);
      req.flash("passwordError", "잘못된 비밀번호입니다.");
      res.redirect('/users/'+req.params.id+"/edit");
    }
  });
}); //update

function isLoggedIn(req, res, next)
{
  if (req.isAuthenticated())
  {
    return next();
  }
  res.redirect('/');
}

function checkUserRegValidation(req, res, next)
 {
  var isValid = true;

  async.waterfall(
    [function(callback)
      {
      User.findOne({email: req.body.user.email, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user)
        {
          if(user){
            isValid = false;
            req.flash("emailError","이미 사용중인 E-mail 입니다.");
          }
          callback(null, isValid);
        }
      );
    }, function(isValid, callback)
    {
      User.findOne({nickname: req.body.user.nickname, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err,user)
        {
          if(user){
            isValid = false;
            req.flash("nicknameError","이미 사용중인 별명입니다.");
          }
          callback(null, isValid);
        }
      );
    }], function(err, isValid)
    {
      if(err) return res.json({success:"false", message:err});
      if(isValid)
      {
        return next();
      } else {
        req.flash("formData",req.body.user);
        res.redirect("back");
      }
    }
  );
}

module.exports = router;
