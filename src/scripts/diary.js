var moment = require('moment');
var markdown = require("markdown").markdown;
var xhr = require('./plugins/promiseXHR');
var util = require('./util');
var config = require('../../config'),
    http_url = config.http_url;


(function () {
    'use strict';
    var defaults = {
        element: document.getElementById('container'),
        title: document.getElementById('title'),
        content: null,
        name: 'markdown',
        id: '0',
    };
    var template = "<div class='diary'>"+
                    "<div class='nav'><button class='prev'><<</button><button class='next' >>></button></div>"+
                    "<div id='markdown'></div>"+
                    "<div class='index'><a href='/'>Index</a></div>"+
                    "<div id='duoshuo'></div>"+
                    "</div>";
    var Diary = function (options) {
        var self = this;
        self.data = defaults;
        self.template = template;
    }

    Diary.prototype = {
        layout: function (date, dates) {
            var self = this,
                options = self.data,
                template = self.template;
            // init template
            options.element.innerHTML = template;
            options.title.innerHTML = date;
            //init data
            //change time
            var time = /[^.md]+/.exec(date) + "";
            if (Object.getOwnPropertyDescriptor(dates, time) != undefined) {
                var value = moment(time).format('YYYY/MM/YYYY-MM-DD') + '.md';
                //get markdown to html
                self.loadMarkdown(value, self.markdown);
                self.bindEvent(date, dates);
            };

        },
        bindEvent:function(date, dates){
            var self = this,
                options = self.data;
            var prev = options.element.querySelector('.prev');
            var next = options.element.querySelector('.next');
            util.delegateEvent('click', prev, self.getPrev, {date:date, dates:dates});
            util.delegateEvent('click', next, self.getNext, {date:date, dates:dates});

        },
        loadMarkdown: function (param) {
            var self = this,
                task = {},
                path = http_url;
            var task = xhr('GET', path + param)
                .then(response => {
                    var data = response;
                    self.markdown(data);
                });
            return task;
        },

        //得到前一个md
        getPrev: function (params) {
            var self = this;
            var date = new Date(params.date),
                dates = params.dates;
            date.setDate(date.getDate() - 1);
            var time = date.toJSON().slice(0, 10);
            if (Object.getOwnPropertyDescriptor(dates, time) != undefined) {
                window.location.hash = '/'+time;
            } else {
                self.getPrev(time);
            }
        },

        //得到下一个md
        getNext: function (params) {
            var self = this;
            var date = new Date(params.date),
                dates = params.dates;
            date.setDate(date.getDate() + 1);
            var time = date.toJSON().slice(0, 10);
            if (Object.getOwnPropertyDescriptor(dates, time) != undefined) {
                window.location.hash = '/'+time;
            } else {
                self.getNext(time);
            }
        },
        markdown: function (data) {
            var self = this,
                options = self.data;
            //this.element.innerHTML = markdown.toHTML(highlightCode(data));
            options.element.querySelector('#markdown').innerHTML = markdown.toHTML(data);
            options.element.querySelector('#duoshuo').innerHTML = '<div data-thread-key="'+options.id+'" data-title="'+options.name+'" data-url="'+window.location.href+'" class="ds-thread"></div>';
        }
    }
    module.exports = Diary;
})();
