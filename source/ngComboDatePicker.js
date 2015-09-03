
// Declare module.
var ngComboDatePicker = angular.module("ngComboDatePicker", []);

ngComboDatePicker.directive('ngSparkline', function() {
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=ngModel'
        },
        template: '<div class="sparkline"><h4>Weather for {{ngModel}}</h4></div>'
    }
});

// TODO:
// - Probar los parametros con @ usando strings y variables del $scope padre.
// - Probar con diferentes fechas minimas y maximas (y los valores por defecto).
// - Probar con diferentes meses (usando strings y arrays).

// Create directive.
ngComboDatePicker.directive('ngComboDatePicker', function() {
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=',
            ngDate : '@',
            ngMinDate : '@',
            ngMaxDate : '@',
            ngMonths : '@',
            ngOrder: '@'
        },
        controller: function($scope) {
            // Define function for parse dates.
            $scope.parseDate = function(myDate) {
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

            // Initialize model.
            $scope.ngModel = $scope.parseDate($scope.ngModel);
            if($scope.ngModel == null) $scope.ngModel = new Date();

            // Verify if initial date was defined.
            var initDate = $scope.parseDate($scope.ngDate);
            if(initDate != null) $scope.ngModel = initDate;

            // Initialize minimal and maximum values.
            $scope.minDate = $scope.parseDate($scope.ngMinDate);
            if($scope.ngMinDate == null) { var now = new Date(); $scope.minDate = new Date(now.getFullYear()-100, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()); }
            $scope.maxDate = $scope.parseDate($scope.ngMaxDate);
            if($scope.maxDate == null) $scope.maxDate = new Date();

            // Verify if selected date is in the valid range.
            if($scope.ngModel < $scope.minDate) $scope.ngModel = $scope.minDate;
            if($scope.ngModel < $scope.maxDate) $scope.ngModel = $scope.maxDate;

            // Initialize list of years.
            $scope.years = [];
            for(var i=$scope.minDate.getFullYear(); i<=$scope.maxDate.getFullYear(); i++) {
                $scope.years.push(i);
            }

            // Initialize list of months.
            $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            if($scope.ngMonths !== undefined && $scope.ngMonths !== null) {
                if(typeof $scope.ngMonths == 'string') {
                    var months = $scope.ngMonths.split(',');
                    if(months.length == 12) $scope.months = months;
                }
                if(Array.isArray($scope.ngMonths) && $scope.ngMonths.length == 12) {
                     $scope.months = $scope.ngMonths;
                }
            }

            // Initialize list of days.
            $scope.dates = [];
            for(var i=1; i<=31; i++) {
                $scope.dates.push(i);
            }

            // When the model is updated, validate is value and update the combo boxes.
            $scope.modelUpdated = function() {
                // Update combo boxes.
                $scope.date = $scope.ngModel.getDate();
                $scope.month = $scope.ngModel.getMonth()+'';
                $scope.year = $scope.ngModel.getFullYear();
            }
            // List for changes in the model.
            $scope.$watch('ngModel', function() {
                console.log("hola " + $scope.ngOrder);
                $scope.modelUpdated();
            });
            //$scope.modelUpdated();

            $scope.onChange = function(part) {
                // Update model.
                $scope.ngModel = new Date($scope.year, $scope.month, $scope.date, $scope.ngModel.getHours(), $scope.ngModel.getMinutes(), $scope.ngModel.getSeconds(), $scope.ngModel.getMilliseconds());

// TODO: Verify if the list of months or dates must be modified.
                console.log(part);
            };

        },
        template: function() {
            var html = '<span>Hola {{ngModel}}-{{ngOrder}}-{{ngMin}}-{{ngMax}}</span>';
// TODO: mostrar segun el orden.
            html += '<select ng-model="date" ng-change="onChange(\'date\')" ng-options="date for date in dates"></select>';
            html += '<select ng-model="month" ng-change="onChange(\'month\')" ng-options="idx as month for (idx, month) in months"></select>';
            html += '<select ng-model="year" ng-change="onChange(\'year\')" ng-options="year for year in years"></select>';

            return html;
        }
    }
});
