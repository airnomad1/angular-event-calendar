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

    app.directive('event', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'calendar.html',
            link: function (scope, elem, attr) {
                scope.calendar = generateCalendar(0);

                elem.html(scope.calendar.html);
                $compile(elem.contents())(scope);


                scope.prevMonth = function () {
                    scope.calendar = generateCalendar(scope.calendar.meta.currMonth - 1);
                    elem.html(scope.calendar.html);
                    $compile(elem.contents())(scope);
                };

                scope.nextMonth = function () {
                    scope.calendar = generateCalendar(scope.calendar.meta.currMonth + 1);
                    elem.html(scope.calendar.html);
                    $compile(elem.contents())(scope);
                };

                /**
                 * generate calendar
                 * @param monthIndex - index of month as in javascript Date object
                 * **/

                function generateCalendar(monthIndex) {
                    var oDate = new Date();

                    var oMeta = {
                        date: new Date(),
                        currMonth: monthIndex,
                        day: oDate.getDate(),
                        year: oDate.getFullYear()
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

                        if (i == oMeta.day && monthIndex == oMeta.currMonth) {
                            padding += "<td class='currentday'  onMouseOver='this.style.background=\"#00FF00\"; this.style.color=\"#FFFFFF\"' onMouseOut='this.style.background=\"#FFFFFF\"; this.style.color=\"#00FF00\"'>" + i + "</td>";
                        } else {
                            padding += "<td class='currentmonth' onMouseOver='this.style.background=\"#00FF00\"' onMouseOut='this.style.background=\"#FFFFFF\"'>" + i + "</td>";
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
                    return {meta: oMeta, html: ctable};
                }
            }
        }
    }])

})(angular);