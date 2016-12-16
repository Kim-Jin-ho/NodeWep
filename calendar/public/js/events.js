$(document).ready(function()
{
  $.get('/events').done(function(data)
  {
    $('#calendar').fullCalendar(
    {
      header: {left : 'today prev,next', right:'agendaDay,agendaWeek,month'},
      events : data,
      select : function(start, end){}
    })
  })
})
