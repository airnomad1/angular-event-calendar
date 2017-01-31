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
                var date = new Date();
                scope.calendar = generateCalendar(date.getMonth(), date.getFullYear());
                renderCalendar(elem, scope.calendar.html);

                scope.prevMonth = function () {
                    var currMonth = scope.calendar.meta.currMonth;

                    if (currMonth == 0) {
                        scope.calendar = generateCalendar(11, scope.calendar.meta.year - 1);
                        renderCalendar(elem, scope.calendar.html);
                    } else {
                        scope.calendar = generateCalendar(scope.calendar.meta.currMonth - 1, scope.calendar.meta.year);
                        renderCalendar(elem, scope.calendar.html);
                    }
                };

                scope.nextMonth = function () {
                    var currMonth = scope.calendar.meta.currMonth;

                    if (currMonth == 11) {
                        scope.calendar = generateCalendar(0, scope.calendar.meta.year + 1);
                        renderCalendar(elem, scope.calendar.html);
                    } else {
                        scope.calendar = generateCalendar(scope.calendar.meta.currMonth + 1, scope.calendar.meta.year);
                        renderCalendar(elem, scope.calendar.html);
                    }
                };

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
                function renderCalendar(elem, oCalendar) {
                    elem.html(oCalendar);
                    $compile(elem.contents())(scope);
                }

                /**
                 * generate calendar
                 * @param monthIndex - index of month as in javascript Date object
                 * **/
                function generateCalendar(monthIndex, year) {
                    console.log(scope.events);

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
                        if (firstWeekDay > 6) {
                            firstWeekDay = 0;
                            padding += "</tr><tr>";
                        }

                        var thisDate = new Date(monthIndex + 1 + '-' + i + '-' + oMeta.year);

                        var dateObj = {date: thisDate.toISOString()};
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
                            padding += "<td class='currentmonth currentday " + classHasEvents + " " + classHasPendingEvents + "'>" + i + "</td>";
                        } else {
                            padding += "<td class='currentmonth " + classHasEvents + " " + classHasPendingEvents + "'>" + i + "</td>";
                        }

                        firstWeekDay++;
                    }

                    var weekDays = '';

                    for (var i = 0; i < oDate.getWeek().length; i++) {
                        weekDays += '<td>' + oDate.getWeek()[i] + '</td>';
                    }

                    var ctable = "<table class='calendar'><tr class='currentmonth'><th colspan='7'><button ng-click='prevMonth()'><<</button>" + oDate.getMonthName(monthIndex) + " " + oMeta.year + "<button ng-click='nextMonth()'>>></button></th></tr>";
                    ctable += "<tr class='weekdays'>" + weekDays + "</tr>";
                    ctable += "<tr>";
                    ctable += padding;
                    ctable += "</tr></table>";

                    console.log(oMeta);

                    return {meta: oMeta, html: ctable};
                }
            }
        }
    }])

})(angular);