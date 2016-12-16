var mongoose = require('mongoose');

var eventSchema = mongoose.Schema(
{
  title: String,
  start: String,
  end: String,
  password:String
});

var Events = mongoose.model('calendar',eventSchema);
module.exports = Events;
