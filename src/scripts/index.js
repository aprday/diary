var Calendar = require('./calendar');
var Diary = require('./diary');
var Route = require('./plugins/router');
var util = require('./util');

window.addEventListener('load', function () {
    //
    //
    app.layout();

});

function route() {
    var url = location.hash;
    console.log(location);
    location.hash = 'module3/fuck';
    Route.init({
        'module1': function () {
            console.log(1);
        },
        'module2/:name/:age': function () {
            console.log(2, arguments);
        },
        'module3(/:name)(/:age)': function () {
            console.log('3', arguments);
        },
        '*': function () {
            console.log(404);
        }
    });
}
var app ={

  dates:{},
  diary: new Diary(),
  calendar: new Calendar(),

  layout:function(calendar, diary, dates) {
      var self = this;
      if(!(calendar||diary||dates)){
          calendar = self.calendar;
          diary = self.diary;
      }
      var task = calendar.loadJson();
      task.trunk.then(function(response){
          Promise.all(task.brunchs).then(function(response){
              console.log('now we have the response',response);
              var array =[];
              for(var i = 0; i < response.length; i++){
                  console.log('what the array', response[i]);
                  array = array.concat(response[i]=== undefined?[]:response[i]);
              }
              self.dates = calendar.generateDate(array) || {};
              console.log('get some dates',self.dates);
              self.route(calendar, diary, self.dates);
          });
      });
  },
  route :function(calendar,diary, dates){
    var url = location.hash;
    console.log(dates);
    Route.init({
        'index': function () {
            console.log(index);
            calendar.layout(dates);
        },
        '(/:date)': function () {
            console.log(arguments,location.hash.match(/[0-9].*/));
            var date = location.hash.match(/[0-9].*/);
            diary.layout(date, dates);
        },
        '*': function () {
            console.log("*");
            calendar.layout(dates);
        }
    });
  }
}


function getButtonByDate(buttons, date) {
    var year, month, day;
    var targetYear = date.getFullYear(),
        targetMonth = date.getMonth(),
        targetDay = date.getDate();
    for (var i = 0; i < buttons.length; ++i) {
        year = parseInt(buttons[i].getAttribute('data-pika-year'));
        month = parseInt(buttons[i].getAttribute('data-pika-month'));
        day = parseInt(buttons[i].getAttribute('data-pika-day'));
        if (year === targetYear && month === targetMonth
            && day === targetDay) {
            return buttons[i];
        }
    }
}
