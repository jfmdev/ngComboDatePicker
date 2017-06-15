/*
 * ngComboDatePicker v1.5.1
 * http://github.com/jfmdev/ngComboDatePicker
 * «Copyright 2015 Jose F. Maldonado»
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Declare module.
angular.module("ngComboDatePicker", [])

// Declare directive.
.directive('ngComboDatePicker', function() {
    // Define fuction for getting the maximum date for a month.
    function maxDate(month, year) {
        var res = 31;
        if(month != null) {
            if(month == 4 || month == 6 || month == 9 || month == 11) {
                res = 30;
            }
            if(year != null && month == 2) {
                res = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)? 29 : 28;
            }
        }
        return res;
    }

    // Define function for adjust timezone.
    function adjustTimezone (myDate, myTimezone) {
        var offset = isNaN(myTimezone)? new Date().getTimezoneOffset() : parseFloat(myTimezone)*60;
        return new Date(myDate.getTime() + offset*60*1000);                           
    }
    
    // Define function for parse dates.
    function parseDate(myDate, myTimezone) {
        var res = null;
        if(myDate !== undefined && myDate !== null) {
            if(myDate instanceof Date) {
                res = myDate;
            } else {
                if(typeof myDate == 'number' || typeof myDate == 'string') {
                    // Parse date.
                    res = new Date(isNaN(myDate)? myDate : parseInt(myDate, 10));
                    
                    // Adjust timezone.
                    res = adjustTimezone(res, myTimezone);
                }
            }
        }
        return res;
    };

    // Function to parse an string returning either a number or 'null' (instead of NaN).
    function parseIntStrict(num) {
        return (num !== null && num !== '' && parseInt(num) != NaN)? parseInt(num) : null;
    };
    
    // Function to parse a JSON object.
    function parseJsonPlus(jsonObj) {
        var res = null;
        if(jsonObj != null) {
            try{ res = JSON.parse(jsonObj); }catch(ex) {}
            if(res == null) try{ res = JSON.parse(jsonObj.replace(/'/g, '"')); }catch(ex) {}
        }
        return res;
    }
    
    // Create directive.
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=',
            ngDate : '@',
            ngMinDate : '@',
            ngMaxDate : '@',
            ngMinModel : '=?',
            ngMaxModel : '=?',
            ngMonths : '@',
            ngTimezone: '@',
            ngOrder: '@',
            ngAttrsDate: '@',
            ngAttrsMonth: '@',
            ngAttrsYear: '@',
            ngDisabled: '=?',
            ngYearOrder: '@',
            ngPlaceholder: '@',
            ngPlaceholderEnabled: '@',
            ngRequired: '@'
        },
        require: 'ngModel',
        controller: ['$scope', function($scope) {
            // Initialize models.
            $scope.ngModel = parseDate($scope.ngModel, $scope.ngTimezone);
            $scope.ngMinModel = parseDate($scope.ngMinModel, $scope.ngTimezone);
            $scope.ngMaxModel = parseDate($scope.ngMaxModel, $scope.ngTimezone);
            
            // Initialize attributes variables.
            $scope.ngAttrsDate = parseJsonPlus($scope.ngAttrsDate);
            $scope.ngAttrsMonth = parseJsonPlus($scope.ngAttrsMonth);
            $scope.ngAttrsYear = parseJsonPlus($scope.ngAttrsYear);
            
            // Verify if initial date was defined.
            var initDate = parseDate($scope.ngDate, $scope.ngTimezone);
            if(initDate != null) $scope.ngModel = initDate;

            // Initialize order.
            if(typeof $scope.ngOrder != 'string') {
                $scope.ngOrder = 'dmy';
            } else {
                $scope.ngOrder = $scope.ngOrder.toLowerCase();
            }

            // Initialize minimal and maximum values.
            if($scope.ngMinDate) {
                $scope.ngMinModel = parseDate($scope.ngMinDate, $scope.ngTimezone);
            }
            if(!$scope.ngMinModel) {
                var now = new Date();
                $scope.ngMinModel = new Date(now.getFullYear()-100, now.getMonth(), now.getDate(),
                                          now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
            }
            if($scope.ngMaxDate) {
                $scope.ngMaxModel = parseDate($scope.ngMaxDate, $scope.ngTimezone);
            }
            if(!$scope.ngMaxModel) {
                $scope.ngMaxModel = new Date();
            }

            // Watch for changes in the minimum and maximum dates.
            $scope.$watch('[ngMinModel, ngMaxModel]', function() {
                // Update list of years (if possible).
                if($scope.ngMinModel && $scope.ngMaxModel) {
                    // Get list of years.
                    $scope.years = [];
                    for(var i=$scope.ngMinModel.getFullYear(); i<=$scope.ngMaxModel.getFullYear(); i++) {
                        $scope.years.push({value:i, name:i});
                    }

                    // Verify if the order of the years must be reversed.
                    if(typeof $scope.ngYearOrder == 'string' && $scope.ngYearOrder.indexOf('des') == 0) {
                        $scope.years.reverse();
                    }

                    // Prepend the years placeholder
                    if($scope.placeHolders) $scope.years.unshift($scope.placeHolders[0]);
                }
                
                // Verify if selected date is in the valid range.
                if($scope.ngModel && $scope.ngMinModel && $scope.ngModel < $scope.ngMinModel) $scope.ngModel = $scope.ngMinModel;
                if($scope.ngModel && $scope.ngMaxModel && $scope.ngModel > $scope.ngMaxModel) $scope.ngModel = $scope.ngMaxModel;
            });

            // Initialize place holders.
            $scope.placeHolders = null;
            if($scope.ngPlaceholder !== undefined && $scope.ngPlaceholder !== null && (typeof $scope.ngPlaceholder == 'string' || Array.isArray($scope.ngPlaceholder))) {
                var holders = typeof $scope.ngPlaceholder == 'string'? $scope.ngPlaceholder.split(',') : $scope.ngPlaceholder;
                if(holders.length == 3) {
                    $scope.placeHolders = [];
                    for(var h=0; h<holders.length; h++) {
                        $scope.placeHolders.push({value:'', name:holders[h], disabled:false});
                    }
                }
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
            
            // Update list of months.
            $scope.updateMonthList = function(year) {
                // Parse parameter.
                year = parseIntStrict(year);

                // Some months can not be choosed if the year matchs with the year of the minimum or maximum dates.
                var start = year !== null && year == $scope.ngMinModel.getFullYear()? $scope.ngMinModel.getMonth() : 0;
                var end = year !== null && year == $scope.ngMaxModel.getFullYear()? $scope.ngMaxModel.getMonth() : 11;

                // Generate list.
                $scope.months = [];
                if($scope.placeHolders) $scope.months.push($scope.placeHolders[1]);
                for(var i=start; i<=end; i++) {
                    $scope.months.push({value:i, name:monthNames[i]});
                }
            };

            // Initialize list of days.
            $scope.updateDateList = function(month, year) {
                // Parse parameters.
                month = parseIntStrict(month);
                year = parseIntStrict(year);
                
                // Start date is 1, unless the selected month and year matchs the minimum date.
                var start = 1;
                if(month !== null && month == $scope.ngMinModel.getMonth() && 
                   year !== null && year == $scope.ngMinModel.getFullYear()) {
                    start = $scope.ngMinModel.getDate();
                }

                // End date is 30 or 31 (28 or 29 in February), unless the selected month and year matchs the maximum date.
                var end = maxDate(month !== null? (month+1) : null, year);
                if(month !== null && month == $scope.ngMaxModel.getMonth() && 
                   year !== null && year == $scope.ngMaxModel.getFullYear()) {
                    end = $scope.ngMaxModel.getDate();
                }

                // Generate list.
                $scope.dates = [];
                if($scope.placeHolders) $scope.dates.push($scope.placeHolders[2]);
                for(var i=start; i<=end; i++) {
                    $scope.dates.push({value:i, name:i});
                }
            };
        } ],
        
        link: function(scope, element, attrs, ngModelCtrl) {
            // Initialize variables.
            var jqLite = angular.element;
            var children = jqLite(element[0]).children();
            var order = scope.ngOrder.split('');

            // Reorder elements.
            for(var i=0; i<order.length; i++) {
                if(order[i] == 'd') jqLite(element[0]).append(children[0]);
                if(order[i] == 'm') jqLite(element[0]).append(children[1]);
                if(order[i] == 'y') jqLite(element[0]).append(children[2]);
            }
            
            // Set formatter function.
            ngModelCtrl.$formatters.push(function(modelValue) {
                var res = {date: null, month: null, year: null};

                // Verify if model is defined.
                if (modelValue) {
                    res.date = modelValue.getDate();
                    res.month = modelValue.getMonth();
                    res.year = modelValue.getFullYear();
                } else {
                    res.date = '';
                    res.month = '';
                    res.year = '';
                    
                    if(scope.placeHolders) {
                        scope.placeHolders[0].disabled = false;
                        scope.placeHolders[1].disabled = false;
                        scope.placeHolders[2].disabled = false;
                    }
                }

                // Hide or show days and months according to the min and max dates.
                scope.updateMonthList(res.year);
                scope.updateDateList(res.month, res.year);
                return res;
            });
            
            // Set render function.
            ngModelCtrl.$render = function() {
                scope.date  = ngModelCtrl.$viewValue.date;
                scope.month = ngModelCtrl.$viewValue.month;
                scope.year  = ngModelCtrl.$viewValue.year;
            };
            
            // Set watch function for update the view value.
            scope.$watch('date + "-" + month + "-" + year', function(newValue, oldValue) {
                if(newValue != oldValue) {
                    ngModelCtrl.$setViewValue({
                        date: scope.date,
                        month: scope.month,
                        year: scope.year
                    });
                }
            });
            
            // Override function to check if the value is empty.
            ngModelCtrl.$isEmpty = function(viewValue) {
                return viewValue.date == null || viewValue.date == '' || 
                       isNaN(parseInt(viewValue.month)) ||
                       viewValue.year == null || viewValue.year == '';
            };
            
            // Set parser function.
            ngModelCtrl.$parsers.push(function(viewValue) {
                var res = null;

                // Check that the three combo boxes have values.
                if(viewValue.date != null && viewValue.date != '' && !isNaN(parseInt(viewValue.month)) && viewValue.year != null && viewValue.year != '') {
                    var maxDay = maxDate(viewValue.month+1, viewValue.year);
                    
                    var hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
                    if(scope.ngModel != null) {
                        hours = scope.ngModel.getHours();
                        minutes = scope.ngModel.getMinutes();
                        seconds = scope.ngModel.getSeconds();
                        milliseconds = scope.ngModel.getMilliseconds();
                    }
                    
                    res = new Date(viewValue.year, viewValue.month, viewValue.date > maxDay? maxDay : viewValue.date, hours, minutes, seconds, milliseconds);
                }
                
                // Disable placeholders after selecting a value.
                if(scope.placeHolders && angular.isUndefined(scope.ngPlaceholderEnabled)) {
                    if(scope.year != '') scope.placeHolders[0].disabled = true;
                    if(scope.month != '') scope.placeHolders[1].disabled = true;
                    if(scope.date != '') scope.placeHolders[2].disabled = true;
                }
                
                // Hide or show days and months according to the min and max dates.
                scope.updateMonthList(viewValue.year);
                scope.updateDateList(viewValue.month, viewValue.year);
                          
                return res;
            });
            
            // Method called when one of the combo boxes is touched.
            scope.touched = function() {
                ngModelCtrl.$touched = true;
                ngModelCtrl.$untouched = false;
            };
        },
        template: function(element, attrs) {
            // Verify if addtional attributes were defined.
            var strAttrs = ['', '', ''];
            var attrNames = ['ngAttrsDate', 'ngAttrsMonth', 'ngAttrsYear'];
            for(var i=0; i<3; i++) {
                try{
                    // Verify if the attributes were defined.
                    if(attrs && attrs[attrNames[i]]) {
                        // Iterate over each attribute.
                        eval("var attrsAux= " + attrs[attrNames[i]]);
                        for(var key in attrsAux) {
                            var value = attrsAux[key];
                            if(typeof value == "boolean") {
                                if(value) strAttrs[i] += key + ' ';
                            } else {
                                if(typeof value == "string" && value.indexOf('"') > 0) { value = value.replace(/"/g, '&quot;'); }
                                strAttrs[i] += key + '="' + value + '" ';
                            }
                        }
                    }
                }catch(err){console.log(err);}
            }

            // Generate HTML code.
            var html =
                '<select ng-disabled="ngDisabled === true || ngDisabled[0] === true" ng-model="date" ng-blur="touched()" '+strAttrs[0]+' ng-options="date.value as date.name disable when date.disabled for date in dates"></select>' +
                '<select ng-disabled="ngDisabled === true || ngDisabled[1] === true" ng-model="month" ng-blur="touched()" '+strAttrs[1]+' ng-options="month.value as month.name disable when month.disabled for month in months"></select>' +
                '<select ng-disabled="ngDisabled === true || ngDisabled[2] === true" ng-model="year" ng-blur="touched()" '+strAttrs[2]+' ng-options="year.value as year.name disable when year.disabled for year in years"></select>'
            ;

            return html;
        }
    }
});
