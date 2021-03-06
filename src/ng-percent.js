/*
 * ng-percent
 * http://crabl.net/

 * Version: 0.1.0 - 2015-09-09
 * License: MIT
 */

angular.module('ng-percent', ['percentage'])
    .directive('ngPercent', ['$filter', '$locale', function ($filter, $locale) {
        return {
            require: 'ngModel',
            scope: {
                min: '=min',
                max: '=max',
                percentSymbol: '@',
                ngRequired: '=ngRequired',
                fraction: '=fraction'
            },
            link: function (scope, element, attrs, ngModel) {

                if (attrs.ngPercent === 'false') return;

                var fract = (typeof scope.fraction !== 'undefined')?scope.fraction:2;

                function decimalRex(dChar) {
                    return RegExp("\\d|\\-|\\" + dChar, 'g');
                }

                function clearRex(dChar) {
                    return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0," + fract + "}", 'g');
                }

                function clearValue(value) {
                    value = String(value);
                    var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                    var cleared = null;

                    // Replace negative pattern to minus sign (-)
                    var neg_dummy = $filter('percentage')("-1", scope.fraction, percentSymbol());
                    var neg_idx = neg_dummy.indexOf("1");
                    var neg_str = neg_dummy.substring(0,neg_idx);
                    value = value.replace(neg_str, "-");

                    if(RegExp("^-[\\s]*%", 'g').test(value)) {
                        value = "-0";
                    }

                    if(decimalRex(dSeparator).test(value))
                    {
                        cleared = value.match(decimalRex(dSeparator))
                            .join("").match(clearRex(dSeparator));
                        cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                    }

                    return cleared;
                }

                function percentSymbol() {
                    if (angular.isDefined(scope.percentSymbol)) {
                        return scope.percentSymbol;
                    } else {
                        return '%';
                    }
                }

                function reformatViewValue(){
                    var formatters = ngModel.$formatters,
                        idx = formatters.length;

                    var viewValue = ngModel.$$rawModelValue;
                    while (idx--) {
                      viewValue = formatters[idx](viewValue);
                    }

                    ngModel.$setViewValue(viewValue);
                    ngModel.$render();
                }

                ngModel.$parsers.push(function (viewValue) {
                    var cVal = clearValue(viewValue);
                    //return parseFloat(cVal);
                    // Check for fast digitation (-. or .)
                    if(cVal == "." || cVal == "-.")
                    {
                        cVal = ".0";
                    }
                    return parseFloat(cVal) / 100;
                });

                element.on("blur", function () {
                    ngModel.$commitViewValue();
                    reformatViewValue();
                });

                ngModel.$formatters.unshift(function (value) {
                    return $filter('percentage')(value, scope.fraction, percentSymbol());
                });

                ngModel.$validators.min = function(cVal) {
                    if (!scope.ngRequired && isNaN(cVal)) {
                        return true;
                    }
                    if(typeof scope.min  !== 'undefined') {
                        return cVal >= parseFloat(scope.min);
                    }
                    return true;
                };

                ngModel.$validators.max = function(cVal) {
                    if (!scope.ngRequired && isNaN(cVal)) {
                        return true;
                    }
                    if(typeof scope.max  !== 'undefined') {
                        return cVal <= parseFloat(scope.max);
                    }
                    return true;
                };

                ngModel.$validators.fraction = function(cVal) {
                    if (!!cVal && isNaN(cVal)) {
                        return false;
                    }

                    return true;
                };
            }
        }
    }]);
