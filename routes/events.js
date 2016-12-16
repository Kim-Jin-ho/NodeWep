var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

app.get('/events',(req, res, next) =>
{
  Events.find({},(err, collection) =>
  {
    res.send(collection);
  });
});

app.post('/events', (req, res, next) =>
{
  (new Events(req.body)).save((err,event) => res.send(event));
});
