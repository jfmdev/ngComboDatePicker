/*
 * ngComboDatePicker v1.1.2
 * http://github.com/jfmdev/ngComboDatePicker
 * «Copyright 2015 Jose F. Maldonado»
 * License: LGPLv3 (http://www.gnu.org/licenses/lgpl-3.0.html)
 */

// Declare module.
angular.module("ngComboDatePicker", [])

// Create directive.
.directive('ngComboDatePicker', function() {
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=',
            ngDate : '@',
            ngMinDate : '@',
            ngMaxDate : '@',
            ngMonths : '@',
            ngOrder: '@',
            ngAttrsDate: '@',
            ngAttrsMonth: '@',
            ngAttrsYear: '@',
			ngYearOrder: '@'
        },
        controller: ['$scope', function($scope) {
            // Define function for parse dates.
            function parseDate(myDate) {
                var res = null;
                if(myDate !== undefined && myDate !== null) {
                    if(myDate instanceof Date) {
                        res = myDate;
                    } else {
                        if(typeof myDate == 'number' || typeof myDate == 'string') {
                            res = new Date(isNaN(myDate)? myDate : parseInt(myDate, 10));
                        }
                    }
                }
                return res;
            };

            // Define fuction for getting the maximum date for a month.
            function maxDate(month, year) {
                var res = 31;
                if(month != null) {
                    if(month == 4 || month == 6 || month == 9 || month == 11) {
                        res = 30;
                    }
                    if(year != null && month == 2) {
                        res = year % 4 == 0 && year % 100 != 0? 29 : 28;
                    }
                }
                return res;
            }

            // Function to parse a JSON object.
            function parseJsonPlus(jsonObj) {
                var res = null;
                if(jsonObj != null) {
                    try{ res = JSON.parse(jsonObj); }catch(ex) {}
                    if(res == null) try{ res = JSON.parse(jsonObj.replace(/'/g, '"')); }catch(ex) {}
                }
                return res;
            }
            
            // Initialize model.  
            $scope.ngModel = parseDate($scope.ngModel);

            // Initialize attributes variables.
            $scope.ngAttrsDate = parseJsonPlus($scope.ngAttrsDate);
            $scope.ngAttrsMonth = parseJsonPlus($scope.ngAttrsMonth);
            $scope.ngAttrsYear = parseJsonPlus($scope.ngAttrsYear);
            
            // Verify if initial date was defined.
            var initDate = parseDate($scope.ngDate);
            if(initDate != null) $scope.ngModel = initDate;

            // Initialize order.
            if(typeof $scope.ngOrder != 'string') {
                $scope.ngOrder = 'dmy';
            } else {
                $scope.ngOrder = $scope.ngOrder.toLowerCase();
            }

            // Initialize minimal and maximum values.
            $scope.minDate = parseDate($scope.ngMinDate);
            if($scope.ngMinDate == null) {
                var now = new Date();
                $scope.minDate = new Date(now.getFullYear()-100, now.getMonth(), now.getDate(),
                                          now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
            }
            $scope.maxDate = parseDate($scope.ngMaxDate);
            if($scope.maxDate == null) {
                $scope.maxDate = new Date();
            }

            // Verify if selected date is in the valid range.
            if($scope.ngModel < $scope.minDate) $scope.ngModel = $scope.minDate;
            if($scope.ngModel > $scope.maxDate) $scope.ngModel = $scope.maxDate;

            // Initialize list of years.
            $scope.years = [];
            for(var i=$scope.minDate.getFullYear(); i<=$scope.maxDate.getFullYear(); i++) {
                $scope.years.push(i);
            }

            // Verify if the order of the years must be reversed.
            if(typeof $scope.ngYearOrder == 'string' && $scope.ngYearOrder.indexOf('des') == 0) {
                $scope.years.reverse();
            }

            // Initialize list of months names.
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if($scope.ngMonths !== undefined && $scope.ngMonths !== null) {
                    if(typeof $scope.ngMonths == 'string') {
                        var months = $scope.ngMonths.split(',');
                        if(months.length == 12) monthNames = months;
                    }
                    if(Array.isArray($scope.ngMonths) && $scope.ngMonths.length == 12) {
                         monthNames = $scope.ngMonths;
                    }
                }

            // Initialize list of months.
            $scope.updateMonthList = function() {
                // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
                var start = $scope.ngModel != null && $scope.ngModel.getFullYear() == $scope.minDate.getFullYear()? $scope.minDate.getMonth() : 0;
                var end = $scope.ngModel != null && $scope.ngModel.getFullYear() == $scope.maxDate.getFullYear()? $scope.maxDate.getMonth() : 11;

                // Generate list.
                $scope.months = [];
                for(var i=start; i<=end; i++) {
                    $scope.months.push({index:i, name:monthNames[i]});
                }
            };

            // Initialize list of days.
            $scope.updateDateList = function() {
                // Start date is 1, unless the selected month and year matchs the minimum date.
                var start = 1;
                if($scope.ngModel != null && $scope.ngModel.getMonth() == $scope.minDate.getMonth() && $scope.ngModel.getFullYear() == $scope.minDate.getFullYear()) {
                    start = $scope.minDate.getDate();
                }

                // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matchs the maximum date.
                var end = $scope.ngModel != null? maxDate($scope.ngModel.getMonth()+1, $scope.ngModel.getFullYear()) : maxDate(null, null);
                if($scope.ngModel != null && $scope.ngModel.getMonth() == $scope.maxDate.getMonth() && $scope.ngModel.getFullYear() == $scope.maxDate.getFullYear()) {
                    end = $scope.maxDate.getDate();
                }

                // Generate list.
                $scope.dates = [];
                for(var i=start; i<=end; i++) {
                    $scope.dates.push(i);
                }
            };


            // When the model is updated, update the combo boxes.
            $scope.modelUpdated = function() {
                // Update combo boxes.
                $scope.date = $scope.ngModel != null? $scope.ngModel.getDate() : null;
                $scope.month = $scope.ngModel != null? $scope.ngModel.getMonth() : null;
                $scope.year = $scope.ngModel != null? $scope.ngModel.getFullYear() : null;

                // Hide or show days and months according to the min and max dates.
                $scope.updateMonthList();
                $scope.updateDateList();
            }
            // Watch for changes in the model.
            $scope.$watch('ngModel', function() {
                $scope.modelUpdated();
            });

            // When a combo box is changed, update the model and verify which values in the combo boxes for dates and months can be show.
            $scope.onChange = function(part) {
                // Update model.
                if($scope.date != null && $scope.month != null && $scope.year != null) {
                    var maxDay = maxDate($scope.month+1, $scope.year);
                    
                    var hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
                    if($scope.ngModel != null) {
                        hours = $scope.ngModel.getHours();
                        minutes = $scope.ngModel.getMinutes();
                        seconds = $scope.ngModel.getSeconds();
                        milliseconds = $scope.ngModel.getMilliseconds();
                    }
                    
                    $scope.ngModel = new Date($scope.year, $scope.month, $scope.date > maxDay? maxDay : $scope.date, hours, minutes, seconds, milliseconds);
                }
                
                // Hide or show days and months according to the min and max dates.
                $scope.updateMonthList();
                $scope.updateDateList();
            };

            $scope.getSomething = function() { return 'color:red;'; };
        } ],
        link: function(scope, element, attrs) {
            // Initialize variables.
            var jqLite = angular.element;
            var children = jqLite(element[0]).children();
            var order = scope.ngOrder.split('');

            // Add attributes.
            if(scope.ngAttrsDate != null) jqLite(children[0]).attr( scope.ngAttrsDate );
            if(scope.ngAttrsMonth != null) jqLite(children[1]).attr( scope.ngAttrsMonth );
            if(scope.ngAttrsYear != null) jqLite(children[2]).attr( scope.ngAttrsYear );

            // Reorder elements.
            for(var i=0; i<order.length; i++) {
                if(order[i] == 'd') jqLite(element[0]).append(children[0]);
                if(order[i] == 'm') jqLite(element[0]).append(children[1]);
                if(order[i] == 'y') jqLite(element[0]).append(children[2]);
            }
        },
        template: function() {
            var html =
                '<select ng-model="date" ng-change="onChange(\'date\')" ng-options="date for date in dates"></select>' +
                '<select ng-model="month" ng-change="onChange(\'month\')" ng-options="month.index as month.name for month in months"></select>' +
                '<select ng-model="year" ng-change="onChange(\'year\')" ng-options="year for year in years"></select>'
            ;

            return html;
        }
    }
});
