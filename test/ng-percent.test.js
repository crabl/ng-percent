'use strict';

describe('ngPercent directive tests', function() {
    var elem,
        scope,
        elemmo,
        elemfpos,
        elemfpos5,
        elemcurrdisabled,
        elemnreq,
        elemfastfraction;

    beforeEach(module('ng-percent'));

    beforeEach(module('ng-percent', function($compileProvider){
      $compileProvider.directive('centsToDollars', function(){
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, elem, attrs, ngModel) {
            ngModel.$parsers.push(function(viewValue){
              return Math.round(parseFloat(viewValue || 0) * 100);
            });

            ngModel.$formatters.push(function (modelValue) {
              return (parseFloat(modelValue || 0) / 100).toFixed(2);
            });
          }
        };
      });
    }));

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-percent>");
        elemmo = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-model-options=\"{ updateOn:'blur' }\"  ng-percent>");
        elemfpos = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-percent fraction='0'>");
        elemfpos5 = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-percent fraction='5'>");
        elemcurrdisabled = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-percent='{{isPercent}}'>");
        elemnreq = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-percent fraction='2'>");
        elemfastfraction = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-percent>");
    }));


  it('should format Model float 0.12345 to "12.345%" view as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0.12345;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("12.345%");
     })
  );

  it('should format Model "0.123451" to "12.345%" view as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0.123451;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("12.345%");
     })
  );

  it('should format Model "0.123457" to "12.346%" (round) view as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0.123457;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("12.346%");
     })
  );

  describe("when percent-symbol is declared", function() {
    beforeEach(inject(function($rootScope) {
      scope = $rootScope.$new();
      elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-percent percent-symbol='#'>");
    }));

    it('should format with declared symbol',
      inject(function($rootScope,$compile) {
        scope.testModel = 0.12345;
        elem = $compile(elem)(scope);
        scope.$digest();
        expect(elem.val()).toEqual("12.345#");
      })
    );

    // angular-percentage-filter does not support an empty percent symbol
    xdescribe("when percent-symbol declared is empty", function() {
      beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
        elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-percent percent-symbol=''>");
      }));

      it('should format without symbol',
        inject(function($rootScope,$compile) {
          scope.testModel = 0.12345;
          elem = $compile(elem)(scope);
          scope.$digest();
          expect(elem.val()).toEqual("12.345");
        })
      );
    });
  });

  it('should set ngModel to 0.1234 from string 12.345% as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("12.345%");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(0.1234);
     })
  );

  it('should set ngModel to 12.3456 from string 1,234.56% as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("1,234.56%");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(12.3456);
     })
  );

  it('should set input value to 123123.45% and Model to float 1231.2345 from string 123123.45 as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("123123.45");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      expect(elem.val()).toEqual("123123.45%");
      expect(scope.testModel).toEqual(1231.2345);
     })
  );

  it('should trigger max error for 1999999 from string 1999999.0% as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("1999999.0%");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      elem.hasClass('ng-invalid-max')
      expect(elem.val()).toEqual("1999999%");
     })
  );

  it('should trigger min error for 0.01 from string 0.01% as percent',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("0.01%");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      elem.hasClass('ng-invalid-min')
      expect(elem.val()).toEqual("0.01%");
     })
  );

  it('should trigger ng-required error',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("");
      elem.triggerHandler('input');
      elem.hasClass('ng-invalid-required')
     })
  );

  describe('model value should be undefined when view value does not pass validation', function() {

    it('should not set 0 value from string 0 when required min is not met',
      inject(function($rootScope,$compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("0");
        elem.triggerHandler('input');
        elem.triggerHandler('blur');
        expect(scope.testModel).toBeUndefined();
        expect(elem.val()).toEqual("0%");
      })
    );

    it('should not set 9999991 value from string 99999991 when required max is not met',
      inject(function($rootScope,$compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("99999991");
        elem.triggerHandler('input');
        elem.triggerHandler('blur');
        expect(scope.testModel).toBeUndefined();
        expect(elem.val()).toEqual("99999991%");
      })
    );

  });

  describe('when the min is set to zero or lower', function() {
    beforeEach(function() {
      elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='-2' max='999999' ng-required='true' ng-percent>");
    });

    xit('should set -0 value from string - ',
      inject(function($rootScope,$compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("-");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-0);
      })
    );
    xit('should set -0 value from string \'- \' ',
      inject(function($rootScope,$compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("- ");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-0);
      })
    );
    it('should set -1.11 value from string -1.11',
      inject(function($rootScope,$compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("-1.11");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-0.0111);
      })
    );
    it('should set -1.11 value from string $ -1.11',
      inject(function($rootScope,$compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("-1.11%");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-0.0111);
      })
    );
  });

  it('issue #14 - should set input value to 123.45% from string 123.45 as locale percent with ng-model-options="{ updateOn:\'blur\' }"',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elemmo = $compile(elemmo)(scope);
      elemmo.val("123.45");
      elemmo.triggerHandler('input');
      elemmo.triggerHandler('blur');
      expect(scope.testModel).toEqual(1.2345);
      expect(elemmo.val()).toEqual('123.45%');
     })
  );

  it('issue #28 - Fast fraction - Input should not filter fast fraction notation ej: .5"',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elemmo = $compile(elemfastfraction)(scope);
      elemmo.val(".5");
      elemmo.triggerHandler('input');
      elemmo.triggerHandler('blur');
      expect(scope.testModel).toEqual(0.005);
      expect(elemmo.val()).toEqual('0.5%');
     })
  );

  it('issue #28 - Fast fraction - Input should not filter fast fraction notation ej: -.5"',
    inject(function($rootScope,$compile) {
      scope.testModel = 0;
      elemmo = $compile(elemfastfraction)(scope);
      elemmo.val("-.5");
      elemmo.triggerHandler('input');
      elemmo.triggerHandler('blur');
      expect(scope.testModel).toEqual(-0.005);
      expect(elemmo.val()).toEqual('-0.5%');
     })
  );

  it('Adding an optional fraction value to take advantage of the percent filter\'s third param fraction="0"',
    inject(function($rootScope,$compile) {
      scope.testModel = 1.2345;
      elem = $compile(elemfpos)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("123%");
     })
  );

  it('Adding an optional fraction value to take advantage of the percent filter\'s third param fraction="5"',
    inject(function($rootScope,$compile) {
      scope.testModel = 1.2345678;
      elem = $compile(elemfpos5)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("123.45678%");
     })
  );

  it('Adding an optional fraction value to take advantage of the percent filter\'s third param fraction="0" model="a"',
    inject(function($rootScope,$compile) {
      scope.testModel = 'a';
      elem = $compile(elemfpos)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("");
     })
  );

  it('Disable ng-percent format',
    inject(function($rootScope,$compile) {
      scope.testModel = 123.45;
      scope.isPercent = false;
      elem = $compile(elemcurrdisabled)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("123.45");
     })
  );

  it('Not required and not a number with max and min',
    inject(function($rootScope,$compile) {
      scope.testModel = 'a';
      scope.isPercent = false;
      elem = $compile(elemnreq)(scope);
      elem.triggerHandler('input');
      scope.$digest();
      expect(elem.val()).toEqual("");
     })
  );

  describe("issue #18 - ng-percent doesn't play well with other directives when loosing focus", function(){
    var el;

    beforeEach(inject(function($compile) {
      var template = "<input ng-model='modelInCents' cents-to-dollars ng-percent>";
      el = $compile(template)(scope);
      scope.modelInCents = 100;
      scope.$digest();
    }));

    it("should load the model correctly",
      inject(function($compile){
        expect(el.val()).toEqual('100%');
      }));

    it("should update the model correctly",
      inject(function($compile){
        el.val("123.45%");
        el.triggerHandler('input');
        el.triggerHandler('blur');

        expect(scope.modelInCents).toEqual(123);
        expect(el.val()).toEqual('123%');
      }));
  });
});
