var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var passport = require('../config/passport.js');

// 인덱스 페이지 접근 시 처리할 route
router.get('/', function (req,res)
{
  res.redirect('/posts');
});

// login 페이지 접근시 처리할 route
router.get('/login', function (req,res)
{
  res.render('login/login',{email:req.flash("email")[0], loginError:req.flash('loginError'), loginMessage:req.flash('loginMessage')});
});

// login 페이지 접근 후 로그인 성공유무를 처리할 route
router.post('/login', passport.authenticate('local-login',
{
    // 정상적으로 로그인이 됬을 시 /posts 로 redirect 시킴
    successRedirect : '/posts',
    // 로그인이 실패히 다시 login 으로 redirect
    failureRedirect : '/login',
    failureFlash : true
  })
);

// logout 페이지 접근 시 처리할 route
router.get('/logout', function(req, res)
{
    req.logout();
    req.flash("postsMessage", "로그아웃 하였습니다.");
    res.redirect('/');
});

module.exports = router;
