var express = require('express');
var mongoose = require('mongoose');
var app = express();

var bodyParser = require('body-parser');

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


var eventSchema = mongoose.Schema(
{
  title: String,
  start: String,
  end: String,
  password:String
});

var Events = mongoose.model('event',eventSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static('public/js'));


// 모든 이벤트 목록 반환
app.get('/events', (req, res, next) =>
{
  Events.find({}, (err, collection) =>
  {
    res.send(collection);
  });
});

// 이벤트 생성
app.post('/events', (req, res, next) =>
{
  (new Events(req.body)).save( (err,event) => res.send(event));
});

// start server
// 서버 실행 하기
// 정상적으로 실행되면 로그 출력
var port = process.env.PORT || 3000;    // 포트번호 = 3000
app.listen(port, function()
{
  console.log('서버가 구동되었습니다.');
});
