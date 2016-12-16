var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");

// 사용자 정보 스키마 정의
var userSchema = mongoose.Schema(
{
  email: {type:String, required:true, unique:true},
  nickname: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  createdAt: {type:Date, default:Date.now}
});

userSchema.pre("save", hashPassword);
userSchema.pre("findOneAndUpdate", function hashPassword(next)
{
  console.log(this._update);
  var user = this._update;
  if(!user.newPassword){
    delete user.password;
    return next();
  } else {
    // 사용자가 입력한 패스워드를
    // 암호화하여 hash 코드로 만들기.
    user.password = bcrypt.hashSync(user.newPassword);
    return next();
  }
});

// 사용자 패스워드 암호화 함수 정의
userSchema.methods.authenticate = function (password)
{
  var user = this;
  return bcrypt.compareSync(password,user.password);
};
userSchema.methods.hash = function (password)
{
  return bcrypt.hashSync(password);
};
var User = mongoose.model('user',userSchema);

module.exports = User;

function hashPassword(next){
  console.log("hi");
  var user = this;
  if(!user.isModified("password")){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
}
