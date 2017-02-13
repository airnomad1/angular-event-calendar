'use strict';

(function () {
    Date.prototype.getMonthName = function (mIndex) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[mIndex];
    };

    Date.prototype.getDayName = function (dIndex) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dIndex];
    };

    Date.prototype.getWeek = function () {
        return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    };

    Date.prototype.getDaysInFebruary = function (year) {
        return (year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0) ? 29 : 28;
    };

    Date.prototype.daysInMonth = function (mIndex, year) {
        var daysInMonth = [31, this.getDaysInFebruary(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[mIndex];
    };
})();

(function (angular) {
    var app = angular.module('app');

    app.directive('calendar', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                events: '='
            },
            templateUrl: 'calendar.html',
            link: function (scope, elem, attr) {
                var xx = new Date('Wed Feb 01 2017 12:37:15 GMT+0530 (+0530)');
               // console.log(xx.toISOString());


                var date = new Date();
                scope.calendar = generateCalendar(date.getMonth(), date.getFullYear());
                renderHtml(elem, scope.calendar.html);

                scope.prevMonth = function () {
                    var currMonth = scope.calendar.meta.currMonth;

                    if (currMonth == 0) {
                        scope.calendar = generateCalendar(11, scope.calendar.meta.year - 1);
                        renderHtml(elem, scope.calendar.html);
                    } else {
                        scope.calendar = generateCalendar(scope.calendar.meta.currMonth - 1, scope.calendar.meta.year);
                        renderHtml(elem, scope.calendar.html);
                    }
                };

                scope.nextMonth = function () {
                    var currMonth = scope.calendar.meta.currMonth;

                    if (currMonth == 11) {
                        scope.calendar = generateCalendar(0, scope.calendar.meta.year + 1);
                        renderHtml(elem, scope.calendar.html);
                    } else {
                        scope.calendar = generateCalendar(scope.calendar.meta.currMonth + 1, scope.calendar.meta.year);
                        renderHtml(elem, scope.calendar.html);
                    }
                };

                /**
                 * go to events in selected date
                 * @param dayIndex - index of the day in 'oMeta.calendar' object
                 * **/
                scope.goToEvents = function (dayIndex) {
                    var oEventsView = generateEventsView(scope.calendar);
                    renderHtml(elem, oEventsView);
                };


                /**
                 * events in selected date
                 * @param oDay - day object that contains events array
                 * **/
                function generateEventsView(oCalendar) {
                    var oDate = new Date(oCalendar.meta.date);
                     var monthName = oDate.getMonthName(oDate.getMonth());

                    console.log(oCalendar);

                    var timeRange = getTimeRange();

                    var weeksHtml = generateMonthByWeek(oCalendar.meta.calendar);

                    var rangeHtml = '<ul>'
                    for (var i = 0; i < timeRange.length; i++) {
                        rangeHtml += '<li>' + timeRange[i] + '</li>';
                    }
                    rangeHtml += '</ul>';

                    /** <container> **/
                    var view = "<div class='event-view-container'>";
                    /** <header> **/
                    view += "<div class='header'>";
                    view += "<h3><button class='prev-button'></button>"+monthName+" "+oCalendar.meta.year+"<button class='next-button'></button></h3>";
                    view += "</div>";
                    /** </header> **/

                    /** <body> **/
                    view += "<div class='body clearfix'>";
                    view += "<button class='prev-button header-prev'></button><button class='next-button header-next'></button>"
                    view += "<div class='time-container'>";
                    view += "<h5>TIME</h5>";
                    view += rangeHtml;
                    view += "</div>";

                    view += "<div class='grid-container'>";
                    view += "<div class='grid-container-wrapper'>";
                    view += weeksHtml;
                    view += "</div>";
                    view += "</div>";

                    view += "</div>";

                    /** </body> **/
                    /** <footer> **/
                    view += "<div class='footer'>";
                    view += "<p class='inline-bl mar-rt-25'><span class='color-sq green-sq'></span>Booked</p>";
                    view += "<p class='inline-bl'><span class='color-sq yellow-sq'></span>Pending</p>";
                    view += "<p class='inline-bl flt-right'><a href='#'>Check your calender</a></p>";
                    view += "</div>";
                    /** </footer> **/

                    view += "</div>";
                    /** </container> **/

                    return view;
                }

                function generateMonthByWeek(oMonth) {
                    var weeks = '<ul>';

                    for (var i = 0; i < oMonth.length; i++) {
                        var oDate = new Date(oMonth[i].date);

                        var weekDayIndex = oDate.getDay();

                        var eventsInDay = oMonth[i].events;

                        var slots = '';

                        for (var x = 1; x < 48; x++) {
                            var inEventClass = '';

                            if(oMonth[i].hasEvents){
                                for (var z = 0; z < eventsInDay.length; z++) {
                                    var start = new Date(eventsInDay[z].start);
                                    var end = new Date(eventsInDay[z].end);
                                }

                                if (start.toDateString() == oDate.toDateString()) {

                                    if (x >= start.getHours() && x <= end.getHours()) {
                                        inEventClass = 'highlight';
                                    } else {
                                        inEventClass = '';
                                    }
                                }
                            }

                            slots += '<div class="line-wrapper"><span class="line ' + inEventClass + '"></span></div>';
                        }

                        weeks += '<li>';

                        weeks += '<h5>' + oDate.getDayName(weekDayIndex) + ' - '+oDate.getDate()+'</h5>';

                        weeks += '<div class="track">';
                        weeks += slots;
                        weeks += '</div>';

                        weeks += '</li>';
                    }

                    weeks += '</ul>';

                    return weeks;
                }

                function getTimeRange() {
                    var aRange = ['00:00'];
                    var slot = {left: 0, right: 0};
                    for (var i = 0; i < 46; i++) {
                        if (i % 2 == 0) {
                            slot.left += 1;
                            slot.right = '00';
                        } else {
                            slot.right = '30'
                        }
                        var str = String(slot.left);
                        if (str.length < 2) {
                            str = '0' + str;
                        }
                        aRange.push(str + ':' + slot.right);
                    }
                    return aRange;
                }

                /**
                 * get event in given date
                 * @param date
                 * **/
                function getEvents(date) {
                    var oEvents = {events: [], hasEvents: false, hasPending: false};

                    for (var i = 0; i < scope.events.length; i++) {
                        var oDate = new Date(scope.events[i].start).toDateString();

                        if (oDate == date) {
                            oEvents.events.push(scope.events[i]);
                            oEvents.hasEvents = true;

                            if (scope.events[i].pending) {
                                oEvents.hasPending = true;
                            }
                        }
                    }

                    return oEvents;
                }

                /**
                 * render calendar to element
                 * @param elem - target element
                 * @param oCalendar - calendar object that contains html
                 * **/
                function renderHtml(elem, html) {
                    elem.html(html);
                    $compile(elem.contents())(scope);
                }

                /**
                 * generate calendar
                 * @param monthIndex - index of month as in javascript Date object
                 * **/
                function generateCalendar(monthIndex, year) {
                    var oDate = new Date();

                    var oMeta = {
                        date: oDate,
                        thisMonth: oDate.getMonth(),
                        currMonth: monthIndex,
                        day: oDate.getDate(),
                        year: year,
                        calendar: []
                    };

                    var firstDateOfMonth = new Date(monthIndex + 1 + '-1-' + oMeta.year);
                    var firstWeekDay = firstDateOfMonth.getDay();
                    var daysInMonth = oDate.daysInMonth(monthIndex, oMeta.year);
                    var padding = '';

                    var count = firstWeekDay;
                    while (count > 0) {
                        padding += "<td class='prev-month'></td>";
                        --count;
                    }

                    for (var i = 1; i <= daysInMonth; i++) {
                        var actualIndex = i - 1;

                        if (firstWeekDay > 6) {
                            firstWeekDay = 0;
                            padding += "</tr><tr>";
                        }

                        var thisDate = new Date(monthIndex + 1 + '-' + i + '-' + oMeta.year);

                        var dateObj = {index: i, date: thisDate.toISOString()};
                        var eventsInThisDate = getEvents(thisDate.toDateString());

                        dateObj = Object.assign(dateObj, eventsInThisDate);

                        var classHasEvents = '';
                        var classHasPendingEvents = '';

                        if (dateObj.hasEvents) {
                            classHasEvents = 'has-events';
                        }
                        if (dateObj.hasPending) {
                            classHasPendingEvents = 'has-pending';
                        }

                        oMeta.calendar.push(dateObj);

                        if (i == oMeta.day && monthIndex == oMeta.thisMonth) {
                            padding += "<td data-index='" + i + "' ng-click='goToEvents(" + actualIndex + ")' class='currentmonth currentday " + classHasEvents + " " + classHasPendingEvents + "'><div class='date-container'><p>" + i + "</p></div></td>";
                        } else {
                            padding += "<td data-index='" + i + "' ng-click='goToEvents(" + actualIndex + ")' class='currentmonth " + classHasEvents + " " + classHasPendingEvents + "'><div class='date-container'><p>" + i + "</p></div></td>";
                        }

                        firstWeekDay++;
                    }

                    var weekDays = '';

                    for (var i = 0; i < oDate.getWeek().length; i++) {
                        weekDays += '<td>' + oDate.getWeek()[i] + '</td>';
                    }

                    var ctable = "<table class='calendar'><thead><tr class='currentmonth'><th colspan='7'><button ng-click='prevMonth()' class='prevMonth'></button><p class='month-container'>" + oDate.getMonthName(monthIndex) + " " + oMeta.year + "</p><button ng-click='nextMonth()' class='nextMonth'></button></th></tr></thead>";
                    ctable += "<tr class='weekdays'>" + weekDays + "</tr>";
                    ctable += "<tr>";
                    ctable += padding;
                    ctable += "</tr></table>";

                    return {meta: oMeta, html: ctable};
                }
            }
        }
    }]);
})(angular);