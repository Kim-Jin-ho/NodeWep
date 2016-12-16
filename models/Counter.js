var mongoose = require('mongoose');

// 페이지 방문자 카운트 스키마정의
var counterSchema = mongoose.Schema(
{
  name: {type:String, required:true},
  totalCount: {type:Number, required:true},
  todayCount: {type:Number},
  date: {type:String}
});

var Counter = mongoose.model('counter',counterSchema);
module.exports = Counter;
