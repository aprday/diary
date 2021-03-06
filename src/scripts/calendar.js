var moment = require('moment');
var Pikaday = require('./plugins/pikaday');
var xhr = require('./plugins/promiseXHR');
var Promise = require('./plugins/promise');
var config = require('../../config'),
    http_url = config.http_url;

(function () {
    'use strict';
    var defaults = {
        dates: [],
        firstDate: '',
        lastDate: '',
        date: {},
        element: document.getElementById('container'),
        title: document.getElementById('title')
    };
    var template = "<div id='calendar' data-last-date=last, data-first-date=first></div>";
    var Calendar = function (options) {
        var self = this;
        self.data = defaults;
        self.template = template;
        //var calendar = document.getElementById('calendar');
        //var lastDate = new Date(calendar.getAttribute('data-last-date'));
        //var firstDate = new Date(calendar.getAttribute('data-first-date'));
    }

    Calendar.prototype = {
        layout: function (dates) {
            var self = this,
                options = self.data,
                template = self.template;
            console.log(dates);
            options.element.innerHTML = template;
            options.title.innerHTML = 'My Tech Diary';
            self.render(dates);
        },
        render: function (dates) {
            var self = this,
                options = self.data,
                picker = new Pikaday({
                    dates: dates,
                    onSelect: function (date) {
                        var time = moment(date);
                        //window.location.href += time.format('/YYYY/MM/YYYY-MM-DD') + '.html';
                        // a bug of pikaday whose fix is still not released
                        if (Object.getOwnPropertyDescriptor(dates, time.format('YYYY-MM-DD')) != undefined) {
                            window.location.hash = time.format('/YYYY-MM-DD');
                        };
                    },
                    i18n: {
                        previousMonth: '&lt;&lt;',
                        nextMonth: '&gt;&gt;',
                        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                        weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    },
                    minDate: new Date(options.firstDate),
                    maxDate: new Date(options.lastDate),
                    defaultDate: new Date(options.lastDate),
                });
            console.log('options',options);
            options.element.appendChild(picker.el);

            var buttons = picker.el.getElementsByTagName('button');
            // var lastButton = getButtonByDate(buttons, lastDate);
            // util.addClass(lastButton.parentNode, 'last-update');
            document.querySelector('.pika-prev').textContent = '<<';
            document.querySelector('.pika-next').textContent = '>>';
        },
        loadJson: function () {
            var self = this,
                options = self.data,
                dates = [],
                brunchs = [],
                path = http_url,
                param = "diary.json";
            var trunk = xhr('GET', path + param)
                .then(function(response){
                    var array = response.data,
                        part = {};
                    for (var i = 0; part = array[i]; i++) {
                        param = part.url;
                        var task = xhr('GET', path + param).then(function(response){
                            // success callback
                            console.log(response.diary);
                            return response.diary === undefined?[]:response.diary;
                        });
                        brunchs.push(task);
                    };
                });
            return { trunk: trunk, brunchs: brunchs };
        },
        generateDate: function (array) {
            var self = this,
                options = self.data,
                dates = {};
            //get the last day
            options.firstDate = array[0].date;
            options.lastDate = array.reverse()[0].date;
            // put date in map
            for (var index = 0; index < array.length; index++) {
                var time = array[index].date,
                    name = array[index].name;
                //把所有的日期属性填加在map中
                if (Object.getOwnPropertyDescriptor(dates, time) == undefined) {
                    Object.defineProperty(dates, time, {
                        value: name,
                        enumerable: true,
                        configurable: false,
                        writable: false
                    });
                };
            };
            return dates;
        },

    }
    module.exports = Calendar;
})();
