ngComboDatePicker
=================

_Select dates with combo boxes_

**ngComboDatePicker** is an Angular directive to select dates using combo boxes.

[See the live demos and read the docs](http://jfmdev.github.io/ngComboDatePicker/ "ngComboDatePicker - Live demos and docs")

Usage
-----

In order to use this directive:

**1)** Include the library (located in the `source` folder) in the header of your HTML files:

```html
<script type="text/javascript" src="angular.min.js"></script>
<script type="text/javascript" src="ngComboDatePicker.min.js"></script>
```

**2)** Then add `ngComboDatePicker` as a dependency when declaring your Angular's app:

```javascript
var app = angular.module('myApp',['ngComboDatePicker']);
```

**3)** Then include the directive in your HTML code. For example:

```html
<ng-combo-date-picker ng-model="myDate"></ng-combo-date-picker>
```

or

```html
<span ng-combo-date-picker="exp" ng-model="myDate"></span>
```

Attributes
----------

The _ngComboDatePicker_ directive supports the following attributes:

Name | Description
------------- | ----
`ngModel`  | (mandatory) A _Date_ object in which the picked date is going to be stored. This attribute can also be used to define the initial value of the picker.
`ngDate`  | A string representing the initial date of the picker.
`ngMinDate`  | A _string_ representing the minimum date that can be picked. By default the minimum date is 100 years before the current day.
`ngMaxDate`  | A _string_ representing the maximum date that can be picked. By default the maximum date is the current day.
`ngMonths`  | A _string_ with the names of the twelve months, separated by comma. 
`ngOrder`  | A _string_ with the characters "d", "m" and "y" indicating in which order the combo boxes must be displayed. By default, the combo boxes are displayed in the order "dmy".
`ngAttrsDate`  | A JSON object with the attributes to add to the `select` element for the date. 
`ngAttrsMonth`  | A JSON object with the attributes to add to the `select` element for the month. 
`ngAttrsYear`  | A JSON object with the attributes to add to the `select` element for the year. 
`ngYearOrder`  | A _string_ indicating if the years must be sorted in "ascending" or "descending" order. 
`ngTimezone`  | A _number_ indicating timezone to be used. By default the timezone of the client is used. 
`ngPlaceholder`  | A _string_ with the placeholders for the year, month and date combo boxes (in that order), separated by comma. 

License
-------

ngComboDatePicker is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ngComboDatePicker is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with ngComboDatePicker. If not, see <http://www.gnu.org/licenses/>.