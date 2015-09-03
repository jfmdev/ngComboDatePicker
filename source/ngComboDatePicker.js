
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

// Create directive.
ngComboDatePicker.directive('ngComboDatePicker', function() {
    return {
        restrict: 'AEC',
        scope: {
            ngModel: '=',
            ngDate : '@',
            ngMin : '@',
            ngMax : '@',
            ngOrder: '@'
        },
        controller: function($scope) {
            // initilizar ngModel. ver si model esta definido, sobreescirbirlo con date o darle el valor por defecto

            // permitir usar nombres para los meses

            // verificar cantidad de dias para cada mes, verificar si es mes bisiesto. para ello tendria una variables dias que iria en el ng-repeat

            // verify ngorder

            // adfasdf
            $scope.date = $scope.ngModel.getDate();
            $scope.month = $scope.ngModel.getMonth() + 1;
            $scope.year = $scope.ngModel.getFullYear();
        },
        template: function() {
            var html = '<span>Hola {{ngModel}}-{{ngOrder}}-{{ngMin}}-{{ngMax}}</span>';

            // usar ng-repeat en vez de hacer esto.
            html += '<select ng-model="date">';
            for(var i=1; i<=31; i++) html += '<option value="'+i+'">'+i+'</option>';
            html += '</select>';

            html += '<select ng-model="month">';
            for(var i=1; i<=12; i++) html += '<option value="'+i+'">'+i+'</option>';
            html += '</select>';

            html += '<select ng-model="year">';
            for(var i=2000; i<=2030; i++) html += '<option value="'+i+'">'+i+'</option>';
            html += '</select>';

            return html;
        }
    }
});
