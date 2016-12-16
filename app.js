var express  = require('express');
var app      = express();
var path     = require('path');
var mongoose = require('mongoose');
var session  = require('express-session');
var flash    = require('connect-flash');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');

// database
// Mongodb 접속 설정
// process.env.MONGO_DB -> 환경 변수에 설정된 Mongodb 주소로 connect
mongoose.connect(process.env.MONGO_DB);

// db에 connection 객체 담기
var db = mongoose.connection;

// connection 객체안의 once, on 함수 실행
// DB가 정상적으로 연결되었을 시 로그 출력
db.once("open",function ()
{
  console.log("DB 연결되었습니다.");
});

// DB 연결도중 에러 발생 시 로그 출력
db.on("error",function (err)
{
  console.log("DB ERROR :", err);
});

// view engine
// EJS 파일 세팅
app.set("view engine", 'ejs');

// middlewares
// app.use 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:'MySecret'}));
app.use(countVisitors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static('public'));

// passport
// passport 설정
var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// routes
// route 설정
// 사용자로부터 주소로 입력되는 값을 받아와
// route에 매핑 시켜 처리
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));


// 일정관리
// app.use('/events',require('./routes/events'));

// start server
// 서버 실행 하기
// 정상적으로 실행되면 로그 출력
var port = process.env.PORT || 3000;    // 포트번호 = 3000
app.listen(port, function()
{
  console.log('서버가 구동되었습니다.');
});

// cookie 설정 함수
function countVisitors(req,res,next)
{
  if(!req.cookies.count&&req.cookies['connect.sid']){
    res.cookie('count', "", { maxAge: 3600000, httpOnly: true });
    var now = new Date();
    var date = now.getFullYear() +"/"+ now.getMonth() +"/"+ now.getDate();
    if(date != req.cookies.countDate){
      res.cookie('countDate', date, { maxAge: 86400000, httpOnly: true });

      var Counter = require('./models/Counter');
      Counter.findOne({name:"vistors"}, function (err,counter) {
        if(err) return next();
        if(counter===null){
          Counter.create({name:"vistors",totalCount:1,todayCount:1,date:date});
        } else {
          counter.totalCount++;
          if(counter.date == date){
            counter.todayCount++;
          } else {
            counter.todayCount = 1;
            counter.date = date;
          }
          counter.save();
        }
      });
    }
  }
  return next();
}
